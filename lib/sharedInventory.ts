import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { blobReadJson, blobWriteJson } from "@/lib/blobJson";
import type { BookingShowContext } from "@/lib/bookingContext";
import { SHARED_PRICE_PER_SEAT } from "@/lib/sharedPricing";
import {
  getInternalOrderById,
  saveInternalOrder,
  updateInternalOrderPaymentById,
} from "@/lib/orders";

const PRICE_PER_SEAT = SHARED_PRICE_PER_SEAT;
const HOLD_TTL_MINUTES = 20;
const DEFAULT_CAPACITY: Record<"denver" | "golden", number> = {
  denver: 24,
  golden: 14,
};

type PickupHub = "denver" | "golden";
type HoldStatus = "pending" | "confirmed" | "cancelled" | "expired";

type InventoryHold = {
  internalOrderId: string;
  venue: string;
  date: string;
  pickupHub: PickupHub;
  qty: number;
  artist?: string | null;
  createdAt: string;
  expiresAt: string;
  status: HoldStatus;
  squareOrderId?: string | null;
  squarePaymentLinkId?: string | null;
  squarePaymentId?: string | null;
  paidAt?: string | null;
};

type InventoryState = {
  updatedAt?: string;
  holds: Record<string, InventoryHold>;
};

type CustomerInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCountry?: string | null;
};

function inventoryPath() {
  return path.join(process.cwd(), "data", "orders", "shared-inventory.json");
}

const SHARED_INVENTORY_BLOB_PATH = "cache/orders/shared-inventory.json";

function useBlobSharedInventory() {
  return process.env.VERCEL === "1" && !!process.env.BLOB_READ_WRITE_TOKEN;
}

function addMinutes(iso: string, minutes: number) {
  return new Date(new Date(iso).getTime() + minutes * 60_000).toISOString();
}

function isExpired(hold: InventoryHold, nowIso: string) {
  return hold.status === "pending" && hold.expiresAt <= nowIso;
}

function canCancelByDate(showDate: string, now = new Date()) {
  const showStart = new Date(`${showDate}T19:00:00`);
  if (Number.isNaN(showStart.getTime())) return false;
  return showStart.getTime() - now.getTime() > 24 * 60 * 60 * 1000;
}

async function loadState(): Promise<InventoryState> {
  if (useBlobSharedInventory()) {
    const parsed = await blobReadJson<InventoryState>(SHARED_INVENTORY_BLOB_PATH, { revalidateSeconds: 0 }).catch(() => null);
    const holds = parsed && typeof parsed === "object" && parsed.holds && typeof parsed.holds === "object"
      ? parsed.holds
      : {};
    return { updatedAt: parsed?.updatedAt, holds };
  }
  try {
    const raw = await readFile(inventoryPath(), "utf8");
    const parsed = JSON.parse(raw);
    const holds = parsed && typeof parsed === "object" && parsed.holds && typeof parsed.holds === "object"
      ? parsed.holds
      : {};
    return { updatedAt: parsed?.updatedAt, holds };
  } catch {
    return { holds: {} };
  }
}

async function saveState(state: InventoryState) {
  state.updatedAt = new Date().toISOString();
  if (useBlobSharedInventory()) {
    await blobWriteJson(SHARED_INVENTORY_BLOB_PATH, state, { cacheControlMaxAge: 60 });
    return;
  }
  const file = inventoryPath();
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(state, null, 2));
}

function sanitizeState(state: InventoryState) {
  const nowIso = new Date().toISOString();
  let changed = false;

  for (const hold of Object.values(state.holds)) {
    if (isExpired(hold, nowIso)) {
      hold.status = "expired";
      changed = true;
    }
  }

  return { changed, nowIso };
}

async function loadSanitizedState() {
  const state = await loadState();
  const { changed } = sanitizeState(state);
  if (changed) await saveState(state);
  return state;
}

