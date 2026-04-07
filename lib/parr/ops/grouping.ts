import type { OpsDayGroup, OpsDepartureGroup, OpsOrder } from "@/lib/parr/ops/types";

function compareOrders(a: OpsOrder, b: OpsOrder) {
  const dateCompare = (a.serviceDate || "").localeCompare(b.serviceDate || "");
  if (dateCompare !== 0) return dateCompare;
  const departureCompare = a.departureLabel.localeCompare(b.departureLabel);
  if (departureCompare !== 0) return departureCompare;
  return a.createdAt.localeCompare(b.createdAt);
}

export function groupOrdersByDay(orders: OpsOrder[]): OpsDayGroup[] {
  const byDay = new Map<string, OpsOrder[]>();
  for (const order of [...orders].sort(compareOrders)) {
    const key = order.serviceDate || "unscheduled";
    const bucket = byDay.get(key) || [];
    bucket.push(order);
    byDay.set(key, bucket);
  }

  return Array.from(byDay.entries()).map(([key, dayOrders]) => {
    const byDeparture = new Map<string, OpsOrder[]>();
    for (const order of dayOrders) {
      const departureKey = `${order.serviceDate || "unscheduled"}::${order.departureLabel}::${order.pickupLabel}`;
      const bucket = byDeparture.get(departureKey) || [];
      bucket.push(order);
      byDeparture.set(departureKey, bucket);
    }

    const departures: OpsDepartureGroup[] = Array.from(byDeparture.entries()).map(([departureKey, groupOrders]) => ({
      key: departureKey,
      serviceDate: groupOrders[0]?.serviceDate || "unscheduled",
      departureLabel: groupOrders[0]?.departureLabel || "Unscheduled",
      pickupLabel: groupOrders[0]?.pickupLabel || "Needs review",
      orders: groupOrders,
      seats: groupOrders.reduce((sum, order) => sum + order.seats, 0),
      paidSeats: groupOrders.filter((order) => order.paymentState === "paid").reduce((sum, order) => sum + order.seats, 0),
      pendingSeats: groupOrders.filter((order) => order.paymentState !== "paid").reduce((sum, order) => sum + order.seats, 0),
    }));

    return {
      key,
      serviceDate: key,
      orders: dayOrders,
      departures,
      seats: dayOrders.reduce((sum, order) => sum + order.seats, 0),
      ordersCount: dayOrders.length,
      warnings: dayOrders.filter((order) => order.workflowState === "needs_review" || order.workflowState === "pending_payment").length,
    };
  });
}

export function buildOpsSummary(orders: OpsOrder[]) {
  return {
    totalOrders: orders.length,
    totalSeats: orders.reduce((sum, order) => sum + order.seats, 0),
    unpaidOrders: orders.filter((order) => order.paymentState === "unpaid" || order.paymentState === "partial").length,
    needsReview: orders.filter((order) => order.workflowState === "needs_review").length,
    waiting: orders.filter((order) => order.workflowState === "waiting").length,
    confirmed: orders.filter((order) => order.workflowState === "confirmed" || order.workflowState === "resolved").length,
  };
}
