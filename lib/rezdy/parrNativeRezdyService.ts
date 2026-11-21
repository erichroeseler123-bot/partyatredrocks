import "server-only";
import crypto from "node:crypto";
import {
  acquireOrReuseCheckoutHold,
  blockAmbiguousInFlightHold,
  finalizeConfirmedRezdyHold,
  getPublicVehicleAvailability,
  InMemoryCasInventoryStore,
  MissingParrSecretError,
  promoteHoldToPendingWithOutbox,
  releaseHoldAfterFailedAttempt,
  requireDedicatedParrSecret,
  SOLD_OUT_TRAVELER_MESSAGE,
  type InventoryRuntimeDeps,
} from "@/lib/inventory/parrVehicleInventory";
import { PARR_2027_OPTION_B_PRICING_AUTHORITY } from "@/lib/pricing";

const REZDY_V1_BASE = "https://api.rezdy.com/v1";

export type ParrNativeVehicleSlug = "suv" | "van";

export type ParrHiddenTestProductConfig = {
  slug: ParrNativeVehicleSlug;
  productCode: "P94HN4" | "PU8R6Y";
  internalCode: string;
  shortVehicleLabel: string;
  displayName: string;
  basePriceCents: number;
  calculatedBookingFeeCents: number;
  allInTotalCents: number;
  basePriceUsd: number;
  bookingFeeRatePct: number;
  bookingFeeLabel: string;
  expectedBookingFeeUsd: number;
  expectedTotalChargedUsd: number;
  maxPartySize: number;
  dailyVehicleCapacity: number;
};

function fromAuthority(slug: ParrNativeVehicleSlug): ParrHiddenTestProductConfig {
  const auth = PARR_2027_OPTION_B_PRICING_AUTHORITY[slug];
  return {
    slug: auth.slug,
    productCode: auth.rezdy.previewProductCode,
    internalCode: auth.rezdy.previewInternalCode,
    shortVehicleLabel: auth.shortLabel,
    displayName: auth.displayName,
    basePriceCents: auth.basePriceCents,
    calculatedBookingFeeCents: auth.calculatedBookingFeeCents,
    allInTotalCents: auth.allInTotalCents,
    basePriceUsd: auth.basePriceUsd,
    bookingFeeRatePct: auth.bookingFeeRatePct,
    bookingFeeLabel: auth.bookingFeeLabel,
    expectedBookingFeeUsd: auth.bookingFeeUsd,
    expectedTotalChargedUsd: auth.allInTotalUsd,
    maxPartySize: auth.maxGuests,
    dailyVehicleCapacity: auth.dailyVehicleCapacity,
  };
}

/**
 * Derived strictly from `PARR_2027_OPTION_B_PRICING_AUTHORITY` (zero duplicated price literals).
 */
export const PARR_PREVIEW_HIDDEN_PRODUCTS: Record<
  ParrNativeVehicleSlug,
  ParrHiddenTestProductConfig
> = {
  suv: fromAuthority("suv"),
  van: fromAuthority("van"),
};

export type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

const inFlightSubmissions = new Set<string>();

export function isPreviewOrDevEnvironment(): boolean {
  if (process.env.VERCEL_ENV === "preview") return true;
  if (process.env.NODE_ENV === "development" && process.env.VERCEL !== "1") return true;
  if (process.env.NODE_ENV === "test") return true;
  return false;
}

export function isParrNativeRezdyCheckoutEnabled(opts?: { previewQueryFlag?: string | null }): boolean {
  if (process.env.VERCEL_ENV === "production") {
    return process.env.PARR_NATIVE_REZDY_CHECKOUT_ENABLED === "true";
  }
  if (!isPreviewOrDevEnvironment()) return false;
  if (process.env.PARR_NATIVE_REZDY_CHECKOUT_ENABLED === "true") return true;
  if (opts?.previewQueryFlag === "native_preview") return true;
  return false;
}

/** Production activation is server-controlled; a public query string cannot enable it. */
export function isParrNativeApiEnabled(): boolean {
  return isPreviewOrDevEnvironment() ||
    (process.env.VERCEL_ENV === "production" && isParrNativeRezdyCheckoutEnabled());
}

export function getSafeRezdyStripePublishableKey(): string | null {
  const candidate = (
    process.env.REZDY_STRIPE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_REZDY_STRIPE_PUBLISHABLE_KEY ||
    ""
  ).trim();
  if (!candidate) return null;
  if (/^(sk_|rk_|whsec_)/i.test(candidate)) {
    throw new Error("SECURITY_VIOLATION: Refusing to load a Stripe secret/restricted key in publishable key slot.");
  }
  if (!/^pk_(live|test)_[A-Za-z0-9]+$/.test(candidate)) {
    return null;
  }
  return candidate;
}

function getRezdyApiKey(): string {
  const key = (process.env.REZDY_API_KEY || "").trim();
  if (!key) {
    throw new Error("REZDY_API_KEY is unavailable in the server runtime.");
  }
  return key;
}

function assertAllowedTestProductCode(productCode: string): void {
  const upper = productCode.trim().toUpperCase();
  if (upper !== "P94HN4" && upper !== "PU8R6Y") {
    throw new Error("Booking product is outside the approved PARR API product list.");
  }
}

