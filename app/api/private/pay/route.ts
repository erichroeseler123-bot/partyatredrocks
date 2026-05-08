import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getInternalOrderById, updateInternalOrderPaymentById } from "@/lib/orders";
import { PRIVATE_RIDE_OPTIONS } from "@/lib/rideCatalog";
import { sendSharedBookingConfirmation } from "@/lib/sharedConfirmation";
import { siteOrigin, squareClient, squareLocationId } from "@/lib/square";

export const runtime = "nodejs";

type Body = {
  internalOrderId?: string;
  squareOrderId?: string;
  sourceId?: string;
  dccHandoffId?: string;
  bookingToken?: string;
  totalDue?: number;
};

function requiredString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function numberValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function positiveMoney(value: unknown) {
  const parsed = numberValue(value);
  return parsed && parsed > 0 ? parsed : null;
}

function readRecord(value: unknown) {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function optionPrice(option: (typeof PRIVATE_RIDE_OPTIONS)[number]) {
  return positiveMoney(option.priceLabel.replace(/[^0-9.]/g, ""));
}

function resolvePrivateOrderTotalDue(order: Awaited<ReturnType<typeof getInternalOrderById>>, bodyTotal: number | null) {
  if (bodyTotal) return bodyTotal;

  const payment = readRecord(order?.payment);
  const booking = readRecord(order?.booking);
  const payload = readRecord(order?.rezdyBookingPayload);

  const storedTotal =
    positiveMoney(payment?.totalDue) ||
    positiveMoney(payment?.amount) ||
    positiveMoney(booking?.totalDue) ||
    positiveMoney(payload?.totalDue);
  if (storedTotal) return storedTotal;

  const productCode = typeof order?.productCode === "string" ? order.productCode : "";
  const productSlug =
    (typeof booking?.productSlug === "string" ? booking.productSlug : "") ||
    (typeof payload?.option === "string" ? payload.option : "");
  const option = PRIVATE_RIDE_OPTIONS.find((candidate) =>
    candidate.dccProduct === productCode || candidate.slug === productSlug
  );
  const price = option ? optionPrice(option) : null;
  if (!price) return null;

  const quantity =
    positiveMoney(booking?.quantity) ||
    positiveMoney(payload?.qty) ||
    1;

  return price * Math.max(1, Math.floor(quantity));
}

function moneyAmountDollars(value: unknown) {
  const parsed = numberValue(value);
  return parsed && parsed > 0 ? parsed / 100 : null;
}

async function getInternalOrderWithRetry(internalOrderId: string) {
  const delays = [0, 150, 350, 750, 1500, 2500];

  for (const delayMs of delays) {
    if (delayMs > 0) await sleep(delayMs);
    const order = await getInternalOrderById(internalOrderId);
    if (order) return order;
  }

  return null;
}

async function getSquareOrderTotalDue(squareOrderId: string) {
  const squareOrder = await squareClient().orders.get({ orderId: squareOrderId });
  const amount = squareOrder.order?.totalMoney?.amount;
  return moneyAmountDollars(amount);
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
  const bookingTokenFromBody = requiredString(body.bookingToken);
  const totalDueFromBody = typeof body.totalDue === "number" && Number.isFinite(body.totalDue) && body.totalDue > 0
    ? body.totalDue
    : null;

  if (!internalOrderId || !sourceId) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  const order = await getInternalOrderWithRetry(internalOrderId);
  const resolvedSquareOrderId =
    squareOrderId ||
    (typeof order?.payment?.squareOrderId === "string" ? order.payment.squareOrderId.trim() : "") ||
    (typeof order?.booking?.squareOrderId === "string" ? order.booking.squareOrderId.trim() : "");
  const totalDue =
    resolvePrivateOrderTotalDue(order, totalDueFromBody) ||
    (resolvedSquareOrderId ? await getSquareOrderTotalDue(resolvedSquareOrderId).catch(() => null) : null);
  const bookingToken = (typeof order?.bookingToken === "string" ? order.bookingToken.trim() : "") || bookingTokenFromBody;
  const dccHandoffId = requiredString(body.dccHandoffId)
    || (typeof order?.payment?.dccHandoffId === "string" ? order.payment.dccHandoffId.trim() : "");

  if (!totalDue) {
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
      orderId: resolvedSquareOrderId || undefined,
      referenceId: internalOrderId,
      note: dccHandoffId
        ? `PARR private ride ${internalOrderId} | dcc:${dccHandoffId}`
        : `PARR private ride ${internalOrderId}`,
    });

    const payment = response.payment;
    if (!payment || payment.status !== "COMPLETED") {
      return NextResponse.json({ error: "Square did not complete the payment" }, { status: 409 });
    }

    let updatedOrder = null;
    const updatePayload = {
      bookingStatus: "confirmed",
      paymentStatus: "paid",
      bookingPatch: {
        status: "confirmed",
        orderNumber: resolvedSquareOrderId || internalOrderId,
      },
      paymentPatch: {
        status: "paid",
        totalPaid: totalDue,
        dccHandoffId: dccHandoffId || null,
        handoffMode: "embedded_square",
        handoffUrl: null,
        operatorAction: "Private ride checkout completed on Party at Red Rocks.",
        squareOrderId: resolvedSquareOrderId || null,
        squarePaymentId: typeof payment.id === "string" ? payment.id : null,
        receiptUrl: typeof payment.receiptUrl === "string" ? payment.receiptUrl : null,
      },
      eventType: "internal.order.private_payment_completed",
      payload: {
        internalOrderId,
        squareOrderId: resolvedSquareOrderId || null,
        squarePaymentId: typeof payment.id === "string" ? payment.id : null,
        dccHandoffId: dccHandoffId || null,
      },
    } as const;

    for (const delayMs of [0, 150, 350, 750, 1500, 2500]) {
      if (delayMs > 0) await sleep(delayMs);
      updatedOrder = await updateInternalOrderPaymentById(internalOrderId, updatePayload);
      if (updatedOrder) break;
    }

    if (!updatedOrder) {
      updatedOrder = await getInternalOrderWithRetry(internalOrderId);
    }
    await sendSharedBookingConfirmation(updatedOrder).catch(() => undefined);

    return NextResponse.json({
      ok: true,
      successUrl: `${siteOrigin()}/booking/${encodeURIComponent(bookingToken || internalOrderId)}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process payment";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
