import Link from "next/link";
import { SHARED_DAILY_CAPACITY } from "@/lib/parr/fleet";
import type { OpsDayGroup, OpsOrder } from "@/lib/parr/ops/types";

function paymentTone(state: string) {
  if (state === "paid") return "border-emerald-400/30 bg-emerald-500/15 text-emerald-100";
  if (state === "partial") return "border-amber-400/30 bg-amber-500/15 text-amber-100";
  if (state === "manual_review") return "border-red-400/30 bg-red-500/15 text-red-100";
  return "border-white/15 bg-white/5 text-white/75";
}

function workflowTone(state: string) {
  if (state === "canceled") return "border-red-400/30 bg-red-500/15 text-red-100";
  if (state === "needs_review") return "border-orange-400/30 bg-orange-500/15 text-orange-100";
  return "border-white/15 bg-white/5 text-white/70";
}

type LaneKey = "private" | "denver" | "golden" | "needs_review";

function isSharedOrder(order: OpsOrder) {
  return (order.productCode || "").startsWith("shared-");
}

function orderQuantityLabel(order: OpsOrder) {
  if (isSharedOrder(order)) {
    return `${order.seats} seat${order.seats === 1 ? "" : "s"}`;
  }
  return `${order.seats} vehicle${order.seats === 1 ? "" : "s"}`;
}

function getLane(order: OpsOrder): LaneKey {
  if (order.workflowState === "needs_review" || !order.productCode) return "needs_review";
  if (order.productCode === "shared-denver") return "denver";
  if (order.productCode === "shared-golden") return "golden";
  return "private";
}

function laneTitle(lane: LaneKey) {
  if (lane === "private") return "Private Car";
  if (lane === "denver") return "Denver";
  if (lane === "golden") return "Golden";
  return "Needs Review";
}

function laneDescription(lane: LaneKey) {
  if (lane === "private") return "Private rides and custom pickups.";
  if (lane === "denver") return "Denver shared shuttle capacity is fixed at 20 seats per day.";
  if (lane === "golden") return "Golden shared shuttle capacity is fixed at 20 seats per day.";
  return "Orders missing a clean lane or needing manual review.";
}

function laneTone(lane: LaneKey) {
  if (lane === "private") return "border-fuchsia-400/30 bg-fuchsia-500/10";
  if (lane === "denver") return "border-cyan-400/30 bg-cyan-500/10";
  if (lane === "golden") return "border-amber-400/30 bg-amber-500/10";
  return "border-red-400/30 bg-red-500/10";
}

function summarizeLane(lane: LaneKey, orders: OpsOrder[]) {
  const seats = orders.reduce((sum, order) => sum + order.seats, 0);
  const capacity = lane === "denver" ? SHARED_DAILY_CAPACITY.denver : lane === "golden" ? SHARED_DAILY_CAPACITY.golden : null;
  return {
    ordersCount: orders.length,
    seats,
    unpaid: orders.filter((order) => order.paymentState !== "paid").length,
    capacity,
    remaining: capacity === null ? null : Math.max(0, capacity - seats),
  };
}

export default function OpsCalendarBoard({
  dayGroups,
  buildOrderHref,
}: {
  dayGroups: OpsDayGroup[];
  buildOrderHref: (orderId: string) => string;
}) {
  const laneOrder: LaneKey[] = ["private", "denver", "golden", "needs_review"];

  return (
    <div className="space-y-6">
      {dayGroups.map((day) => (
        <section key={day.key} className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.16em] text-orange-300">Service day</div>
              <h2 className="mt-2 text-2xl font-black text-white">{day.serviceDate || "Unscheduled"}</h2>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/80">{day.ordersCount} bookings</span>
              <span className="rounded-full border border-cyan-400/30 bg-cyan-500/15 px-3 py-1 text-cyan-100">{day.seats} units</span>
              <span className="rounded-full border border-red-400/30 bg-red-500/15 px-3 py-1 text-red-100">{day.warnings} warnings</span>
            </div>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-4">
            {laneOrder.map((lane) => {
              const laneOrders = day.orders.filter((order) => getLane(order) === lane);
              const summary = summarizeLane(lane, laneOrders);

              return (
                <div key={lane} className={`rounded-2xl border p-4 ${laneTone(lane)}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-white">{laneTitle(lane)}</div>
                      <div className="mt-1 text-xs text-white/60">{laneDescription(lane)}</div>
                    </div>
                    <div className="text-right text-xs text-white/70">
                      <div>{summary.ordersCount} bookings</div>
                      <div>{summary.seats} units</div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.12em] text-white/70">
                    <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1">{summary.ordersCount} bookings</span>
                    <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1">{summary.seats} units</span>
                    {summary.capacity !== null ? (
                      <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1">
                        {summary.remaining} left of {summary.capacity}
                      </span>
                    ) : null}
                    {summary.unpaid > 0 ? (
                      <span className="rounded-full border border-amber-400/30 bg-amber-500/15 px-3 py-1 text-amber-100">
                        {summary.unpaid} unpaid
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 grid gap-3">
                    {laneOrders.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 text-sm text-white/45">
                        No bookings in this lane.
                      </div>
                    ) : (
                      laneOrders.map((order) => (
                        <Link
                          key={order.orderId}
                          href={buildOrderHref(order.orderId)}
                          className="rounded-2xl border border-white/10 bg-black/20 p-4 hover:bg-white/10"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold text-white">{order.customerName}</div>
                              <div className="mt-1 text-xs text-white/55">
                                {orderQuantityLabel(order)} • {order.inventoryLabel || order.productLabel}
                              </div>
                              <div className="mt-1 text-xs text-white/45">
                                {order.pickupLabel}
                                {order.departureLabel && order.departureLabel !== order.pickupLabel
                                  ? ` • ${order.departureLabel}`
                                  : ""}
                              </div>
                              <div className="mt-1 text-xs text-white/45">{order.fleetOwnerLabel}</div>
                            </div>
                            <span
                              className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.12em] ${paymentTone(order.paymentState)}`}
                            >
                              {order.paymentState}
                            </span>
                          </div>
                          {order.workflowState === "canceled" || order.workflowState === "needs_review" ? (
                            <div className="mt-2">
                              <span
                                className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.12em] ${workflowTone(order.workflowState)}`}
                              >
                                {order.workflowState}
                              </span>
                            </div>
                          ) : null}
                          <div className="mt-2 text-xs text-white/55">
                            {order.customerEmail} {order.customerPhone ? `• ${order.customerPhone}` : ""}
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