export function buildParrResellerReference(idempotencyKey: string): string {
  const clean = (idempotencyKey || "").trim();
  if (clean.length < 8) {
    throw new Error("Missing or invalid checkout idempotencyKey (minimum 8 chars required).");
  }
  const digest = crypto.createHash("sha256").update(`parr-rezdy-v1:${clean}`, "utf8").digest();
  return `PARR-${digest.subarray(0, 16).toString("base64url")}`;
}

export function isFullyPaidRezdyConfirmation(booking: Record<string, unknown>, expectedTotal: number): boolean {
  return booking.status === "CONFIRMED" && Boolean(booking.orderNumber) &&
    Number.isFinite(Number(booking.totalPaid)) && Math.abs(Number(booking.totalPaid) - expectedTotal) < 0.01 &&
    (booking.totalAmount == null || Math.abs(Number(booking.totalAmount) - expectedTotal) < 0.01) &&
    (booking.totalDue == null || Number(booking.totalDue) <= 0.01) &&
    (booking.totalCurrency == null || booking.totalCurrency === "USD");
}

function getConfirmationHmacSecret(): string {
  const secret = requireDedicatedParrSecret();
  return crypto.createHash("sha256").update(`parr-confirm-sig:${secret}`, "utf8").digest("hex");
}

export function signConfirmationToken(orderNumber: string, resellerReference: string): string {
  return crypto
    .createHmac("sha256", getConfirmationHmacSecret())
    .update(`${orderNumber}:${resellerReference}`, "utf8")
    .digest("base64url");
}