function countCommittedSeats(
  state: InventoryState,
  input: { venue: string; date: string; pickupHub: PickupHub },
  excludeInternalOrderId?: string | null,
) {
  return Object.values(state.holds)
    .filter((hold) => {
      if (excludeInternalOrderId && hold.internalOrderId === excludeInternalOrderId) return false;
      if (hold.venue !== input.venue || hold.date !== input.date || hold.pickupHub !== input.pickupHub) return false;
      return hold.status === "pending" || hold.status === "confirmed";
    })
    .reduce((sum, hold) => sum + hold.qty, 0);
}

export async function getSharedInventorySnapshot(input: { venue: string; date: string; pickupHub: PickupHub }) {
  const state = await loadSanitizedState();
  const capacity = DEFAULT_CAPACITY[input.pickupHub];
  const reserved = countCommittedSeats(state, input);
  return {
    venue: input.venue,
    date: input.date,
    pickupHub: input.pickupHub,
    capacity,
    reserved,
    available: Math.max(0, capacity - reserved),
    pricePerSeat: PRICE_PER_SEAT,
    holdTtlMinutes: HOLD_TTL_MINUTES,
  };
}

export async function createPendingSharedCheckout(input: {
  venue: string;
  date: string;
  pickupHub: PickupHub;
  qty: number;
  artist?: string | null;
  event?: string | null;
  show?: BookingShowContext | null;
  customer: CustomerInput;
  notes?: string | null;
}) {
  const qty = Number.isFinite(input.qty) ? Math.max(1, Math.floor(input.qty)) : 1;
  const state = await loadSanitizedState();
  const capacity = DEFAULT_CAPACITY[input.pickupHub];
  const reserved = countCommittedSeats(state, input);
  const available = Math.max(0, capacity - reserved);
  const show = input.show ?? null;
  const resolvedArtist = show?.artistName || input.artist || null;

  if (qty > available) {
    throw new Error(`Only ${available} shared seat${available === 1 ? "" : "s"} left for ${input.pickupHub}.`);
  }

  const created = await saveInternalOrder({
    rezdyBookingReference: null,
    rezdyBookingPayload: {
      source: "internal_shared_inventory",
      venue: input.venue,
      venueSlug: show?.venueSlug || input.venue,
      date: input.date,
      dateKey: show?.dateKey || input.date,
      pickupHub: input.pickupHub,
      qty,
      event: input.event || show?.showId || null,
      artist: resolvedArtist,
      showId: show?.showId || null,
      showSlug: show?.showSlug || null,
      showTitle: show?.showTitle || null,
      artistSlug: show?.artistSlug || null,
      show,
    },
    productCode: `shared-${input.pickupHub}`,
    sessionKey: `${input.date}:${input.pickupHub}`,
    customer: input.customer,
    booking: {
      status: "pending_payment",
      source: "partyatredrocks_shared_square",
      show,
    },
    payment: {
      provider: "square",
      status: "unpaid",
      totalDue: qty * PRICE_PER_SEAT,
      totalPaid: 0,
      source: "square_payment_link",
      handoffMode: "url",
      operatorAction: "Awaiting Square checkout completion.",
    },
    pickup: {
      venue: input.venue,
      venueSlug: show?.venueSlug || input.venue,
      date: input.date,
      dateKey: show?.dateKey || input.date,
      pickupHub: input.pickupHub,
      artist: resolvedArtist,
      event: input.event || show?.showId || null,
      notes: input.notes || null,
      qty,
      show,
    },
  });

  state.holds[created.internalOrderId] = {
    internalOrderId: created.internalOrderId,
    venue: input.venue,
    date: input.date,
    pickupHub: input.pickupHub,
    qty,
    artist: resolvedArtist,
    createdAt: created.createdAt,
    expiresAt: addMinutes(created.createdAt, HOLD_TTL_MINUTES),
    status: "pending",
  };
  await saveState(state);

  return {
    internalOrderId: created.internalOrderId,
    bookingToken: created.bookingToken,
    createdAt: created.createdAt,
    expiresAt: state.holds[created.internalOrderId].expiresAt,
    totalDue: qty * PRICE_PER_SEAT,
    totalDueCents: qty * PRICE_PER_SEAT * 100,
    availableAfterHold: Math.max(0, available - qty),
    pricePerSeat: PRICE_PER_SEAT,
  };
}

