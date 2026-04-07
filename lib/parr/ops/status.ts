import type { InternalOrderRow } from "@/lib/orders";
import type { OpsPaymentState, OpsWorkflowState } from "@/lib/parr/ops/types";

export function getOrderPaymentState(order: InternalOrderRow): OpsPaymentState {
  const status =
    order.payment && typeof order.payment.status === "string" ? order.payment.status.trim().toLowerCase() : "";
  const totalDue =
    order.payment && typeof order.payment.totalDue === "number" && Number.isFinite(order.payment.totalDue)
      ? order.payment.totalDue
      : 0;
  const totalPaid =
    order.payment && typeof order.payment.totalPaid === "number" && Number.isFinite(order.payment.totalPaid)
      ? order.payment.totalPaid
      : 0;

  if (status === "manual_review") return "manual_review";
  if (status === "paid" || status === "paid_in_full") return "paid";
  if (status === "partial") return "partial";
  if (status === "unpaid") return "unpaid";
  if (totalDue > 0 && totalPaid >= totalDue) return "paid";
  if (totalPaid > 0) return "partial";
  return "unknown";
}

export function getOrderWorkflowState(order: InternalOrderRow): OpsWorkflowState {
  const paymentState = getOrderPaymentState(order);
  const followUp = order.followUpStatus ?? "new";
  const bookingStatus =
    order.booking && typeof order.booking.status === "string" ? order.booking.status.trim().toLowerCase() : "";

  if (paymentState === "manual_review") return "needs_review";
  if (followUp === "resolved") return "resolved";
  if (followUp === "waiting" || order.operatorPaymentStep === "request_sent") return "waiting";
  if (paymentState === "paid" || bookingStatus === "confirmed") return "confirmed";
  if (paymentState === "partial" || paymentState === "unpaid") return "pending_payment";
  return "new";
}