export function verifyConfirmationToken(orderNumber: string, resellerReference: string, sig: string): boolean {
  if (!orderNumber || !resellerReference || !sig) return false;
  const expected = signConfirmationToken(orderNumber, resellerReference);
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(sig, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

async function callRezdyJson(
  pathWithQuery: string,
  options: {
    method?: "GET" | "POST" | "PUT";
    body?: Record<string, unknown>;
    signal?: AbortSignal;
    fetchImpl?: FetchLike;
  } = {}
): Promise<Record<string, unknown>> {
  const apiKey = getRezdyApiKey();
  const normalized = pathWithQuery.startsWith("/") ? pathWithQuery : `/${pathWithQuery}`;
  const url = new URL(`${REZDY_V1_BASE}${normalized}`);
  url.searchParams.set("apiKey", apiKey);

  const f = options.fetchImpl ?? fetch;
  const res = await f(url.toString(), {
    method: options.method ?? "GET",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
    signal: options.signal,
    cache: "no-store",
  });

  const text = await res.text();
  const scrubbedText = apiKey ? text.split(apiKey).join("[REDACTED]") : text;
  if (!res.ok) {
    throw new Error(`Rezdy HTTP ${res.status}: ${scrubbedText.slice(0, 300)}`);
  }
  return JSON.parse(scrubbedText) as Record<string, unknown>;
}

// Shared ephemeral store ONLY when legacy unit tests pass `fetchImpl` without `inventoryDeps`
const ephemeralLegacyTestStore = new InMemoryCasInventoryStore();

function resolveInventoryDeps(deps?: {
  fetchImpl?: FetchLike;
  inventoryDeps?: InventoryRuntimeDeps;
}): InventoryRuntimeDeps {
  if (deps?.inventoryDeps) {
    return {
      ...deps.inventoryDeps,
      fetchImpl: deps.inventoryDeps.fetchImpl ?? deps.fetchImpl,
    };
  }
  if (deps?.fetchImpl) {
    return {
      store: ephemeralLegacyTestStore,
      fetchImpl: deps.fetchImpl,
      skipOpeningRezdyFetch: true,
      finalizeOrderMirrorImpl: async (input) => ({
        internalOrderId: `ord_test_${input.orderNumber}`,
        bookingToken: `tok_test_${input.orderNumber}`,
        created: true,
      }),
    };
  }
  return {};
}

export async function getParrRezdyAvailabilityForDate(
  input: {
    vehicleSlug: ParrNativeVehicleSlug;
    dateKey: string;
    showId?: string | null;
    qaSoldOut?: boolean;
  },
  deps?: { fetchImpl?: FetchLike; inventoryDeps?: InventoryRuntimeDeps }
) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.dateKey)) {
    throw new Error("Invalid ISO dateKey (expected YYYY-MM-DD).");
  }
  const cfg = PARR_PREVIEW_HIDDEN_PRODUCTS[input.vehicleSlug];
  if (!cfg) throw new Error(`Unsupported vehicle option: ${String(input.vehicleSlug)}`);
  assertAllowedTestProductCode(cfg.productCode);

  const invDeps = resolveInventoryDeps(deps);
  const parrInv = await getPublicVehicleAvailability(
    {
      dateKey: input.dateKey,
      vehicleSlug: input.vehicleSlug,
      showId: input.showId,
    },
    invDeps
  );

  const forcedQaSoldOut = Boolean(input.qaSoldOut && isPreviewOrDevEnvironment());

  if (!parrInv.available || forcedQaSoldOut) {
    return {
      ok: true as const,
      available: false,
      soldOut: true,
      statusMessage: SOLD_OUT_TRAVELER_MESSAGE,
      vehicleSlug: cfg.slug,
      productCode: cfg.productCode,
      dateKey: input.dateKey,
      canonicalShowId: parrInv.canonicalShowId,
      capacity: cfg.dailyVehicleCapacity,
      availableCount: 0,
      basePriceUsd: cfg.basePriceUsd,
      expectedBookingFeeUsd: cfg.expectedBookingFeeUsd,
      expectedTotalChargedUsd: cfg.expectedTotalChargedUsd,
      maxPartySize: cfg.maxPartySize,
      vehicleQuantityAllowed: 1 as const,
      session: null,
    };
  }

  const startRange = `${input.dateKey} 00:00:00`;
  const endRange = `${input.dateKey} 23:59:59`;
  const data = await callRezdyJson(
    `/availability?productCode=${encodeURIComponent(cfg.productCode)}&startTimeLocal=${encodeURIComponent(startRange)}&endTimeLocal=${encodeURIComponent(endRange)}&limit=10`,
    { fetchImpl: deps?.fetchImpl }
  );

  const rawSessions = Array.isArray(data.sessions)
    ? (data.sessions as Array<Record<string, unknown>>)
    : [];

  const openSession = rawSessions.find(
    (s) => typeof s.seatsAvailable === "number" && s.seatsAvailable >= 1
  );

  if (!openSession) {
    return {
      ok: true as const,
      available: false,
      soldOut: true,
      statusMessage: SOLD_OUT_TRAVELER_MESSAGE,
      vehicleSlug: cfg.slug,
      productCode: cfg.productCode,
      dateKey: input.dateKey,
      canonicalShowId: parrInv.canonicalShowId,
      capacity: cfg.dailyVehicleCapacity,
      availableCount: 0,
      basePriceUsd: cfg.basePriceUsd,
      expectedBookingFeeUsd: cfg.expectedBookingFeeUsd,
      expectedTotalChargedUsd: cfg.expectedTotalChargedUsd,
      maxPartySize: cfg.maxPartySize,
      vehicleQuantityAllowed: 1 as const,
      session: null,
    };
  }

  const priceOpts = Array.isArray(openSession.priceOptions)
    ? (openSession.priceOptions as Array<Record<string, unknown>>)
    : [];
  const primaryOpt = priceOpts[0] ?? {};
  const actualOptPrice = Number(primaryOpt.price ?? NaN);
  if (!Number.isFinite(actualOptPrice) || Math.abs(actualOptPrice - cfg.basePriceUsd) > 0.005) {
    return {
      ok: true as const,
      available: false,
      soldOut: true,
      statusMessage: SOLD_OUT_TRAVELER_MESSAGE,
      vehicleSlug: cfg.slug,
      productCode: cfg.productCode,
      dateKey: input.dateKey,
      canonicalShowId: parrInv.canonicalShowId,
      capacity: cfg.dailyVehicleCapacity,
      availableCount: 0,
      basePriceUsd: cfg.basePriceUsd,
      expectedBookingFeeUsd: cfg.expectedBookingFeeUsd,
      expectedTotalChargedUsd: cfg.expectedTotalChargedUsd,
      maxPartySize: cfg.maxPartySize,
      vehicleQuantityAllowed: 1 as const,
      session: null,
    };
  }

  return {
    ok: true as const,
    available: true,
    soldOut: false,
    statusMessage: null,
    vehicleSlug: cfg.slug,
    productCode: cfg.productCode,
    dateKey: input.dateKey,
    canonicalShowId: parrInv.canonicalShowId,
    capacity: cfg.dailyVehicleCapacity,
    availableCount: parrInv.availableCount,
    basePriceUsd: cfg.basePriceUsd,
    expectedBookingFeeUsd: cfg.expectedBookingFeeUsd,
    expectedTotalChargedUsd: cfg.expectedTotalChargedUsd,
    maxPartySize: cfg.maxPartySize,
    vehicleQuantityAllowed: 1 as const,
    session: {
      sessionId: String(openSession.id),
      startTimeLocal: String(openSession.startTimeLocal),
      endTimeLocal: openSession.endTimeLocal ? String(openSession.endTimeLocal) : null,
      seatsAvailable: Math.min(Number(openSession.seatsAvailable), parrInv.availableCount),
      optionLabel: String(primaryOpt.label || cfg.displayName),
      optionPrice: actualOptPrice,
      maxQuantity: 1,
    },
  };
}