export async function attachSharedSquareOrder(input: {
  internalOrderId: string;
  squareOrderId?: string | null;
  fallbackHold?: {
    venue: string;
    date: string;
    pickupHub: PickupHub;
    qty: number;
    artist?: string | null;
    createdAt: string;
    expiresAt: string;
  } | null;
}) {
  const state = await loadSanitizedState();
  let hold = state.holds[input.internalOrderId];

  if (!hold && input.fallbackHold) {
    hold = state.holds[input.internalOrderId] = {
      internalOrderId: input.internalOrderId,
      venue: input.fallbackHold.venue,
      date: input.fallbackHold.date,
      pickupHub: input.fallbackHold.pickupHub,
      qty: input.fallbackHold.qty,
      artist: input.fallbackHold.artist ?? null,
      createdAt: input.fallbackHold.createdAt,
      expiresAt: input.fallbackHold.expiresAt,
      status: "pending",
    };
  }

  if (!hold) {
    const order = await getInternalOrderById(input.internalOrderId);
    const pickupHub = order?.rezdyBookingPayload?.pickupHub === "golden"
      ? "golden"
      : order?.rezdyBookingPayload?.pickupHub === "denver"
        ? "denver"
        : null;
    const venue = typeof order?.rezdyBookingPayload?.venue === "string" ? order.rezdyBookingPayload.venue.trim() : "";
    const date = typeof order?.rezdyBookingPayload?.date === "string" ? order.rezdyBookingPayload.date.trim() : "";
    const qty = typeof order?.rezdyBookingPayload?.qty === "number" && Number.isFinite(order.rezdyBookingPayload.qty)
      ? Math.max(1, Math.floor(order.rezdyBookingPayload.qty))
      : null;

    if (!order || !pickupHub || !venue || !date || !qty) {
      throw new Error("Pending shared hold not found.");
    }

    hold = state.holds[input.internalOrderId] = {
      internalOrderId: input.internalOrderId,
      venue,
      date,
      pickupHub,
      qty,
      artist: typeof order.rezdyBookingPayload?.artist === "string" ? order.rezdyBookingPayload.artist : null,
      createdAt: order.createdAt,
      expiresAt: addMinutes(order.createdAt, HOLD_TTL_MINUTES),
      status: "pending",
    };
  }

  hold.squareOrderId = input.squareOrderId ?? null;
  await saveState(state);

  await updateInternalOrderPaymentById(input.internalOrderId, {
    bookingStatus: "pending_payment",
    paymentStatus: "unpaid",
    bookingPatch: {
      squareOrderId: input.squareOrderId ?? null,
    },
    paymentPatch: {
      handoffMode: "embedded",
      handoffUrl: null,
      paymentLinkId: null,
      squareOrderId: input.squareOrderId ?? null,
      provider: "square",
    },
    eventType: "shared.checkout.created",
    payload: {
      squareOrderId: input.squareOrderId ?? null,
      checkoutMode: "embedded",
    },
  });
}

