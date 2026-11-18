import "server-only";
import crypto from "node:crypto";
import { FORBIDDEN_LIVE_PRODUCT_CODES } from "./phase3bHiddenProductsAndTaxAudit";

const REZDY_V1_BASE = "https://api.rezdy.com/v1";

export type ParrNativeVehicleSlug = "suv" | "van";

export type ParrHiddenTestProductConfig = {
  slug: ParrNativeVehicleSlug;
  productCode: string;
  internalCode: string;
  shortVehicleLabel: string;
  displayName: string;
  basePriceUsd: number;
  bookingFeeRatePct: number;
  bookingFeeLabel: string;
  expectedBookingFeeUsd: number;
  expectedTotalChargedUsd: number;
  maxPartySize: number;
};

/**
 * Preview-only hidden test products created in Phase 3B (Option B all-in pricing).
 * Base vehicle prices stay unchanged ($499.00 / $699.00) with the intentional 4% Rezdy Booking fee
 * ($19.96 / $27.96) added and disclosed upfront so Total charged today reconciles at $518.96 / $726.96.
 * Live public products (`P0U1MY` / `596193` and `PJM9GD` / `630812`) remain untouched.
 */
export const PARR_PREVIEW_HIDDEN_PRODUCTS: Record<ParrNativeVehicleSlug, ParrHiddenTestProductConfig> = {
  suv: {
    slug: "suv",
    productCode: "P94HN4",
    internalCode: "PARR_2027_SUBURBAN_API_TEST",
    shortVehicleLabel: "Private Suburban",
    displayName: "Private Suburban (Up to 6 Guests)",
    basePriceUsd: 499,
    bookingFeeRatePct: 4,
    bookingFeeLabel: "Booking fee (4%)",
    expectedBookingFeeUsd: 19.96,
    expectedTotalChargedUsd: 518.96,
    maxPartySize: 6,
  },
  van: {
    slug: "van",
    productCode: "PU8R6Y",
    internalCode: "PARR_2027_VAN_API_TEST",
    shortVehicleLabel: "Private Van",
    displayName: "Private 10-Passenger Van (Up to 10 Guests)",
    basePriceUsd: 699,
    bookingFeeRatePct: 4,
    bookingFeeLabel: "Booking fee (4%)",
    expectedBookingFeeUsd: 27.96,
    expectedTotalChargedUsd: 726.96,
    maxPartySize: 10,
  },
};

export type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

// Server-instance in-flight duplicate-submit lock keyed by deterministic resellerReference
const inFlightSubmissions = new Set<string>();

export function isPreviewOrDevEnvironment(): boolean {
  if (process.env.VERCEL_ENV === "preview") return true;
  if (process.env.NODE_ENV === "development" && process.env.VERCEL !== "1") return true;
  if (process.env.NODE_ENV === "test") return true;
  return false;
}

export function isParrNativeRezdyCheckoutEnabled(opts?: { previewQueryFlag?: string | null }): boolean {
  // Strictly Preview/Dev/Test only during Phase 3 — NEVER active on Production.
  if (!isPreviewOrDevEnvironment()) return false;
  if (process.env.PARR_NATIVE_REZDY_CHECKOUT_ENABLED === "true") return true;
  if (opts?.previewQueryFlag === "native_preview") return true;
  return false;
}