export async function getParrRezdyStatelessQuote(
  input: {
    vehicleSlug: ParrNativeVehicleSlug;
    startTimeLocal: string;
    optionLabel: string;
    vehicleQuantity?: number;
  },
  deps?: { fetchImpl?: FetchLike }
) {
  if ((input.vehicleQuantity ?? 1) !== 1) {
    return {
      ok: false as const,
      code: "SINGLE_VEHICLE_ONLY" as const,
      message:
        "Normal checkout supports exactly 1 private vehicle (up to 6 guests in a Suburban or up to 10 in a Van). For 2+ vehicles, use /red-rocks/group-transportation.",
      groupTransportationHref: "/red-rocks/group-transportation",
    };
  }

  const cfg = PARR_PREVIEW_HIDDEN_PRODUCTS[input.vehicleSlug];
  if (!cfg) throw new Error(`Unsupported vehicle option: ${String(input.vehicleSlug)}`);
  assertAllowedTestProductCode(cfg.productCode);

  const data = await callRezdyJson("/bookings/quote", {
    method: "POST",
    fetchImpl: deps?.fetchImpl,
    body: {
      customer: {
        firstName: "Quote",
        lastName: "Preview",
        email: "noreply@partyatredrocks.com",
      },
      items: [
        {
          productCode: cfg.productCode,
          startTimeLocal: input.startTimeLocal.replace("T", " "),
          quantities: [{ optionLabel: input.optionLabel, value: 1 }],
        },
      ],
    },
  });

  const booking = (data.booking ?? data) as Record<string, unknown>;
  const items = Array.isArray(booking.items)
    ? (booking.items as Array<Record<string, unknown>>)
    : [];
  const firstItem = items[0] ?? {};

  const itemAmount = Number(firstItem.amount ?? cfg.basePriceUsd);
  const bookingFeeUsd = Number(firstItem.totalItemTax ?? 0);
  const totalAmount = Number(booking.totalAmount ?? firstItem.subtotal ?? itemAmount + bookingFeeUsd);
  const totalDue = Number(booking.totalDue ?? totalAmount);

  const quoteParityPassed =
    Math.abs(itemAmount - cfg.basePriceUsd) < 0.005 &&
    Math.abs(bookingFeeUsd - cfg.expectedBookingFeeUsd) < 0.005 &&
    Math.abs(totalAmount - cfg.expectedTotalChargedUsd) < 0.005 &&
    Math.abs(totalDue - cfg.expectedTotalChargedUsd) < 0.005;

  const baseRounded = Number(itemAmount.toFixed(2));
  const feeRounded = Number(bookingFeeUsd.toFixed(2));
  const totalAmountRounded = Number(totalAmount.toFixed(2));
  const totalDueRounded = Number(totalDue.toFixed(2));

  return {
    ok: true as const,
    vehicleSlug: cfg.slug,
    productCode: cfg.productCode,
    shortVehicleLabel: cfg.shortVehicleLabel,
    basePriceCents: cfg.basePriceCents,
    calculatedBookingFeeCents: cfg.calculatedBookingFeeCents,
    allInTotalCents: cfg.allInTotalCents,
    basePriceUsd: cfg.basePriceUsd,
    bookingFeeRatePct: cfg.bookingFeeRatePct,
    bookingFeeLabel: cfg.bookingFeeLabel,
    expectedBookingFeeUsd: cfg.expectedBookingFeeUsd,
    expectedAllInUsd: cfg.expectedTotalChargedUsd,
    itemAmount: baseRounded,
    bookingFeeUsd: feeRounded,
    totalAmount: totalAmountRounded,
    totalDue: totalDueRounded,
    currency: String(booking.totalCurrency ?? "USD"),
    vehicleQuantity: 1 as const,
    displayBreakdown: {
      vehicleLine: `${cfg.shortVehicleLabel}: $${baseRounded.toFixed(2)}`,
      bookingFeeLine: `${cfg.bookingFeeLabel}: $${feeRounded.toFixed(2)}`,
      totalChargedTodayLine: `Total charged today: $${totalDueRounded.toFixed(2)}`,
    },
    quoteParityPassed,
    blockedReason: quoteParityPassed ? null : ("QUOTE_TOTAL_MISMATCH" as const),
    blockedMessage: quoteParityPassed
      ? null
      : `Rezdy stateless quote returned $${totalDueRounded.toFixed(2)} ($${baseRounded.toFixed(2)} vehicle + $${feeRounded.toFixed(2)} booking fee) instead of expected $${cfg.expectedTotalChargedUsd.toFixed(2)} ($${cfg.basePriceUsd.toFixed(2)} + $${cfg.expectedBookingFeeUsd.toFixed(2)} Booking fee (4%)). Checkout is paused until totals reconcile.`,
  };
}

export type CreateParrNativeBookingInput = {
  vehicleSlug: ParrNativeVehicleSlug;
  sessionId: string;
  startTimeLocal: string;
  optionLabel: string;
  vehicleQuantity?: number;
  partySize: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pickupAddress: string;
  concertAndTripNotes?: string;
  showId?: string;
  cardToken: string;
  idempotencyKey: string;
};