export async function attachSharedCheckoutLink(input: {
  internalOrderId: string;
  checkoutUrl: string;
  squarePaymentLinkId?: string | null;
  squareOrderId?: string | null;
  fallbackHold?: {
    venue: string;
    date: string;
    pickupHub: PickupHub;
    qty: number;
    artist?: string | null;
    createdAt: string;
    expiresAt: string;
  } | null;
}) {
  const state = await loadSanitizedState();
  let hold = state.holds[input.internalOrderId];

  if (!hold && input.fallbackHold) {
    hold = state.holds[input.internalOrderId] = {
      internalOrderId: input.internalOrderId,
      venue: input.fallbackHold.venue,
      date: input.fallbackHold.date,
      pickupHub: input.fallbackHold.pickupHub,
      qty: input.fallbackHold.qty,
      artist: input.fallbackHold.artist ?? null,
      createdAt: input.fallbackHold.createdAt,
      expiresAt: input.fallbackHold.expiresAt,
      status: "pending",
    };
  }

  if (!hold) {
    const order = await getInternalOrderById(input.internalOrderId);
    const pickupHub = order?.rezdyBookingPayload?.pickupHub === "golden"
      ? "golden"
      : order?.rezdyBookingPayload?.pickupHub === "denver"
        ? "denver"
        : null;
    const venue = typeof order?.rezdyBookingPayload?.venue === "string" ? order.rezdyBookingPayload.venue.trim() : "";
    const date = typeof order?.rezdyBookingPayload?.date === "string" ? order.rezdyBookingPayload.date.trim() : "";
    const qty = typeof order?.rezdyBookingPayload?.qty === "number" && Number.isFinite(order.rezdyBookingPayload.qty)
      ? Math.max(1, Math.floor(order.rezdyBookingPayload.qty))
      : null;

    if (!order || !pickupHub || !venue || !date || !qty) {
      throw new Error("Pending shared hold not found.");
    }

    hold = state.holds[input.internalOrderId] = {
      internalOrderId: input.internalOrderId,
      venue,
      date,
      pickupHub,
      qty,
      artist: typeof order.rezdyBookingPayload?.artist === "string" ? order.rezdyBookingPayload.artist : null,
      createdAt: order.createdAt,
      expiresAt: addMinutes(order.createdAt, HOLD_TTL_MINUTES),
      status: "pending",
    };
  }

  hold.squarePaymentLinkId = input.squarePaymentLinkId ?? null;
  hold.squareOrderId = input.squareOrderId ?? null;
  await saveState(state);

  await updateInternalOrderPaymentById(input.internalOrderId, {
    bookingStatus: "pending_payment",
    paymentStatus: "unpaid",
    bookingPatch: {
      squareOrderId: input.squareOrderId ?? null,
    },
    paymentPatch: {
      handoffMode: "url",
      handoffUrl: input.checkoutUrl,
      paymentLinkId: input.squarePaymentLinkId ?? null,
      squareOrderId: input.squareOrderId ?? null,
      provider: "square",
    },
    eventType: "shared.checkout.created",
    payload: {
      checkoutUrl: input.checkoutUrl,
      squarePaymentLinkId: input.squarePaymentLinkId ?? null,
      squareOrderId: input.squareOrderId ?? null,
    },
  });
}

export async function cancelPendingSharedCheckout(internalOrderId: string, reason = "cancelled") {
  const state = await loadSanitizedState();
  const hold = state.holds[internalOrderId];
  if (!hold || hold.status !== "pending") return;

  hold.status = reason === "expired" ? "expired" : "cancelled";
  await saveState(state);

  await updateInternalOrderPaymentById(internalOrderId, {
    bookingStatus: hold.status,
    paymentStatus: "unpaid",
    bookingPatch: { cancelledReason: reason },
    paymentPatch: { status: "unpaid" },
    eventType: "shared.checkout.cancelled",
    payload: { reason },
  });
}

export async function getSharedHoldBySquareOrderId(squareOrderId: string) {
  const state = await loadSanitizedState();
  return Object.values(state.holds).find((hold) => hold.squareOrderId === squareOrderId) ?? null;
}

export async function getSharedCheckoutStatus(internalOrderId: string) {
  const [state, order] = await Promise.all([
    loadSanitizedState(),
    getInternalOrderById(internalOrderId),
  ]);
  const hold = state.holds[internalOrderId] ?? null;

  return {
    order,
    hold,
  };
}

