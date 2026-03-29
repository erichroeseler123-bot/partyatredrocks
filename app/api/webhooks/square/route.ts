import { NextResponse } from "next/server";
import { WebhooksHelper } from "square";
import { getInternalOrderById } from "@/lib/orders";
import { sendSharedBookingConfirmation } from "@/lib/sharedConfirmation";
import { confirmSharedPayment, getSharedHoldBySquareOrderId } from "@/lib/sharedInventory";
import { squareClient, squareWebhookSignatureKey, squareWebhookUrl } from "@/lib/square";

export const runtime = "nodejs";

function paymentFromEvent(payload: any) {
  return payload?.data?.object?.payment ?? null;
}

async function isValidSquareSignature(body: string, signatureHeader: string, requestUrl: string) {
  const candidates = Array.from(new Set([requestUrl, squareWebhookUrl()]));
  for (const notificationUrl of candidates) {
    try {
      const verified = await WebhooksHelper.verifySignature({
        requestBody: body,
        signatureHeader,
        signatureKey: squareWebhookSignatureKey(),
        notificationUrl,
      });
      if (verified) return true;
    } catch {
      // Try the next candidate URL before failing.
    }
  }
  return false;
}

export async function POST(request: Request) {
  const body = await request.text();
  const signatureHeader = request.headers.get("x-square-hmacsha256-signature") || "";

  try {
    const verified = await isValidSquareSignature(body, signatureHeader, request.url);

    if (!verified) {
      return NextResponse.json({ error: "Invalid Square signature" }, { status: 401 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  let payload: any;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const type = typeof payload?.type === "string" ? payload.type : "";
  if (type !== "payment.updated" && type !== "payment.created") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const payment = paymentFromEvent(payload);
  if (!payment || payment.status !== "COMPLETED") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const squareOrderId = typeof payment.orderId === "string" ? payment.orderId : "";
  let internalOrderId = typeof payment.referenceId === "string" ? payment.referenceId.trim() : "";
  const hold = squareOrderId ? await getSharedHoldBySquareOrderId(squareOrderId) : null;

  if (!internalOrderId && hold?.internalOrderId) {
    internalOrderId = hold.internalOrderId;
  }

  if (!internalOrderId && squareOrderId) {
    try {
      const squareOrder = await squareClient().orders.get({ orderId: squareOrderId });
      internalOrderId = typeof squareOrder.order?.referenceId === "string"
        ? squareOrder.order.referenceId.trim()
        : "";
    } catch {
      internalOrderId = "";
    }
  }

  if (!internalOrderId) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const amount = payment.totalMoney?.amount;
  const totalPaidCents =
    typeof amount === "bigint" ? Number(amount) : typeof amount === "number" ? amount : null;

  const result = await confirmSharedPayment({
    internalOrderId,
    squareOrderId: squareOrderId || null,
    squarePaymentId: typeof payment.id === "string" ? payment.id : null,
    totalPaidCents,
    receiptUrl: typeof payment.receiptUrl === "string" ? payment.receiptUrl : null,
    payload,
  });

  if (!result.alreadyConfirmed) {
    const order = await getInternalOrderById(internalOrderId);
    await sendSharedBookingConfirmation(order).catch(() => undefined);
  }

  return NextResponse.json({ ok: true });
}