export function validateParrBookingInput(input: CreateParrNativeBookingInput): {
  valid: boolean;
  code?: string;
  message?: string;
} {
  const cfg = PARR_PREVIEW_HIDDEN_PRODUCTS[input.vehicleSlug];
  if (!cfg) return { valid: false, code: "INVALID_VEHICLE", message: "Please select Suburban or 10-Passenger Van." };
  if ((input.vehicleQuantity ?? 1) !== 1) {
    return {
      valid: false,
      code: "SINGLE_VEHICLE_ONLY",
      message: "Normal checkout reserves 1 private vehicle. Need multiple vehicles? Request Group Transportation.",
    };
  }
  if (!Number.isInteger(input.partySize) || input.partySize < 1 || input.partySize > cfg.maxPartySize) {
    return {
      valid: false,
      code: "INVALID_PARTY_SIZE",
      message: `Party size must be between 1 and ${cfg.maxPartySize} guests for ${cfg.displayName}.`,
    };
  }
  if (!input.firstName?.trim() || !input.lastName?.trim()) {
    return { valid: false, code: "MISSING_NAME", message: "First and last name are required." };
  }
  if (!input.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    return { valid: false, code: "INVALID_EMAIL", message: "A valid email address is required." };
  }
  if (!input.phone?.trim() || input.phone.replace(/\D/g, "").length < 7) {
    return { valid: false, code: "INVALID_PHONE", message: "A valid mobile phone number is required for driver dispatch." };
  }
  if (!input.pickupAddress?.trim() || input.pickupAddress.trim().length < 5) {
    return { valid: false, code: "MISSING_PICKUP", message: "Exact Denver-area hotel, Airbnb, or home pickup address is required." };
  }
  if (!input.cardToken?.trim() || !/^tok_[A-Za-z0-9_]+$/.test(input.cardToken.trim())) {
    return { valid: false, code: "MISSING_CARD_TOKEN", message: "Payment card token is missing or invalid." };
  }
  if (!input.idempotencyKey?.trim() || input.idempotencyKey.trim().length < 8) {
    return { valid: false, code: "MISSING_IDEMPOTENCY_KEY", message: "Missing booking idempotency reference." };
  }
  return { valid: true };
}

async function recoverExistingBookingByResellerReference(
  resellerReference: string,
  expected: {
    productCode: string;
    startTimeLocal: string;
    expectedPriceUsd: number;
  },
  fetchImpl?: FetchLike
): Promise<Record<string, unknown> | null> {
  const data = await callRezdyJson(
    `/bookings?resellerReference=${encodeURIComponent(resellerReference)}&limit=20`,
    { fetchImpl }
  );
  const list = Array.isArray(data.bookings)
    ? (data.bookings as Array<Record<string, unknown>>)
    : data.booking && typeof data.booking === "object"
      ? [data.booking as Record<string, unknown>]
      : [];

  if (list.length === 0) return null;
  if (list.length > 1) {
    throw new Error(`Ambiguous recovery: multiple bookings matched resellerReference ${resellerReference}.`);
  }

  const found = list[0];
  const items = Array.isArray(found.items) ? (found.items as Array<Record<string, unknown>>) : [];
  const item = items[0] ?? {};
  const actualCode = String(item.productCode ?? found.productCode ?? "");
  const actualStart = String(item.startTimeLocal ?? "").replace("T", " ");
  const expectedStart = expected.startTimeLocal.replace("T", " ");
  const actualQty = Number(
    Array.isArray(item.quantities) && item.quantities[0]
      ? (item.quantities[0] as Record<string, unknown>).value
      : 1
  );

  if (!found.orderNumber) throw new Error("Recovered Rezdy booking is missing orderNumber.");
  if (actualCode !== expected.productCode) throw new Error("Recovered booking productCode mismatch.");
  if (actualStart && actualStart !== expectedStart) throw new Error("Recovered booking startTimeLocal mismatch.");
  if (actualQty !== 1) throw new Error("Recovered booking quantity mismatch.");
  if (found.status !== "CONFIRMED") {
    throw new Error(`Recovered RezdyPay booking is not CONFIRMED (status=${String(found.status)}).`);
  }
  if (!isFullyPaidRezdyConfirmation(found, expected.expectedPriceUsd)) {
    throw new Error("Recovered booking payment is not fully reconciled; operator review required.");
  }
  if (found.totalAmount !== undefined) {
    const actualTotal = Number(found.totalAmount);
    if (Number.isFinite(actualTotal) && Math.abs(actualTotal - expected.expectedPriceUsd) > 0.02) {
      throw new Error(`Recovered booking totalAmount (${actualTotal}) mismatched expected (${expected.expectedPriceUsd}).`);
    }
  }

  return found;
}

