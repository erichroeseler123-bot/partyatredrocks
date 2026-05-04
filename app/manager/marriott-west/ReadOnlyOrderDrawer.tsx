import type { OpsOrder } from "@/lib/parr/ops/types";

function formatDateTime(value: string | null) {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString("en-US");
}

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
}

function quantityLabel(order: OpsOrder) {
  if ((order.productCode || "").startsWith("shared-")) {
    return `${order.seats} seat${order.seats === 1 ? "" : "s"}`;
  }
  return `${order.seats} vehicle${order.seats === 1 ? "" : "s"}`;
}

export default function ReadOnlyOrderDrawer({ order }: { order: OpsOrder }) {
  return (
    <aside className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="text-xs uppercase tracking-[0.16em] text-orange-300">Selected booking</div>
      <div className="mt-2 text-2xl font-black text-white">{order.customerName}</div>
      <div className="mt-1 text-sm text-white/60">{order.orderId}</div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div><div className="text-xs text-white/45">Email</div><div className="text-sm text-white">{order.customerEmail}</div></div>
        <div><div className="text-xs text-white/45">Phone</div><div className="text-sm text-white">{order.customerPhone || "—"}</div></div>
        <div><div className="text-xs text-white/45">Service date</div><div className="text-sm text-white">{order.serviceDate || "Unscheduled"}</div></div>
        <div><div className="text-xs text-white/45">Departure</div><div className="text-sm text-white">{order.departureLabel}</div></div>
        <div><div className="text-xs text-white/45">Pickup</div><div className="text-sm text-white">{order.pickupLabel}</div></div>
        <div><div className="text-xs text-white/45">Qty</div><div className="text-sm text-white">{quantityLabel(order)}</div></div>
        <div><div className="text-xs text-white/45">Product</div><div className="text-sm text-white">{order.productLabel}</div></div>
        <div><div className="text-xs text-white/45">Inventory</div><div className="text-sm text-white">{order.inventoryLabel || order.productLabel}</div></div>
        <div><div className="text-xs text-white/45">Payment</div><div className="text-sm text-white">{order.paymentState}</div></div>
        <div><div className="text-xs text-white/45">Workflow</div><div className="text-sm text-white">{order.workflowState}</div></div>
        <div><div className="text-xs text-white/45">Total due</div><div className="text-sm text-white">{formatMoney(order.totalDue)}</div></div>
        <div><div className="text-xs text-white/45">Total paid</div><div className="text-sm text-white">{formatMoney(order.totalPaid)}</div></div>
        <div><div className="text-xs text-white/45">Booking ref</div><div className="text-sm text-white">{order.bookingReference || "—"}</div></div>
        <div><div className="text-xs text-white/45">Session key</div><div className="text-sm text-white">{order.sessionKey || "—"}</div></div>
        <div><div className="text-xs text-white/45">Created</div><div className="text-sm text-white">{formatDateTime(order.createdAt)}</div></div>
        <div><div className="text-xs text-white/45">Last touched</div><div className="text-sm text-white">{formatDateTime(order.lastTouchedAt)}</div></div>
      </div>

      {order.primaryReassignmentWarning ? (
        <div className="mt-6 rounded-2xl border border-orange-400/30 bg-orange-500/10 px-4 py-3 text-sm text-orange-100">
          {order.primaryReassignmentWarning}
        </div>
      ) : null}

      {order.note ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-xs uppercase tracking-[0.16em] text-white/45">Internal note</div>
          <div className="mt-2 whitespace-pre-wrap text-sm text-white/80">{order.note}</div>
        </div>
      ) : null}

      <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
        This manager surface is read-only. Inventory changes, cancellations, refunds, and reassignment stay on the protected internal ops board.
      </div>
    </aside>
  );
}
