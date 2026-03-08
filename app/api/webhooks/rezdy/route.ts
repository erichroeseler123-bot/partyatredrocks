import { NextResponse } from "next/server";
import { saveInternalOrderStateUpdate, saveRezdyWebhookEvent } from "@/lib/orders";

export const runtime = "nodejs";

function pickString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function readRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
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
  } catch (error) {
    // Webhook receivers should still return 2xx quickly; persistence failures are non-fatal.
    console.error("[rezdy webhook] failed to persist webhook/order state update", error);
  }

  return NextResponse.json({ received: true, eventType, signaturePresent: Boolean(signature) });
}