export async function createParrRezdyBooking(
  input: CreateParrNativeBookingInput,
  deps?: { fetchImpl?: FetchLike; inventoryDeps?: InventoryRuntimeDeps }
) {
  try {
    requireDedicatedParrSecret();
  } catch (err) {
    if (err instanceof MissingParrSecretError) {
      return {
        ok: false as const,
        httpStatus: 503,
        code: err.code,
        message: "Booking configuration is temporarily unavailable. Please use the classic booking widget.",
      };
    }
    throw err;
  }

  const validation = validateParrBookingInput(input);
  if (!validation.valid) {
    return {
      ok: false as const,
      httpStatus: 400,
      code: validation.code ?? "VALIDATION_ERROR",
      message: validation.message ?? "Invalid booking details.",
    };
  }

  const cfg = PARR_PREVIEW_HIDDEN_PRODUCTS[input.vehicleSlug];
  assertAllowedTestProductCode(cfg.productCode);
  const normalizedStart = input.startTimeLocal.replace("T", " ");
  const dateKey = normalizedStart.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    return {
      ok: false as const,
      httpStatus: 400,
      code: "INVALID_DATE",
      message: "Invalid concert service date.",
    };
  }

  const resellerReference = buildParrResellerReference(input.idempotencyKey);
  const invDeps = resolveInventoryDeps(deps);

  if (inFlightSubmissions.has(resellerReference)) {
    return {
      ok: false as const,
      httpStatus: 409,
      code: "DUPLICATE_SUBMIT_IN_PROGRESS",
      message: "Your reservation is already being processed. Please do not submit again.",
    };
  }

  inFlightSubmissions.add(resellerReference);
  try {
    const customerRecord = {
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
    };
    const pickupRecord = {
      address: input.pickupAddress.trim(),
      notes: input.concertAndTripNotes?.trim() || null,
    };

    // 1. Pre-create idempotency recovery check against Rezdy (prevents double-charging on retry!)
    const preexisting = await recoverExistingBookingByResellerReference(
      resellerReference,
      {
        productCode: cfg.productCode,
        startTimeLocal: normalizedStart,
        expectedPriceUsd: cfg.expectedTotalChargedUsd,
      },
      deps?.fetchImpl
    );
    if (preexisting) {
      const orderNum = String(preexisting.orderNumber);
      // Ensure local hold & order mirror are reconciled idempotently without consuming a 2nd unit
      const holdCheck = await acquireOrReuseCheckoutHold(
        {
          dateKey,
          vehicleSlug: input.vehicleSlug,
          idempotencyKey: input.idempotencyKey,
          partySize: input.partySize,
          showId: input.showId,
        },
        invDeps
      );
      if (holdCheck.ok && holdCheck.hold.state !== "confirmed_sold") {
        await finalizeConfirmedRezdyHold(
          {
            dateKey,
            vehicleSlug: input.vehicleSlug,
            internalHoldId: holdCheck.hold.internalHoldId,
            rezdyOrderNumber: orderNum,
            resellerReference,
            startTimeLocal: normalizedStart,
            partySize: input.partySize,
            customer: customerRecord,
            pickup: pickupRecord,
            rezdyBookingPayload: preexisting,
          },
          invDeps
        );
      }
      return {
        ok: true as const,
        httpStatus: 200,
        idempotentRecovery: true,
        orderNumber: orderNum,
        resellerReference,
        status: String(preexisting.status),
        totalPaid: Number(preexisting.totalPaid ?? cfg.expectedTotalChargedUsd),
        confirmationSig: signConfirmationToken(orderNum, resellerReference),
      };
    }

    // 2. Atomic Vehicle Inventory Hold Gate (Sections E, G, H):
    // Enforces 6 Suburbans / 3 Vans max, blocks sold-out & reconciliation-blocked pools,
    // prevents stale browsers from bypassing sold-out UI, and reuses same-idempotencyKey holds!
    const holdRes = await acquireOrReuseCheckoutHold(
      {
        dateKey,
        vehicleSlug: input.vehicleSlug,
        idempotencyKey: input.idempotencyKey,
        partySize: input.partySize,
        showId: input.showId,
      },
      invDeps
    );
    if (!holdRes.ok) {
      return {
        ok: false as const,
        httpStatus: 409,
        code: holdRes.code,
        message: SOLD_OUT_TRAVELER_MESSAGE,
      };
    }

    const internalHoldId = holdRes.hold.internalHoldId;

    // 3. Hard Stateless Quote Parity Gate ($518.96 Suburban / $726.96 Van) before charging!
    const quote = await getParrRezdyStatelessQuote(
      {
        vehicleSlug: input.vehicleSlug,
        startTimeLocal: normalizedStart,
        optionLabel: input.optionLabel,
        vehicleQuantity: 1,
      },
      deps
    );
    if (!quote.ok || !quote.quoteParityPassed) {
      await releaseHoldAfterFailedAttempt(
        {
          dateKey,
          vehicleSlug: input.vehicleSlug,
          internalHoldId,
          reason: quote.ok
            ? quote.blockedReason ?? "QUOTE_TOTAL_MISMATCH"
            : quote.code,
        },
        invDeps
      );
      return {
        ok: false as const,
        httpStatus: 422,
        code: quote.ok ? (quote.blockedReason ?? "QUOTE_MISMATCH") : quote.code,
        message: quote.ok
          ? (quote.blockedMessage ?? "Quote total did not reconcile with expected all-in booking total.")
          : quote.message,
      };
    }

    // 4. Promote hold to `payment_booking_pending` with durable outbox record BEFORE calling Rezdy!
    const pendingPromotion = await promoteHoldToPendingWithOutbox(
      {
        dateKey,
        vehicleSlug: input.vehicleSlug,
        internalHoldId,
        resellerReference,
        metadata: {
          vehicleSlug: input.vehicleSlug,
          productCode: cfg.productCode,
          startTimeLocal: normalizedStart,
          partySize: input.partySize,
          customerEmail: customerRecord.email,
        },
      },
      invDeps
    );

    if (pendingPromotion.alreadyConfirmedOrderNumber) {
      const ord = pendingPromotion.alreadyConfirmedOrderNumber;
      return {
        ok: true as const,
        httpStatus: 200,
        idempotentRecovery: true,
        orderNumber: ord,
        resellerReference,
        status: "CONFIRMED",
        totalPaid: cfg.expectedTotalChargedUsd,
        confirmationSig: signConfirmationToken(ord, resellerReference),
      };
    }

    // Rezdy sends the customer's confirmation for real Production bookings only.
    const partyFieldLabel = `Party Size (1-${cfg.maxPartySize} Guests)`;
    const bookingPayload = {
      resellerReference,
      sendNotifications: process.env.VERCEL_ENV === "production",
      customer: customerRecord,
      items: [
        {
          productCode: cfg.productCode,
          sessionId: Number.parseInt(input.sessionId, 10),
          startTimeLocal: normalizedStart,
          amount: cfg.basePriceUsd,
          quantities: [{ optionLabel: input.optionLabel, value: 1 }],
        },
      ],
      fields: [
        { label: "First Name", value: customerRecord.firstName },
        { label: "Last Name", value: customerRecord.lastName },
        { label: "Email", value: customerRecord.email },
        { label: "Mobile", value: customerRecord.phone },
        { label: "Pickup Address", value: pickupRecord.address },
        { label: partyFieldLabel, value: String(input.partySize) },
        ...(input.concertAndTripNotes?.trim()
          ? [{ label: "Concert / Artist & Trip Notes", value: input.concertAndTripNotes.trim() }]
          : []),
      ],
      comments: `PARR Private ${cfg.displayName} | Party Size: ${input.partySize} | Pickup: ${pickupRecord.address}${input.concertAndTripNotes?.trim() ? ` | Notes: ${input.concertAndTripNotes.trim()}` : ""}`,
      creditCard: {
        cardToken: input.cardToken.trim(),
      },
    };

    try {
      const createdRes = await callRezdyJson("/bookings", {
        method: "POST",
        body: bookingPayload,
        fetchImpl: deps?.fetchImpl,
      });
      const booking = (createdRes.booking ?? createdRes) as Record<string, unknown>;
      if (booking.orderNumber && !isFullyPaidRezdyConfirmation(booking, cfg.expectedTotalChargedUsd)) {
        await blockAmbiguousInFlightHold({
          dateKey, vehicleSlug: input.vehicleSlug, internalHoldId, resellerReference,
          errorDetail: "Rezdy returned an order without a fully reconciled payment.",
        }, invDeps);
        return {
          ok: false as const, httpStatus: 503, code: "BOOKING_PENDING_RECONCILIATION",
          message: "Your reservation is being verified. Please do not pay again; contact us with your reservation details.",
        };
      }
      if (!booking.orderNumber || booking.status !== "CONFIRMED") {
        await releaseHoldAfterFailedAttempt(
          {
            dateKey,
            vehicleSlug: input.vehicleSlug,
            internalHoldId,
            reason: `Rezdy returned non-confirmed status: ${String(booking.status ?? "NONE")}`,
          },
          invDeps
        );
        return {
          ok: false as const,
          httpStatus: 502,
          code: "BOOKING_NOT_CONFIRMED",
          message:
            "Your payment could not be confirmed by RezdyPay. No reservation was finalized—please check your card or use the classic booking widget.",
        };
      }

      const orderNum = String(booking.orderNumber);
      const finalized = await finalizeConfirmedRezdyHold(
        {
          dateKey,
          vehicleSlug: input.vehicleSlug,
          internalHoldId,
          rezdyOrderNumber: orderNum,
          resellerReference,
          startTimeLocal: normalizedStart,
          partySize: input.partySize,
          customer: customerRecord,
          pickup: pickupRecord,
          rezdyBookingPayload: booking,
        },
        invDeps
      );

      if (!finalized.finalizedLocally) {
        // Requirement G.7: Rezdy succeeded, PARR local mirror failed!
        // Never report a failed purchase and resell the same vehicle.
        return {
          ok: true as const,
          httpStatus: 202,
          idempotentRecovery: false,
          pendingLocalReconciliation: true,
          orderNumber: orderNum,
          resellerReference,
          internalHoldId,
          status: "CONFIRMED",
          totalPaid: Number(booking.totalPaid ?? cfg.expectedTotalChargedUsd),
          confirmationSig: signConfirmationToken(orderNum, resellerReference),
        };
      }

      return {
        ok: true as const,
        httpStatus: 200,
        idempotentRecovery: false,
        pendingLocalReconciliation: false,
        orderNumber: orderNum,
        internalOrderId: finalized.internalOrderId,
        bookingToken: finalized.bookingToken,
        internalHoldId,
        resellerReference,
        status: String(booking.status),
        totalPaid: Number(booking.totalPaid ?? cfg.expectedTotalChargedUsd),
        confirmationSig: signConfirmationToken(orderNum, resellerReference),
      };
    } catch (upstreamErr) {
      // 6. Timeout / network-drop recovery: check if Rezdy accepted the booking before releasing the hold!
      let recovered: Record<string, unknown> | null = null;
      let recoveryLookupFailed = false;
      try {
        recovered = await recoverExistingBookingByResellerReference(
          resellerReference,
          {
            productCode: cfg.productCode,
            startTimeLocal: normalizedStart,
            expectedPriceUsd: cfg.expectedTotalChargedUsd,
          },
          deps?.fetchImpl
        );
      } catch {
        recoveryLookupFailed = true;
      }

      if (recovered) {
        const orderNum = String(recovered.orderNumber);
        const finalized = await finalizeConfirmedRezdyHold(
          {
            dateKey,
            vehicleSlug: input.vehicleSlug,
            internalHoldId,
            rezdyOrderNumber: orderNum,
            resellerReference,
            startTimeLocal: normalizedStart,
            partySize: input.partySize,
            customer: customerRecord,
            pickup: pickupRecord,
            rezdyBookingPayload: recovered,
          },
          invDeps
        );

        return {
          ok: true as const,
          httpStatus: finalized.finalizedLocally ? 200 : 202,
          idempotentRecovery: true,
          pendingLocalReconciliation: !finalized.finalizedLocally,
          orderNumber: orderNum,
          resellerReference,
          internalHoldId,
          status: String(recovered.status),
          totalPaid: Number(recovered.totalPaid ?? cfg.expectedTotalChargedUsd),
          confirmationSig: signConfirmationToken(orderNum, resellerReference),
        };
      }

      const rawErrMsg = upstreamErr instanceof Error ? upstreamErr.message : String(upstreamErr);
      const errMsg = rawErrMsg.toLowerCase();
      const isDefinitiveCardDecline =
        errMsg.includes("declin") || errMsg.includes("insufficient") || errMsg.includes("expired card") || errMsg.includes("invalid card");

      if (recoveryLookupFailed && !isDefinitiveCardDecline) {
        // Upstream state is genuinely unknown; block the unit pending reconciliation so it cannot be resold!
        await blockAmbiguousInFlightHold(
          {
            dateKey,
            vehicleSlug: input.vehicleSlug,
            internalHoldId,
            resellerReference,
            errorDetail: rawErrMsg,
          },
          invDeps
        );
        return {
          ok: false as const,
          httpStatus: 503,
          code: "BOOKING_PENDING_RECONCILIATION",
          message:
            "Your payment submission experienced a network interruption while confirming with Rezdy. We have held your vehicle so it cannot be resold while our dispatch team verifies your confirmation.",
        };
      }

      // Confirmed zero booking exists in Rezdy -> safely release the hold!
      await releaseHoldAfterFailedAttempt(
        {
          dateKey,
          vehicleSlug: input.vehicleSlug,
          internalHoldId,
          reason: rawErrMsg,
        },
        invDeps
      );

      if (isDefinitiveCardDecline) {
        return {
          ok: false as const,
          httpStatus: 402,
          code: "CARD_DECLINED",
          message:
            "Your card could not be approved. No reservation was created and you have not been charged. Please check your card details or use another card.",
        };
      }

      return {
        ok: false as const,
        httpStatus: 502,
        code: "UPSTREAM_BOOKING_ERROR",
        message:
          "We could not finalize your reservation right now and verified no confirmed order was recorded. Please try again or switch to the classic Rezdy booking widget.",
      };
    }
  } finally {
    inFlightSubmissions.delete(resellerReference);
  }
}

