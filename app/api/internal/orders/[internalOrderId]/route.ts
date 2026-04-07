import { NextResponse } from "next/server";
import {
  cancelInternalOrderById,
  getInternalOrderById,
  updateInternalOrderOps,
  updateInternalOrderPaymentState,
  updateInternalOrderScheduleById,
  type InternalOrderPaymentAction,
} from "@/lib/orders";
import { getSharedCheckoutStatus } from "@/lib/sharedInventory";
import { reconcileSharedOrderFromSquare } from "@/lib/sharedSquareReconcile";

export const runtime = "nodejs";

type OpsUpdateBody = {
  action?: "update_ops" | "update_payment" | "reassign" | "cancel";
  notes?: string;
  followUpStatus?: "new" | "contacted" | "waiting" | "resolved";
  markPaymentRequestSent?: boolean;
  paymentAction?: InternalOrderPaymentAction;
  amountPaidDollars?: number;
  reason?: string;
  productCode?: string;
  sessionKey?: string | null;
  pickup?: string | null;
};

const VALID_PAYMENT_ACTIONS = new Set<InternalOrderPaymentAction>([
  "mark_unpaid",
  "mark_partial",
  "mark_paid",
  "mark_manual_review",
]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ internalOrderId: string }> }
) {
  const { internalOrderId } = await params;
  if (!internalOrderId) {
    return NextResponse.json({ error: "Missing internalOrderId" }, { status: 400 });
  }

  const status = await getSharedCheckoutStatus(internalOrderId);
  if (!status.order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const provider = status.order.payment && typeof status.order.payment.provider === "string"
    ? status.order.payment.provider
    : "";
  const paymentStatus = status.order.payment && typeof status.order.payment.status === "string"
    ? status.order.payment.status
    : "";
  if (provider === "square" && paymentStatus !== "paid") {
    await reconcileSharedOrderFromSquare({ internalOrderId }).catch(() => undefined);
  }

  const refreshed = await getSharedCheckoutStatus(internalOrderId);
  if (!refreshed.order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, order: refreshed.order, hold: refreshed.hold });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ internalOrderId: string }> }
) {
  const { internalOrderId } = await params;
  if (!internalOrderId) {
    return NextResponse.json({ error: "Missing internalOrderId" }, { status: 400 });
  }

  let body: OpsUpdateBody;
  try {
    body = (await request.json()) as OpsUpdateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.notes !== "undefined" && typeof body.notes !== "string") {
    return NextResponse.json({ error: "notes must be a string" }, { status: 400 });
  }
  if (typeof body.reason !== "undefined" && typeof body.reason !== "string") {
    return NextResponse.json({ error: "reason must be a string" }, { status: 400 });
  }
  if (
    typeof body.followUpStatus !== "undefined" &&
    body.followUpStatus !== "new" &&
    body.followUpStatus !== "contacted" &&
    body.followUpStatus !== "waiting" &&
    body.followUpStatus !== "resolved"
  ) {
    return NextResponse.json({ error: "Invalid followUpStatus" }, { status: 400 });
  }
  if (
    typeof body.markPaymentRequestSent !== "undefined" &&
    typeof body.markPaymentRequestSent !== "boolean"
  ) {
    return NextResponse.json({ error: "markPaymentRequestSent must be boolean" }, { status: 400 });
  }
  if (typeof body.amountPaidDollars !== "undefined" && typeof body.amountPaidDollars !== "number") {
    return NextResponse.json({ error: "amountPaidDollars must be a number" }, { status: 400 });
  }

  const existing = await getInternalOrderById(internalOrderId);
  if (!existing) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (body.action === "update_payment") {
    if (!body.paymentAction || !VALID_PAYMENT_ACTIONS.has(body.paymentAction)) {
      return NextResponse.json({ error: "Invalid paymentAction" }, { status: 400 });
    }
    try {
      const updated = await updateInternalOrderPaymentState(internalOrderId, {
        action: body.paymentAction,
        amountPaidDollars: body.amountPaidDollars,
        reason: body.reason,
      });
      if (!updated) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      return NextResponse.json({ ok: true, order: updated });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Payment update failed" },
        { status: 400 }
      );
    }
  }

  if (body.action === "reassign") {
    const updated = await updateInternalOrderScheduleById(internalOrderId, {
      productCode: body.productCode,
      sessionKey: body.sessionKey,
      pickup: body.pickup ? { label: body.pickup } : null,
      reason: body.reason,
    });
    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, order: updated });
  }

  if (body.action === "cancel") {
    const updated = await cancelInternalOrderById(internalOrderId, {
      reason: body.reason,
    });
    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, order: updated });
  }

  const updated = await updateInternalOrderOps(internalOrderId, {
    notes: body.notes,
    followUpStatus: body.followUpStatus,
    markPaymentRequestSent: body.markPaymentRequestSent,
  });
  if (!updated.ok) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
