import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getInternalOrderById, updateInternalOrderPaymentById } from "@/lib/orders";
import { sendSharedBookingConfirmation } from "@/lib/sharedConfirmation";
import { siteOrigin, squareClient, squareLocationId } from "@/lib/square";

export const runtime = "nodejs";

type Body = {
  internalOrderId?: string;
  squareOrderId?: string;
  sourceId?: string;
  dccHandoffId?: string;
};

function requiredString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const internalOrderId = requiredString(body.internalOrderId);
  const squareOrderId = requiredString(body.squareOrderId);
  const sourceId = requiredString(body.sourceId);

  if (!internalOrderId || !squareOrderId || !sourceId) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  const order = await getInternalOrderById(internalOrderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const totalDue = typeof order.payment?.totalDue === "number" && Number.isFinite(order.payment.totalDue)
    ? order.payment.totalDue
    : null;
  const bookingToken = typeof order.bookingToken === "string" ? order.bookingToken.trim() : "";
  const dccHandoffId = requiredString(body.dccHandoffId)
    || (typeof order.payment?.dccHandoffId === "string" ? order.payment.dccHandoffId.trim() : "");

  if (!totalDue || !bookingToken) {
    return NextResponse.json({ error: "Checkout is missing order details" }, { status: 409 });
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
      orderId: squareOrderId,
      referenceId: internalOrderId,
      note: dccHandoffId
        ? `PARR private ride ${internalOrderId} | dcc:${dccHandoffId}`
        : `PARR private ride ${internalOrderId}`,
    });

    const payment = response.payment;
    if (!payment || payment.status !== "COMPLETED") {
      return NextResponse.json({ error: "Square did not complete the payment" }, { status: 409 });
    }

    await updateInternalOrderPaymentById(internalOrderId, {
      bookingStatus: "confirmed",
      paymentStatus: "paid",
      bookingPatch: {
        status: "confirmed",
        orderNumber: squareOrderId,
      },
      paymentPatch: {
        status: "paid",
        totalPaid: totalDue,
        dccHandoffId: dccHandoffId || null,
        handoffMode: "embedded_square",
        handoffUrl: null,
        operatorAction: "Private ride checkout completed on Party at Red Rocks.",
        squareOrderId,
        squarePaymentId: typeof payment.id === "string" ? payment.id : null,
        receiptUrl: typeof payment.receiptUrl === "string" ? payment.receiptUrl : null,
      },
      eventType: "internal.order.private_payment_completed",
      payload: {
        internalOrderId,
        squareOrderId,
        squarePaymentId: typeof payment.id === "string" ? payment.id : null,
        dccHandoffId: dccHandoffId || null,
      },
    });

    const updatedOrder = await getInternalOrderById(internalOrderId);
    await sendSharedBookingConfirmation(updatedOrder).catch(() => undefined);

    return NextResponse.json({
      ok: true,
      successUrl: `${siteOrigin()}/booking/${encodeURIComponent(bookingToken)}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process payment";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
