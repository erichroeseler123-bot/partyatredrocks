import Link from "next/link";
import type { OpsOrder } from "@/lib/parr/ops/types";

export default function OpsOrdersTable({
  orders,
  buildOrderHref,
}: {
  orders: OpsOrder[];
  buildOrderHref: (orderId: string) => string;
}) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/5 p-4">
      <table className="w-full text-left text-sm text-white/80">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-[0.14em] text-white/45">
            <th className="py-3 pr-4">Created</th>
            <th className="py-3 pr-4">Customer</th>
            <th className="py-3 pr-4">Product</th>
            <th className="py-3 pr-4">Session</th>
            <th className="py-3 pr-4">Payment</th>
            <th className="py-3 pr-4">Workflow</th>
            <th className="py-3 pr-4">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId} className="border-b border-white/5">
              <td className="py-3 pr-4">{new Date(order.createdAt).toLocaleString("en-US")}</td>
              <td className="py-3 pr-4">
                <Link href={buildOrderHref(order.orderId)} className="font-semibold text-white hover:underline">
                  {order.customerName}
                </Link>
                <div className="text-xs text-white/50">{order.customerEmail}</div>
              </td>
              <td className="py-3 pr-4">{order.productLabel}</td>
              <td className="py-3 pr-4">{order.sessionKey || "—"}</td>
              <td className="py-3 pr-4">{order.paymentState}</td>
              <td className="py-3 pr-4">{order.workflowState}</td>
              <td className="py-3 pr-4">${order.totalDue.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
