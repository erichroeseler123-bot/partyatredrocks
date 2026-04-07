import Link from "next/link";
import type { OpsDayGroup } from "@/lib/parr/ops/types";

function paymentTone(state: string) {
  if (state === "paid") return "border-emerald-400/30 bg-emerald-500/15 text-emerald-100";
  if (state === "partial") return "border-amber-400/30 bg-amber-500/15 text-amber-100";
  if (state === "manual_review") return "border-red-400/30 bg-red-500/15 text-red-100";
  return "border-white/15 bg-white/5 text-white/75";
}

export default function OpsCalendarBoard({
  dayGroups,
  buildOrderHref,
}: {
  dayGroups: OpsDayGroup[];
  buildOrderHref: (orderId: string) => string;
}) {
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
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/80">{day.ordersCount} orders</span>
              <span className="rounded-full border border-cyan-400/30 bg-cyan-500/15 px-3 py-1 text-cyan-100">{day.seats} seats</span>
              <span className="rounded-full border border-red-400/30 bg-red-500/15 px-3 py-1 text-red-100">{day.warnings} warnings</span>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {day.departures.map((departure) => (
              <div key={departure.key} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">{departure.departureLabel}</div>
                    <div className="text-xs text-white/55">{departure.pickupLabel}</div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/80">{departure.orders.length} orders</span>
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-emerald-100">{departure.paidSeats} paid seats</span>
                    <span className="rounded-full border border-amber-400/30 bg-amber-500/15 px-3 py-1 text-amber-100">{departure.pendingSeats} pending seats</span>
                  </div>
                </div>

                <div className="mt-3 grid gap-3">
                  {departure.orders.map((order) => (
                    <Link
                      key={order.orderId}
                      href={buildOrderHref(order.orderId)}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-white">{order.customerName}</div>
                          <div className="mt-1 text-xs text-white/55">
                            {order.productLabel} • {order.seats} seat{order.seats === 1 ? "" : "s"}
                          </div>
                        </div>
                        <span className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.12em] ${paymentTone(order.paymentState)}`}>
                          {order.paymentState}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-white/55">
                        {order.customerEmail} {order.customerPhone ? `• ${order.customerPhone}` : ""}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