export async function getParrRezdyBookingConfirmation(
  input: { orderNumber: string; resellerReference: string; sig: string },
  deps?: { fetchImpl?: FetchLike }
) {
  if (!verifyConfirmationToken(input.orderNumber, input.resellerReference, input.sig)) {
    return {
      ok: false as const,
      httpStatus: 401,
      code: "INVALID_CONFIRMATION_SIGNATURE",
      message: "Invalid or expired confirmation lookup link.",
    };
  }

  const data = await callRezdyJson(`/bookings/${encodeURIComponent(input.orderNumber)}`, {
    fetchImpl: deps?.fetchImpl,
  });
  const booking = (data.booking ?? data) as Record<string, unknown>;
  if (!booking?.orderNumber || String(booking.resellerReference ?? "") !== input.resellerReference) {
    return {
      ok: false as const,
      httpStatus: 404,
      code: "CONFIRMATION_NOT_FOUND",
      message: "Reservation record could not be found.",
    };
  }

  const items = Array.isArray(booking.items) ? (booking.items as Array<Record<string, unknown>>) : [];
  const item = items[0] ?? {};
  const fields = Array.isArray(booking.fields) ? (booking.fields as Array<Record<string, unknown>>) : [];
  const findField = (needle: string) =>
    String(
      fields.find((f) => String(f.label ?? "").toLowerCase().includes(needle.toLowerCase()))?.value ?? ""
    ) || null;

  return {
    ok: true as const,
    httpStatus: 200,
    confirmation: {
      orderNumber: String(booking.orderNumber),
      status: String(booking.status ?? "UNKNOWN"),
      productCode: String(item.productCode ?? ""),
      productName: String(item.productName ?? ""),
      startTimeLocal: String(item.startTimeLocal ?? ""),
      vehicleQuantity: 1,
      partySize: findField("Party Size"),
      pickupAddress: findField("Pickup Address"),
      tripNotes: findField("Notes"),
      totalAmount: Number(booking.totalAmount ?? 0),
      totalPaid: Number(booking.totalPaid ?? 0),
      totalDue: Number(booking.totalDue ?? 0),
      currency: String(booking.totalCurrency ?? "USD"),
    },
  };
}