export async function confirmSharedPayment(input: {
  internalOrderId: string;
  squareOrderId?: string | null;
  squarePaymentId?: string | null;
  totalPaidCents?: number | null;
  receiptUrl?: string | null;
  payload?: unknown;
}) {
  const state = await loadSanitizedState();
  let hold = state.holds[input.internalOrderId];

  if (!hold) {
    const order = await getInternalOrderById(input.internalOrderId);
    const pickupHub = order?.rezdyBookingPayload?.pickupHub === "golden"
      ? "golden"
      : order?.rezdyBookingPayload?.pickupHub === "denver"
        ? "denver"
        : null;
    const venue = typeof order?.rezdyBookingPayload?.venue === "string" ? order.rezdyBookingPayload.venue.trim() : "";
    const date = typeof order?.rezdyBookingPayload?.date === "string" ? order.rezdyBookingPayload.date.trim() : "";
    const qty = typeof order?.rezdyBookingPayload?.qty === "number" && Number.isFinite(order.rezdyBookingPayload.qty)
      ? Math.max(1, Math.floor(order.rezdyBookingPayload.qty))
      : null;

    if (!order || !pickupHub || !venue || !date || !qty) {
      throw new Error("Shared hold not found.");
    }

    hold = state.holds[input.internalOrderId] = {
      internalOrderId: input.internalOrderId,
      venue,
      date,
      pickupHub,
      qty,
      artist: typeof order.rezdyBookingPayload?.artist === "string" ? order.rezdyBookingPayload.artist : null,
      createdAt: order.createdAt,
      expiresAt: addMinutes(order.createdAt, HOLD_TTL_MINUTES),
      status: "pending",
      squareOrderId: typeof order.payment?.squareOrderId === "string" ? order.payment.squareOrderId : null,
      squarePaymentLinkId: typeof order.payment?.paymentLinkId === "string" ? order.payment.paymentLinkId : null,
    };
  }

  if (hold.status === "confirmed") return { alreadyConfirmed: true as const };
  if (hold.status !== "pending") throw new Error(`Shared hold is ${hold.status}.`);

  hold.status = "confirmed";
  hold.paidAt = new Date().toISOString();
  hold.squareOrderId = input.squareOrderId ?? hold.squareOrderId ?? null;
  hold.squarePaymentId = input.squarePaymentId ?? hold.squarePaymentId ?? null;
  await saveState(state);

  const totalPaid = typeof input.totalPaidCents === "number" && Number.isFinite(input.totalPaidCents)
    ? input.totalPaidCents / 100
    : hold.qty * PRICE_PER_SEAT;

  const updated = await updateInternalOrderPaymentById(input.internalOrderId, {
    bookingStatus: "confirmed",
    paymentStatus: "paid",
    bookingPatch: {
      status: "confirmed",
      confirmedAt: hold.paidAt,
      orderNumber: hold.squareOrderId ?? hold.internalOrderId,
      squareOrderId: hold.squareOrderId ?? null,
    },
    paymentPatch: {
      provider: "square",
      status: "paid",
      totalPaid,
      totalDue: hold.qty * PRICE_PER_SEAT,
      paidAt: hold.paidAt,
      receiptUrl: input.receiptUrl ?? null,
      squarePaymentId: hold.squarePaymentId ?? null,
      squareOrderId: hold.squareOrderId ?? null,
    },
    eventType: "shared.payment.completed",
    payload: input.payload ?? {
      squareOrderId: hold.squareOrderId ?? null,
      squarePaymentId: hold.squarePaymentId ?? null,
      totalPaid,
    },
  });

  return {
    alreadyConfirmed: false as const,
    order: updated,
    hold,
  };
}

export async function cancelSharedBookingByInternalOrderId(
  internalOrderId: string,
  reason = "customer_self_service"
) {
  const [state, order] = await Promise.all([
    loadSanitizedState(),
    getInternalOrderById(internalOrderId),
  ]);
  const hold = state.holds[internalOrderId] ?? null;

  if (!order || !hold) {
    return { ok: false as const, reason: "not_found" as const };
  }

  if (hold.status === "cancelled") {
    return { ok: true as const, alreadyCancelled: true as const, order, hold };
  }

  if (hold.status === "expired") {
    return { ok: false as const, reason: "expired" as const };
  }

  if (!canCancelByDate(hold.date)) {
    return { ok: false as const, reason: "cutoff_passed" as const };
  }

  hold.status = "cancelled";
  await saveState(state);

  const updatedOrder = await updateInternalOrderPaymentById(internalOrderId, {
    bookingStatus: "cancelled",
    paymentStatus: null,
    bookingPatch: {
      cancelledAt: new Date().toISOString(),
      cancelledReason: reason,
      cancelSource: "public_booking_page",
    },
    paymentPatch: {},
    eventType: "shared.booking.cancelled",
    payload: { reason },
  });

  return {
    ok: true as const,
    alreadyCancelled: false as const,
    order: updatedOrder,
    hold,
  };
}
