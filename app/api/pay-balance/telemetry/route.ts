import { NextResponse } from "next/server";
import {
  appendInternalOrderEvent,
  getInternalOrderByAnyReference,
} from "@/lib/orders";

export const runtime = "nodejs";

const ALLOWED_EVENTS = new Set([
  "payment_page_viewed",
  "balance_payment_initiated",
]);

type Body = {
  token?: string;
  eventType?: string;
  amountLabel?: string;
};

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Body | null;
  const token = cleanString(body?.token);
  const eventType = cleanString(body?.eventType);

  if (!token || !ALLOWED_EVENTS.has(eventType)) {
    return NextResponse.json({ error: "Invalid telemetry event" }, { status: 400 });
  }

  const order = await getInternalOrderByAnyReference(token);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  await appendInternalOrderEvent({
    internalOrderId: order.internalOrderId,
    eventType,
    bookingStatus: typeof order.booking?.status === "string" ? order.booking.status : null,
    paymentStatus: typeof order.payment?.status === "string" ? order.payment.status : null,
    payload: {
      source: "pay_balance",
      token,
      amountLabel: cleanString(body?.amountLabel) || null,
      bookingToken: order.bookingToken ?? null,
      productCode: order.productCode ?? null,
    },
  });

  return NextResponse.json({ ok: true });
}
