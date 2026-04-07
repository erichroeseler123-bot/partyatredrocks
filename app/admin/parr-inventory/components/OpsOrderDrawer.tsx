"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { OpsOrder } from "@/lib/parr/ops/types";

function formatDateTime(value: string | null) {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString("en-US");
}

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
}

async function patchOrder(orderId: string, body: Record<string, unknown>) {
  const response = await fetch(`/api/internal/orders/${encodeURIComponent(orderId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as { error?: string };
  if (!response.ok) {
    throw new Error(data.error || "Update failed");
  }
}

export default function OpsOrderDrawer({
  order,
  productOptions,
}: {
  order: OpsOrder;
  productOptions: Array<{ value: string; label: string }>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [statusText, setStatusText] = useState("");
  const [notes, setNotes] = useState(order.note || "");
  const [followUpStatus, setFollowUpStatus] = useState(order.followUpStatus);
  const [paymentAction, setPaymentAction] = useState("mark_manual_review");
  const [paymentAmount, setPaymentAmount] = useState(order.totalPaid ? order.totalPaid.toFixed(2) : "");
  const [paymentReason, setPaymentReason] = useState("");
  const [productCode, setProductCode] = useState(order.productCode || "");
  const [sessionKey, setSessionKey] = useState(order.sessionKey || "");
  const [pickup, setPickup] = useState(order.pickupLabel || "");
  const [moveReason, setMoveReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function saveOps(markPaymentRequestSent = false) {
    setStatusText("");
    try {
      await patchOrder(order.orderId, {
        notes,
        followUpStatus,
        markPaymentRequestSent,
      });
      setStatusText("Saved");
      refresh();
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "Save failed");
    }
  }

  async function savePayment() {
    setStatusText("");
    try {
      await patchOrder(order.orderId, {
        action: "update_payment",
        paymentAction,
        amountPaidDollars: paymentAmount ? Number(paymentAmount) : undefined,
        reason: paymentReason,
      });
      setStatusText("Payment updated");
      setPaymentReason("");
      refresh();
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "Payment update failed");
    }
  }

  async function saveReassignment() {
    setStatusText("");
    try {
      await patchOrder(order.orderId, {
        action: "reassign",
        productCode,
        sessionKey,
        pickup,
        reason: moveReason,
      });
      setStatusText("Departure updated");
      setMoveReason("");
      refresh();
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "Reassignment failed");
    }
  }

  async function cancelBooking() {
    setStatusText("");
    try {
      await patchOrder(order.orderId, {
        action: "cancel",
        reason: cancelReason,
      });
      setStatusText("Booking canceled");
      setCancelReason("");
      refresh();
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "Cancel failed");
    }
  }

  return (
    <aside className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="text-xs uppercase tracking-[0.16em] text-orange-300">Selected order</div>
      <div className="mt-2 text-2xl font-black text-white">{order.customerName}</div>
      <div className="mt-1 text-sm text-white/60">{order.orderId}</div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div><div className="text-xs text-white/45">Email</div><div className="text-sm text-white">{order.customerEmail}</div></div>
        <div><div className="text-xs text-white/45">Phone</div><div className="text-sm text-white">{order.customerPhone || "—"}</div></div>
        <div><div className="text-xs text-white/45">Service date</div><div className="text-sm text-white">{order.serviceDate || "Unscheduled"}</div></div>
        <div><div className="text-xs text-white/45">Departure</div><div className="text-sm text-white">{order.departureLabel}</div></div>
        <div><div className="text-xs text-white/45">Pickup</div><div className="text-sm text-white">{order.pickupLabel}</div></div>
        <div><div className="text-xs text-white/45">Seats</div><div className="text-sm text-white">{order.seats}</div></div>
        <div><div className="text-xs text-white/45">Payment</div><div className="text-sm text-white">{order.paymentState}</div></div>
        <div><div className="text-xs text-white/45">Workflow</div><div className="text-sm text-white">{order.workflowState}</div></div>
        <div><div className="text-xs text-white/45">Created</div><div className="text-sm text-white">{formatDateTime(order.createdAt)}</div></div>
        <div><div className="text-xs text-white/45">Last touched</div><div className="text-sm text-white">{formatDateTime(order.lastTouchedAt)}</div></div>
        <div><div className="text-xs text-white/45">Booking ref</div><div className="text-sm text-white">{order.bookingReference || "—"}</div></div>
        <div><div className="text-xs text-white/45">Session key</div><div className="text-sm text-white">{order.sessionKey || "—"}</div></div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="text-xs uppercase tracking-[0.16em] text-white/45">Ops note</div>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={4}
          className="mt-2 w-full rounded-2xl border border-white/15 bg-black/40 px-3 py-3 text-sm text-white"
        />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <select
            value={followUpStatus}
            onChange={(event) => setFollowUpStatus(event.target.value)}
            className="min-h-11 rounded-xl border border-white/15 bg-black/40 px-3 text-white"
          >
            <option value="new">new</option>
            <option value="contacted">contacted</option>
            <option value="waiting">waiting</option>
            <option value="resolved">resolved</option>
          </select>
          <button
            type="button"
            onClick={() => saveOps(false)}
            disabled={isPending}
            className="min-h-11 rounded-xl bg-white px-4 text-sm font-semibold text-black"
          >
            Save note
          </button>
        </div>
        {order.operatorPaymentStep !== "paid" ? (
          <button
            type="button"
            onClick={() => saveOps(true)}
            disabled={isPending}
            className="mt-3 min-h-11 rounded-xl border border-cyan-400/30 bg-cyan-500/15 px-4 text-sm font-semibold text-cyan-100"
          >
            Mark payment request sent
          </button>
        ) : null}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="text-xs uppercase tracking-[0.16em] text-white/45">Payment workflow</div>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white">
            Due: {formatMoney(order.totalDue)}
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white">
            Paid: {formatMoney(order.totalPaid)}
          </div>
        </div>
        <select
          value={paymentAction}
          onChange={(event) => setPaymentAction(event.target.value)}
          className="mt-3 min-h-11 w-full rounded-xl border border-white/15 bg-black/40 px-3 text-white"
        >
          <option value="mark_unpaid">Mark unpaid</option>
          <option value="mark_partial">Mark partial</option>
          <option value="mark_paid">Mark paid</option>
          <option value="mark_manual_review">Send to manual review</option>
        </select>
        <input
          value={paymentAmount}
          onChange={(event) => setPaymentAmount(event.target.value)}
          type="number"
          min="0"
          step="0.01"
          placeholder="Paid amount"
          className="mt-3 min-h-11 w-full rounded-xl border border-white/15 bg-black/40 px-3 text-white"
        />
        <textarea
          value={paymentReason}
          onChange={(event) => setPaymentReason(event.target.value)}
          rows={3}
          placeholder="Reason for payment change"
          className="mt-3 w-full rounded-2xl border border-white/15 bg-black/40 px-3 py-3 text-sm text-white"
        />
        <button
          type="button"
          onClick={savePayment}
          disabled={isPending}
          className="mt-3 min-h-11 rounded-xl bg-white px-4 text-sm font-semibold text-black"
        >
          Save payment state
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="text-xs uppercase tracking-[0.16em] text-white/45">Booking actions</div>
        <div className="mt-2 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-100">
          Cancel keeps the booking record and payment history. It does not delete the sale.
        </div>
        <textarea
          value={cancelReason}
          onChange={(event) => setCancelReason(event.target.value)}
          rows={3}
          placeholder="Reason for cancelation"
          className="mt-3 w-full rounded-2xl border border-white/15 bg-black/40 px-3 py-3 text-sm text-white"
        />
        <button
          type="button"
          onClick={cancelBooking}
          disabled={isPending}
          className="mt-3 min-h-11 rounded-xl border border-red-400/30 bg-red-500/15 px-4 text-sm font-semibold text-red-100"
        >
          Cancel booking
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="text-xs uppercase tracking-[0.16em] text-white/45">Reassign departure</div>
        <select
          value={productCode}
          onChange={(event) => setProductCode(event.target.value)}
          className="mt-2 min-h-11 w-full rounded-xl border border-white/15 bg-black/40 px-3 text-white"
        >
          {productOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          value={sessionKey}
          onChange={(event) => setSessionKey(event.target.value)}
          placeholder="2026-04-18:golden"
          className="mt-3 min-h-11 w-full rounded-xl border border-white/15 bg-black/40 px-3 text-white"
        />
        <input
          value={pickup}
          onChange={(event) => setPickup(event.target.value)}
          placeholder="Pickup label"
          className="mt-3 min-h-11 w-full rounded-xl border border-white/15 bg-black/40 px-3 text-white"
        />
        <textarea
          value={moveReason}
          onChange={(event) => setMoveReason(event.target.value)}
          rows={3}
          placeholder="Reason for reassignment"
          className="mt-3 w-full rounded-2xl border border-white/15 bg-black/40 px-3 py-3 text-sm text-white"
        />
        <button
          type="button"
          onClick={saveReassignment}
          disabled={isPending}
          className="mt-3 min-h-11 rounded-xl bg-white px-4 text-sm font-semibold text-black"
        >
          Save reassignment
        </button>
      </div>

      {statusText ? <div className="mt-4 text-sm text-white/70">{statusText}</div> : null}
    </aside>
  );
}
