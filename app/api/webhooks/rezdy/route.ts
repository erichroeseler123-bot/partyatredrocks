import { NextResponse } from "next/server";
import { getInternalOrderByBookingReference, saveInternalOrderStateUpdate, saveRezdyWebhookEvent } from "@/lib/orders";
import type { RecentBooking } from "@/lib/recentBookings";
import { appendRecentBooking } from "@/lib/recentBookingsStore";

export const runtime = "nodejs";

function pickString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function readRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function readArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function pickNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function extractBookingRef(payload: unknown): string | null {
  const root = readRecord(payload);
  if (!root) return null;
  const booking = readRecord(root.booking);
  return (
    pickString(root.bookingCode) ||
    pickString(root.orderNumber) ||
    pickString(booking?.bookingCode) ||
    pickString(booking?.orderNumber) ||
    null
  );
}

function extractBookingStatus(payload: unknown): string | null {
  const root = readRecord(payload);
  if (!root) return null;
  const booking = readRecord(root.booking);
  return pickString(root.status) || pickString(booking?.status) || null;
}

function extractPaymentStatus(payload: unknown): string | null {
  const root = readRecord(payload);
  if (!root) return null;
  const payment = readRecord(root.payment);
  return pickString(root.paymentStatus) || pickString(payment?.status) || null;
}

function normalizeCity(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed
    .split(/[,\n]/)[0]
    .trim()
    .replace(/\s+/g, " ");
}

function firstString(values: unknown[]): string | null {
  for (const value of values) {
    const picked = pickString(value);
    if (picked) return picked;
  }
  return null;
}

function inferRideType(value: string | null): RecentBooking["rideType"] | null {
  if (!value) return null;
  const lower = value.toLowerCase();
  if (/(private|suburban|suv|van|party bus|party-bus|bus)/.test(lower)) return "private";
  if (/(shared|shuttle|seat)/.test(lower)) return "shared";
  return null;
}

function extractProductContext(payload: unknown): {
  rideType: RecentBooking["rideType"] | null;
  productLabel?: string;
  quantity?: number;
} {
  const root = readRecord(payload);
  const booking = readRecord(root?.booking);
  const itemRecords = [
    ...readArray(root?.items).map(readRecord),
    ...readArray(booking?.items).map(readRecord),
  ].filter((row): row is Record<string, unknown> => row !== null);

  const quantity = itemRecords.reduce<number | null>((sum, item) => {
    const quantities = readArray(item.quantities)
      .map(readRecord)
      .filter((row): row is Record<string, unknown> => row !== null);
    const subtotal = quantities.reduce((acc, row) => acc + (pickNumber(row.value) ?? 0), 0);
    if (subtotal > 0) return (sum ?? 0) + subtotal;
    return sum;
  }, null);

  const optionLabel = firstString(
    itemRecords.flatMap((item) =>
      readArray(item.quantities)
        .map(readRecord)
        .filter((row): row is Record<string, unknown> => row !== null)
        .map((row) => row.optionLabel)
    )
  );

  const productLabel = firstString([
    optionLabel,
    ...itemRecords.flatMap((item) => [item.productName, item.name, item.productCode]),
    root?.productName,
    root?.name,
    root?.productCode,
    booking?.productName,
    booking?.name,
    booking?.productCode,
  ]);

  return {
    rideType: inferRideType(productLabel),
    productLabel: productLabel ?? undefined,
    quantity: quantity && quantity > 0 ? quantity : undefined,
  };
}

async function buildRecentBooking(eventType: string, payload: unknown): Promise<RecentBooking | null> {
  if (!eventType.startsWith("booking.")) return null;

  const root = readRecord(payload);
  const booking = readRecord(root?.booking);
  const customer = readRecord(root?.customer) ?? readRecord(booking?.customer);
  const bookingRef = extractBookingRef(payload);
  const fallbackOrder = bookingRef ? await getInternalOrderByBookingReference(bookingRef).catch(() => null) : null;
  const fallbackCustomer = fallbackOrder?.customer ?? null;

  const city = normalizeCity(
    firstString([customer?.city, customer?.suburb, fallbackCustomer?.city, fallbackCustomer?.suburb])
  );
  if (!city) return null;

  const product = extractProductContext(payload);
  const fallbackLabel = firstString([
    ...readArray(fallbackOrder?.rezdyBookingPayload?.items).flatMap((item) => {
      const row = readRecord(item);
      if (!row) return [];
      return readArray(row.quantities)
        .map(readRecord)
        .filter((entry): entry is Record<string, unknown> => entry !== null)
        .map((entry) => entry.optionLabel);
    }),
    fallbackOrder?.booking?.productName,
    fallbackOrder?.booking?.name,
    fallbackOrder?.productCode,
  ]);
  const rideType = product.rideType ?? inferRideType(fallbackLabel) ?? null;
  if (!rideType) return null;

  const createdAtRaw =
    firstString([root?.createdAt, root?.created, booking?.createdAt, booking?.created]) ??
    new Date().toISOString();
  const createdAt = Number.isFinite(Date.parse(createdAtRaw)) ? createdAtRaw : new Date().toISOString();

  return {
    city,
    rideType,
    productLabel: product.productLabel ?? fallbackLabel ?? undefined,
    quantity: product.quantity,
    createdAt,
  };
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON webhook body" }, { status: 400 });
  }

  const eventType = request.headers.get("x-rezdy-event") || "unknown";
  const signature = request.headers.get("x-rezdy-signature") || null;

  // TODO: verify Rezdy webhook signature once signature spec/secret is confirmed.
  try {
    await saveRezdyWebhookEvent(eventType, payload);
    await saveInternalOrderStateUpdate({
      eventType,
      rezdyBookingReference: extractBookingRef(payload),
      bookingStatus: extractBookingStatus(payload),
      paymentStatus: extractPaymentStatus(payload),
      payload,
    });
    const recentBooking = await buildRecentBooking(eventType, payload);
    if (recentBooking) {
      await appendRecentBooking(recentBooking);
    }
  } catch (error) {
    // Webhook receivers should still return 2xx quickly; persistence failures are non-fatal.
    console.error("[rezdy webhook] failed to persist webhook/order state update", error);
  }

  return NextResponse.json({ received: true, eventType, signaturePresent: Boolean(signature) });
}
