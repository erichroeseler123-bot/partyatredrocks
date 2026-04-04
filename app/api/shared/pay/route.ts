import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getInternalOrderById } from "@/lib/orders";
import { sendSharedBookingConfirmation } from "@/lib/sharedConfirmation";
import { confirmSharedPayment, getSharedCheckoutStatus } from "@/lib/sharedInventory";
import { siteOrigin, squareClient, squareLocationId } from "@/lib/square";

export const runtime = "nodejs";

type Body = {
  internalOrderId?: string;
  sourceId?: string;
  squareOrderId?: string;
  dccHandoffId?: string;
};

function requiredString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getInternalOrderWithRetry(internalOrderId: string) {
  const delays = [0, 150, 350, 750];

  for (const delayMs of delays) {
    if (delayMs > 0) await sleep(delayMs);
    const order = await getInternalOrderById(internalOrderId);
    if (order) return order;
  }

  return null;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const internalOrderId = requiredString(body.internalOrderId);
  const sourceId = requiredString(body.sourceId);
  const squareOrderId = requiredString(body.squareOrderId);

  if (!internalOrderId || !sourceId) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  const order = await getInternalOrderWithRetry(internalOrderId);
  if (!order) {
    const { hold } = await getSharedCheckoutStatus(internalOrderId);
    if (hold?.status === "pending") {
      return NextResponse.json({ error: "Checkout hold is still syncing. Try the payment again in a few seconds." }, { status: 409 });
    }
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const totalDue = typeof order.payment?.totalDue === "number" && Number.isFinite(order.payment.totalDue)
    ? order.payment.totalDue
    : null;
  const resolvedSquareOrderId = squareOrderId || (typeof order.payment?.squareOrderId === "string" ? order.payment.squareOrderId.trim() : "");
  const dccHandoffId = requiredString(body.dccHandoffId)
    || (typeof order.payment?.dccHandoffId === "string" ? order.payment.dccHandoffId.trim() : "");

  if (!totalDue || !resolvedSquareOrderId) {
    return NextResponse.json({ error: "Checkout is missing Square order details" }, { status: 409 });
  }

  try {
    const response = await squareClient().payments.create({
      sourceId,
      idempotencyKey: randomUUID(),
      amountMoney: {
        amount: BigInt(Math.round(totalDue * 100)),
        currency: "USD",
      },
      autocomplete: true,
      locationId: squareLocationId(),
      orderId: resolvedSquareOrderId,
      referenceId: internalOrderId,
      note: dccHandoffId
        ? `PARR shared shuttle ${internalOrderId} | dcc:${dccHandoffId}`
        : `PARR shared shuttle ${internalOrderId}`,
    });

    const payment = response.payment;
    if (!payment || payment.status !== "COMPLETED") {
      return NextResponse.json({ error: "Square did not complete the payment" }, { status: 409 });
    }

    const result = await confirmSharedPayment({
      internalOrderId,
      squareOrderId: typeof payment.orderId === "string" ? payment.orderId : resolvedSquareOrderId,
      squarePaymentId: typeof payment.id === "string" ? payment.id : null,
      totalPaidCents: typeof payment.totalMoney?.amount === "bigint" ? Number(payment.totalMoney.amount) : null,
      receiptUrl: typeof payment.receiptUrl === "string" ? payment.receiptUrl : null,
      payload: {
        source: "shared_square_embedded",
        squareOrderId: typeof payment.orderId === "string" ? payment.orderId : resolvedSquareOrderId,
        squarePaymentId: typeof payment.id === "string" ? payment.id : null,
        dccHandoffId: dccHandoffId || null,
      },
    });

    if (!result.alreadyConfirmed) {
      const updatedOrder = await getInternalOrderById(internalOrderId);
      await sendSharedBookingConfirmation(updatedOrder).catch(() => undefined);
    }

    return NextResponse.json({
      ok: true,
      internalOrderId,
      successUrl: `${siteOrigin()}/book/red-rocks-amphitheatre/shared/success?internalOrderId=${encodeURIComponent(internalOrderId)}&orderId=${encodeURIComponent(resolvedSquareOrderId)}&transactionId=${encodeURIComponent(typeof payment.id === "string" ? payment.id : "")}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process payment";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