/**
 * Safely reads ONLY the Stripe publishable key (`pk_...`) for browser tokenization.
 * Explicitly rejects secret keys (`sk_...` / `rk_...`) so no Stripe secret key can ever be exposed.
 */
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
  if (FORBIDDEN_LIVE_PRODUCT_CODES.has(upper)) {
    throw new Error(`SAFETY_VIOLATION: Live product ${upper} is blocked during Preview native checkout testing.`);
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

function getConfirmationHmacSecret(): string {
  const secret = (process.env.PARR_SECRET || process.env.REZDY_API_KEY || "parr-dev-test-hmac-key").trim();
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
  // Scrub API key from any upstream error message
  const scrubbedText = apiKey ? text.split(apiKey).join("[REDACTED]") : text;
  if (!res.ok) {
    throw new Error(`Rezdy HTTP ${res.status}: ${scrubbedText.slice(0, 300)}`);
  }
  return JSON.parse(scrubbedText) as Record<string, unknown>;
}

export async function getParrRezdyAvailabilityForDate(
  input: { vehicleSlug: ParrNativeVehicleSlug; dateKey: string },
  deps?: { fetchImpl?: FetchLike }
) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.dateKey)) {
    throw new Error("Invalid ISO dateKey (expected YYYY-MM-DD).");
  }
  const cfg = PARR_PREVIEW_HIDDEN_PRODUCTS[input.vehicleSlug];
  if (!cfg) throw new Error(`Unsupported vehicle option: ${String(input.vehicleSlug)}`);
  assertAllowedTestProductCode(cfg.productCode);

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
      vehicleSlug: cfg.slug,
      productCode: cfg.productCode,
      dateKey: input.dateKey,
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

  return {
    ok: true as const,
    available: true,
    vehicleSlug: cfg.slug,
    productCode: cfg.productCode,
    dateKey: input.dateKey,
    basePriceUsd: cfg.basePriceUsd,
    expectedBookingFeeUsd: cfg.expectedBookingFeeUsd,
    expectedTotalChargedUsd: cfg.expectedTotalChargedUsd,
    maxPartySize: cfg.maxPartySize,
    vehicleQuantityAllowed: 1 as const,
    session: {
      sessionId: String(openSession.id),
      startTimeLocal: String(openSession.startTimeLocal),
      endTimeLocal: openSession.endTimeLocal ? String(openSession.endTimeLocal) : null,
      seatsAvailable: Number(openSession.seatsAvailable),
      optionLabel: String(primaryOpt.label || cfg.displayName),
      optionPrice: Number(primaryOpt.price ?? cfg.basePriceUsd),
      maxQuantity: Number(primaryOpt.maxQuantity ?? 1),
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

  // Note: Rezdy REST API v1 returns the account-wide 4% "Booking fee" inside `items[0].totalItemTax`
  // even when Settings -> Taxes & Fees has 0 taxes. Never label this charge as tax.
  const itemAmount = Number(firstItem.amount ?? cfg.basePriceUsd);
  const bookingFeeUsd = Number(firstItem.totalItemTax ?? 0);
  const totalAmount = Number(booking.totalAmount ?? firstItem.subtotal ?? itemAmount + bookingFeeUsd);
  const totalDue = Number(booking.totalDue ?? totalAmount);

  // Option B Hard Parity Gate: Traveler-visible breakdown and charged total must reconcile to the exact cent:
  // - P94HN4: $499.00 base + $19.96 Booking fee (4%) = $518.96 total charged today
  // - PU8R6Y: $699.00 base + $27.96 Booking fee (4%) = $726.96 total charged today
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
    blockedReason: quoteParityPassed
      ? null
      : ("QUOTE_TOTAL_MISMATCH" as const),
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

  return found;
}

export async function createParrRezdyBooking(
  input: CreateParrNativeBookingInput,
  deps?: { fetchImpl?: FetchLike }
) {
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
  const resellerReference = buildParrResellerReference(input.idempotencyKey);

  // Concurrent duplicate-submit lock
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
    // 1. Pre-create idempotency recovery check (prevents re-charging on retry!)
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

    // 2. Hard Stateless Quote Parity Gate ($518.96 Suburban / $726.96 Van) before attempting any card charge!
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
      return {
        ok: false as const,
        httpStatus: 422,
        code: quote.ok ? (quote.blockedReason ?? "QUOTE_MISMATCH") : quote.code,
        message: quote.ok
          ? (quote.blockedMessage ?? "Quote total did not reconcile with expected all-in booking total.")
          : quote.message,
      };
    }

    // 3. Submit server-side RezdyPay booking (sendNotifications: false during Preview testing)
    const partyFieldLabel = `Party Size (1-${cfg.maxPartySize} Guests)`;
    const bookingPayload = {
      resellerReference,
      sendNotifications: false,
      customer: {
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        email: input.email.trim(),
        phone: input.phone.trim(),
      },
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
        { label: "First Name", value: input.firstName.trim() },
        { label: "Last Name", value: input.lastName.trim() },
        { label: "Email", value: input.email.trim() },
        { label: "Mobile", value: input.phone.trim() },
        { label: "Pickup Address", value: input.pickupAddress.trim() },
        { label: partyFieldLabel, value: String(input.partySize) },
        ...(input.concertAndTripNotes?.trim()
          ? [{ label: "Concert / Artist & Trip Notes", value: input.concertAndTripNotes.trim() }]
          : []),
      ],
      comments: `PARR Private ${cfg.displayName} | Party Size: ${input.partySize} | Pickup: ${input.pickupAddress.trim()}${input.concertAndTripNotes?.trim() ? ` | Notes: ${input.concertAndTripNotes.trim()}` : ""}`,
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
      if (!booking.orderNumber || booking.status !== "CONFIRMED") {
        return {
          ok: false as const,
          httpStatus: 502,
          code: "BOOKING_NOT_CONFIRMED",
          message:
            "Your payment could not be confirmed by RezdyPay. No reservation was finalized—please check your card or use the classic booking widget.",
        };
      }
      const orderNum = String(booking.orderNumber);
      return {
        ok: true as const,
        httpStatus: 200,
        idempotentRecovery: false,
        orderNumber: orderNum,
        resellerReference,
        status: String(booking.status),
        totalPaid: Number(booking.totalPaid ?? cfg.expectedTotalChargedUsd),
        confirmationSig: signConfirmationToken(orderNum, resellerReference),
      };
    } catch (upstreamErr) {
      // 4. Timeout / network-drop recovery: check if Rezdy accepted the booking before surfacing failure!
      const recovered = await recoverExistingBookingByResellerReference(
        resellerReference,
        {
          productCode: cfg.productCode,
          startTimeLocal: normalizedStart,
          expectedPriceUsd: cfg.expectedTotalChargedUsd,
        },
        deps?.fetchImpl
      ).catch(() => null);

      if (recovered) {
        const orderNum = String(recovered.orderNumber);
        return {
          ok: true as const,
          httpStatus: 200,
          idempotentRecovery: true,
          orderNumber: orderNum,
          resellerReference,
          status: String(recovered.status),
          totalPaid: Number(recovered.totalPaid ?? cfg.expectedTotalChargedUsd),
          confirmationSig: signConfirmationToken(orderNum, resellerReference),
        };
      }

      const errMsg = upstreamErr instanceof Error ? upstreamErr.message.toLowerCase() : "";
      if (errMsg.includes("declin") || errMsg.includes("insufficient") || errMsg.includes("card")) {
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
