import type { Metadata } from "next";
import { getSharedCheckoutStatus } from "@/lib/sharedInventory";
import { reconcileSharedOrderFromSquare } from "@/lib/sharedSquareReconcile";
import SharedCheckoutStatus from "./SharedCheckoutStatus";

export const metadata: Metadata = {
  title: "Shared Checkout Status",
  robots: { index: false, follow: false },
};

export default async function SharedCheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const raw = sp.internalOrderId;
  const rawReferenceId = sp.referenceId;
  const rawTransactionId = sp.transactionId;
  const rawOrderId = sp.orderId;
  const internalOrderId = Array.isArray(raw) ? raw[0] : raw;
  const referenceId = Array.isArray(rawReferenceId) ? rawReferenceId[0] : rawReferenceId;
  const transactionId = Array.isArray(rawTransactionId) ? rawTransactionId[0] : rawTransactionId;
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;
  const resolvedInternalOrderId = typeof internalOrderId === "string" && internalOrderId
    ? internalOrderId
    : typeof referenceId === "string"
      ? referenceId
      : "";

  let seededStatus = resolvedInternalOrderId
    ? await getSharedCheckoutStatus(resolvedInternalOrderId)
    : null;

  const paymentStatus = typeof seededStatus?.order?.payment?.status === "string"
    ? seededStatus.order.payment.status
    : "";
  const bookingStatus = typeof seededStatus?.order?.booking?.status === "string"
    ? seededStatus.order.booking.status
    : "";

  if (
    resolvedInternalOrderId
    && !(paymentStatus === "paid" && bookingStatus === "confirmed")
    && (
      typeof transactionId === "string"
      || typeof orderId === "string"
      || typeof referenceId === "string"
    )
  ) {
    await reconcileSharedOrderFromSquare({
      internalOrderId: resolvedInternalOrderId,
      transactionId: typeof transactionId === "string" ? transactionId : null,
      orderId: typeof orderId === "string" ? orderId : null,
    }).catch(() => undefined);
    seededStatus = await getSharedCheckoutStatus(resolvedInternalOrderId);
  }

  return <SharedCheckoutStatus internalOrderId={resolvedInternalOrderId} initialStatus={seededStatus} />;
}
