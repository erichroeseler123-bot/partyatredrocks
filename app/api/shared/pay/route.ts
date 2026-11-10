import { NextResponse } from "next/server";
import { buildSquarePaymentIdempotencyKey } from "@/lib/blobVault";
import { getInternalOrderById } from "@/lib/orders";
import { sendSharedBookingConfirmation, VERIFIED_SUPPORT_CONTACT } from "@/lib/sharedConfirmation";
import { confirmSharedPayment, getSharedCheckoutStatus } from "@/lib/sharedInventory";
import { siteOrigin, squareClient, squareLocationId } from "@/lib/square";

export const runtime = "nodejs";

type Body = {
  internalOrderId?: string;
  checkoutSessionId?: string;
  bookingToken?: string;
  paymentOption?: string;
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

  const internalOrderId = requiredString(body.internalOrderId) || requiredString(body.checkoutSessionId);
  const sourceId = requiredString(body.sourceId);
  const squareOrderId = requiredString(body.squareOrderId);

  if (!internalOrderId || !sourceId) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  const order = await getInternalOrderWithRetry(internalOrderId);
  const { hold } = await getSharedCheckoutStatus(internalOrderId);
  if (!order) {
    if (hold?.status === "pending") {
      return NextResponse.json({ error: "Checkout hold is still syncing. Try the payment again in a few seconds." }, { status: 409 });
    }
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const bookingToken =
    (typeof order.bookingToken === "string" ? order.bookingToken.trim() : "") ||
    requiredString(body.bookingToken);
  const resolvedSquareOrderId =
    squareOrderId ||
    (typeof order.payment?.squareOrderId === "string" ? order.payment.squareOrderId.trim() : "") ||
    (hold?.squareOrderId ?? "");
  const existingPaymentStatus = typeof order.payment?.status === "string"
    ? order.payment.status.trim().toLowerCase()
    : "";
  const requestedPaymentOption = requiredString(body.paymentOption).toLowerCase()
    || (typeof order.payment?.paymentOption === "string" ? order.payment.paymentOption.trim().toLowerCase() : "");
  const existingTotalPaid = typeof order.payment?.totalPaid === "number" && Number.isFinite(order.payment.totalPaid)
    ? order.payment.totalPaid
    : 0;
  const depositAlreadyCaptured =
    existingPaymentStatus === "deposit_paid" ||
    (requestedPaymentOption === "deposit" &&
      (existingPaymentStatus === "partial" || existingTotalPaid > 0));

  if (existingPaymentStatus === "paid" || depositAlreadyCaptured || hold?.status === "confirmed") {
    const existingPaymentId = typeof order.payment?.squarePaymentId === "string"
      ? order.payment.squarePaymentId
      : (hold?.squarePaymentId ?? "");
    const alreadyPaidUrl = `${siteOrigin()}/book/red-rocks-amphitheatre/shared/success?internalOrderId=${encodeURIComponent(internalOrderId)}&orderId=${encodeURIComponent(resolvedSquareOrderId)}&transactionId=${encodeURIComponent(existingPaymentId)}`;
    return NextResponse.json({
      ok: true,
      alreadyPaid: true,
      internalOrderId,
      bookingToken: bookingToken || null,
      successUrl: alreadyPaidUrl,
      redirectUrl: alreadyPaidUrl,
      confirmationEmailSent: Boolean(order.payment?.confirmationEmailSent),
      supportEmail: VERIFIED_SUPPORT_CONTACT.email,
      supportPhone: VERIFIED_SUPPORT_CONTACT.phone,
      support: VERIFIED_SUPPORT_CONTACT,
    });
  }

  const totalDue = typeof order.payment?.totalDue === "number" && Number.isFinite(order.payment.totalDue)
    ? order.payment.totalDue
    : null;
  const dccHandoffId = requiredString(body.dccHandoffId)
    || (typeof order.payment?.dccHandoffId === "string" ? order.payment.dccHandoffId.trim() : "");

  if (!totalDue || !resolvedSquareOrderId) {
    return NextResponse.json({
      error: "Checkout is missing Square order details",
      supportEmail: VERIFIED_SUPPORT_CONTACT.email,
      supportPhone: VERIFIED_SUPPORT_CONTACT.phone,
      support: VERIFIED_SUPPORT_CONTACT,
    }, { status: 409 });
  }

  const amountCents = Math.round(totalDue * 100);
  const idempotencyKey = buildSquarePaymentIdempotencyKey(
    "shared",
    internalOrderId,
    sourceId,
    amountCents,
  );

  try {
    const response = await squareClient().payments.create({
      sourceId,
      idempotencyKey,
      amountMoney: {
        amount: BigInt(amountCents),
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
      return NextResponse.json({
        error: "Square did not complete the payment",
        supportEmail: VERIFIED_SUPPORT_CONTACT.email,
        supportPhone: VERIFIED_SUPPORT_CONTACT.phone,
        support: VERIFIED_SUPPORT_CONTACT,
      }, { status: 409 });
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

    let confirmationEmailSent = Boolean(order.payment?.confirmationEmailSent);
    if (!result.alreadyConfirmed) {
      const updatedOrder = await getInternalOrderById(internalOrderId);
      const emailResult = await sendSharedBookingConfirmation(updatedOrder).catch(() => ({ sent: false as const }));
      confirmationEmailSent = Boolean(emailResult?.sent);
    }

    const successUrl = `${siteOrigin()}/book/red-rocks-amphitheatre/shared/success?internalOrderId=${encodeURIComponent(internalOrderId)}&orderId=${encodeURIComponent(resolvedSquareOrderId)}&transactionId=${encodeURIComponent(typeof payment.id === "string" ? payment.id : "")}`;

    return NextResponse.json({
      ok: true,
      ...(result.alreadyConfirmed ? { alreadyPaid: true } : {}),
      internalOrderId,
      bookingToken: bookingToken || null,
      successUrl,
      redirectUrl: successUrl,
      confirmationEmailSent,
      supportEmail: VERIFIED_SUPPORT_CONTACT.email,
      supportPhone: VERIFIED_SUPPORT_CONTACT.phone,
      support: VERIFIED_SUPPORT_CONTACT,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process payment";
    return NextResponse.json({
      error: message,
      supportEmail: VERIFIED_SUPPORT_CONTACT.email,
      supportPhone: VERIFIED_SUPPORT_CONTACT.phone,
      support: VERIFIED_SUPPORT_CONTACT,
    }, { status: 409 });
  }
}
