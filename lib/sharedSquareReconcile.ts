import "server-only";

import { confirmSharedPayment } from "@/lib/sharedInventory";
import { getInternalOrderById } from "@/lib/orders";
import { sendSharedBookingConfirmation } from "@/lib/sharedConfirmation";
import { squareClient } from "@/lib/square";

function toPaidCents(amount: unknown) {
  return typeof amount === "bigint" ? Number(amount) : typeof amount === "number" ? amount : null;
}

async function completedPaymentByPaymentId(paymentId: string) {
  const resolvedPaymentId = paymentId.trim();
  if (!resolvedPaymentId) return null;

  const payment = (await squareClient().payments.get({ paymentId: resolvedPaymentId })).payment;
  if (!payment || payment.status !== "COMPLETED") return null;
  return payment;
}

async function completedPaymentByOrderId(squareOrderId: string) {
  const resolvedOrderId = squareOrderId.trim();
  if (!resolvedOrderId) return null;

  const order = (await squareClient().orders.get({ orderId: resolvedOrderId })).order;
  const tender = order?.tenders?.find((item) => typeof item.paymentId === "string" && item.paymentId.trim())
    ?? order?.tenders?.find((item) => typeof item.id === "string" && item.id.trim());
  const paymentId = typeof tender?.paymentId === "string" && tender.paymentId.trim()
    ? tender.paymentId.trim()
    : typeof tender?.id === "string" && tender.id.trim()
      ? tender.id.trim()
      : "";

  if (!paymentId) return null;
  return completedPaymentByPaymentId(paymentId);
}

export async function reconcileSharedOrderFromSquare(input: {
  internalOrderId: string;
  transactionId?: string | null;
  orderId?: string | null;
  paymentLinkId?: string | null;
}) {
  const internalOrderId = input.internalOrderId.trim();
  if (!internalOrderId) return { ok: false as const, reason: "missing_internal_order_id" as const };

  const directPaymentId = input.transactionId?.trim() || "";
  const directOrderId = input.orderId?.trim() || "";

  let payment = directPaymentId
    ? await completedPaymentByPaymentId(directPaymentId).catch(() => null)
    : null;

  if (!payment && directOrderId) {
    payment = await completedPaymentByOrderId(directOrderId).catch(() => null);
  }

  const order = payment ? null : await getInternalOrderById(internalOrderId);
  const storedSquareOrderId =
    !payment && order?.payment && typeof order.payment.squareOrderId === "string"
      ? order.payment.squareOrderId.trim()
      : "";
  const storedPaymentLinkId = input.paymentLinkId?.trim()
    || (!payment && order?.payment && typeof order.payment.paymentLinkId === "string"
      ? order.payment.paymentLinkId.trim()
      : "");

  if (!payment && storedSquareOrderId) {
    payment = await completedPaymentByOrderId(storedSquareOrderId).catch(() => null);
  }

  if (!payment && storedPaymentLinkId) {
    try {
      const paymentLink = (await squareClient().checkout.paymentLinks.get({ id: storedPaymentLinkId })).paymentLink;
      const linkedOrderId = typeof paymentLink?.orderId === "string" ? paymentLink.orderId.trim() : "";
      if (linkedOrderId) {
        payment = await completedPaymentByOrderId(linkedOrderId).catch(() => null);
      }
    } catch {
      payment = null;
    }
  }

  if (!payment) {
    return { ok: false as const, reason: "payment_not_found" as const };
  }

  const result = await confirmSharedPayment({
    internalOrderId,
    squareOrderId: typeof payment.orderId === "string" ? payment.orderId : directOrderId || storedSquareOrderId || null,
    squarePaymentId: typeof payment.id === "string" ? payment.id : directPaymentId || null,
    totalPaidCents: toPaidCents(payment.totalMoney?.amount),
    receiptUrl: typeof payment.receiptUrl === "string" ? payment.receiptUrl : null,
    payload: {
      source: "shared_square_reconcile",
      transactionId: directPaymentId || null,
      orderId: directOrderId || storedSquareOrderId || null,
      paymentLinkId: storedPaymentLinkId || null,
      paymentId: typeof payment.id === "string" ? payment.id : null,
    },
  });

  if (!result.alreadyConfirmed) {
    const updatedOrder = await getInternalOrderById(internalOrderId);
    await sendSharedBookingConfirmation(updatedOrder).catch(() => undefined);
  }

  return { ok: true as const, result };
}
