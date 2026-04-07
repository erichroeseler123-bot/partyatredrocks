import Link from "next/link";
import type { OpsDayGroup } from "@/lib/parr/ops/types";

export default function OpsRunSheet({
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
          <h2 className="text-2xl font-black text-white">{day.serviceDate || "Unscheduled"}</h2>
          <div className="mt-4 space-y-4">
            {day.departures.map((departure) => (
              <div key={departure.key} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">{departure.departureLabel}</div>
                    <div className="text-xs text-white/55">{departure.pickupLabel}</div>
                  </div>
                  <div className="text-xs text-white/65">{departure.seats} total seats</div>
                </div>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-left text-xs text-white/80">
                    <thead>
                      <tr className="border-b border-white/10 text-white/45">
                        <th className="py-2 pr-3">Customer</th>
                        <th className="py-2 pr-3">Seats</th>
                        <th className="py-2 pr-3">Payment</th>
                        <th className="py-2 pr-3">Workflow</th>
                        <th className="py-2 pr-3">Contact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departure.orders.map((order) => (
                        <tr key={order.orderId} className="border-b border-white/5">
                          <td className="py-2 pr-3">
                            <Link href={buildOrderHref(order.orderId)} className="font-semibold text-white hover:underline">
                              {order.customerName}
                            </Link>
                          </td>
                          <td className="py-2 pr-3">{order.seats}</td>
                          <td className="py-2 pr-3">{order.paymentState}</td>
                          <td className="py-2 pr-3">{order.workflowState}</td>
                          <td className="py-2 pr-3">{order.customerEmail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
