import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  appendInternalOrderEvent,
  getInternalOrderByAnyReference,
  updateInternalOrderPaymentById,
} from "@/lib/orders";
import { sendSharedBookingConfirmation } from "@/lib/sharedConfirmation";
import { confirmSharedPayment } from "@/lib/sharedInventory";
import { siteOrigin, squareClient, squareLocationId } from "@/lib/square";

export const runtime = "nodejs";

type Body = {
  token?: string;
  sourceId?: string;
};

function requiredString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function numberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function isSharedOrder(productCode: string | undefined) {
  return String(productCode || "").startsWith("shared-");
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const token = requiredString(body.token);
  const sourceId = requiredString(body.sourceId);
  if (!token || !sourceId) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  const order = await getInternalOrderByAnyReference(token);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const totalDue = numberValue(order.payment?.totalDue);
  const totalPaid = numberValue(order.payment?.totalPaid);
  const remainingDue = Math.max(0, totalDue - totalPaid);
  if (!totalDue || remainingDue <= 0 || order.payment?.status === "paid") {
    return NextResponse.json({
      ok: true,
      alreadyPaid: true,
      successUrl: `${siteOrigin()}/booking/${encodeURIComponent(order.bookingToken || order.internalOrderId)}`,
    });
  }

  const squareOrderId =
    stringValue(order.payment?.squareOrderId) ||
    stringValue(order.booking?.squareOrderId) ||
    stringValue(order.booking?.orderNumber);

  try {
    const response = await squareClient().payments.create({
      sourceId,
      idempotencyKey: randomUUID(),
      amountMoney: {
        amount: BigInt(Math.round(remainingDue * 100)),
        currency: "USD",
      },
      autocomplete: true,
      locationId: squareLocationId(),
      orderId: squareOrderId || undefined,
      referenceId: order.internalOrderId,
      note: `PARR balance payment ${order.internalOrderId}`,
    });

    const payment = response.payment;
    if (!payment || payment.status !== "COMPLETED") {
      return NextResponse.json({ error: "Square did not complete the payment" }, { status: 409 });
    }

    if (isSharedOrder(order.productCode)) {
      await confirmSharedPayment({
        internalOrderId: order.internalOrderId,
        squareOrderId: typeof payment.orderId === "string" ? payment.orderId : squareOrderId,
        squarePaymentId: typeof payment.id === "string" ? payment.id : null,
        totalPaidCents: Math.round(totalDue * 100),
        receiptUrl: typeof payment.receiptUrl === "string" ? payment.receiptUrl : null,
        payload: {
          source: "parr_pay_balance",
          squareOrderId: typeof payment.orderId === "string" ? payment.orderId : squareOrderId,
          squarePaymentId: typeof payment.id === "string" ? payment.id : null,
        },
      });
      await appendInternalOrderEvent({
        internalOrderId: order.internalOrderId,
        eventType: "balance_payment_completed",
        bookingStatus: "confirmed",
        paymentStatus: "paid",
        payload: {
          source: "pay_balance",
          productCode: order.productCode ?? null,
          squareOrderId: typeof payment.orderId === "string" ? payment.orderId : squareOrderId,
          squarePaymentId: typeof payment.id === "string" ? payment.id : null,
          totalPaid: totalDue,
        },
      }).catch(() => undefined);
    } else {
      const updated = await updateInternalOrderPaymentById(order.internalOrderId, {
        bookingStatus: "confirmed",
        paymentStatus: "paid",
        bookingPatch: {
          status: "confirmed",
          confirmedAt: new Date().toISOString(),
          orderNumber: typeof payment.orderId === "string" ? payment.orderId : squareOrderId,
          squareOrderId: typeof payment.orderId === "string" ? payment.orderId : squareOrderId,
        },
        paymentPatch: {
          provider: "square",
          status: "paid",
          totalDue,
          totalPaid: totalDue,
          paidAt: new Date().toISOString(),
          receiptUrl: typeof payment.receiptUrl === "string" ? payment.receiptUrl : null,
          squarePaymentId: typeof payment.id === "string" ? payment.id : null,
          squareOrderId: typeof payment.orderId === "string" ? payment.orderId : squareOrderId,
          handoffMode: "embedded_square",
          handoffUrl: null,
          operatorAction: "Balance payment completed on Party at Red Rocks.",
        },
        eventType: "balance_payment_completed",
        payload: {
          source: "pay_balance",
          productCode: order.productCode ?? null,
          squareOrderId: typeof payment.orderId === "string" ? payment.orderId : squareOrderId,
          squarePaymentId: typeof payment.id === "string" ? payment.id : null,
          totalPaid: totalDue,
        },
      });
      await sendSharedBookingConfirmation(updated).catch(() => undefined);
    }

    return NextResponse.json({
      ok: true,
      successUrl: `${siteOrigin()}/booking/${encodeURIComponent(order.bookingToken || order.internalOrderId)}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process payment";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
