import "server-only";

import { listInternalOrders } from "@/lib/orders";
import { normalizeInternalOrder } from "@/lib/parr/ops/normalize";
import { buildOpsSummary, groupOrdersByDay } from "@/lib/parr/ops/grouping";
import type { OpsOrder, OpsView } from "@/lib/parr/ops/types";
import { PRIVATE_RIDE_OPTIONS } from "@/lib/rideCatalog";
import OpsViewTabs from "@/app/admin/parr-inventory/components/OpsViewTabs";
import OpsKpiBar from "@/app/admin/parr-inventory/components/OpsKpiBar";
import OpsFilters from "@/app/admin/parr-inventory/components/OpsFilters";
import OpsCalendarBoard from "@/app/admin/parr-inventory/components/OpsCalendarBoard";
import OpsRunSheet from "@/app/admin/parr-inventory/components/OpsRunSheet";
import OpsOrdersTable from "@/app/admin/parr-inventory/components/OpsOrdersTable";
import OpsOrderDrawer from "@/app/admin/parr-inventory/components/OpsOrderDrawer";

type PaymentFilter = "all" | "unpaid" | "partial" | "paid" | "manual_review";
type WorkflowFilter = "all" | "pending_payment" | "waiting" | "confirmed" | "resolved" | "needs_review";

function getProductOptions(orders: OpsOrder[]) {
  const values = new Map<string, string>();
  values.set("shared-denver", "Shared Shuttle - Denver");
  values.set("shared-golden", "Shared Shuttle - Golden");
  for (const option of PRIVATE_RIDE_OPTIONS) {
    values.set(option.dccProduct, option.title);
  }
  for (const order of orders) {
    if (order.productCode && !values.has(order.productCode)) {
      values.set(order.productCode, order.productLabel);
    }
  }
  return Array.from(values.entries()).map(([value, label]) => ({ value, label }));
}

function matchesSearch(order: OpsOrder, search: string) {
  if (!search) return true;
  const haystack = [
    order.orderId,
    order.bookingToken,
    order.bookingReference,
    order.customerName,
    order.customerEmail,
    order.customerPhone,
    order.sessionKey,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(search.toLowerCase());
}

function buildHref(base: Record<string, string | undefined>, patch: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...base, ...patch })) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `/admin/parr-inventory?${query}` : "/admin/parr-inventory";
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ParrInventoryPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = searchParams ? await searchParams : {};
  const selectedOrderId = Array.isArray(sp.order) ? sp.order[0] : sp.order;
  const activeViewRaw = Array.isArray(sp.view) ? sp.view[0] : sp.view;
  const activePaymentRaw = Array.isArray(sp.payment) ? sp.payment[0] : sp.payment;
  const activeWorkflowRaw = Array.isArray(sp.workflow) ? sp.workflow[0] : sp.workflow;
  const search = (Array.isArray(sp.search) ? sp.search[0] : sp.search) || "";
  const activeView: OpsView =
    activeViewRaw === "run-sheet" || activeViewRaw === "all-orders" ? activeViewRaw : "calendar";
  const activePayment: PaymentFilter =
    activePaymentRaw === "unpaid" ||
    activePaymentRaw === "partial" ||
    activePaymentRaw === "paid" ||
    activePaymentRaw === "manual_review"
      ? activePaymentRaw
      : "all";
  const activeWorkflow: WorkflowFilter =
    activeWorkflowRaw === "pending_payment" ||
    activeWorkflowRaw === "waiting" ||
    activeWorkflowRaw === "confirmed" ||
    activeWorkflowRaw === "resolved" ||
    activeWorkflowRaw === "needs_review"
      ? activeWorkflowRaw
      : "all";

  const orders = (await listInternalOrders()).map(normalizeInternalOrder);
  const filteredOrders = orders.filter((order) => {
    if (activePayment !== "all" && order.paymentState !== activePayment) return false;
    if (activeWorkflow !== "all" && order.workflowState !== activeWorkflow) return false;
    if (!matchesSearch(order, search)) return false;
    return true;
  });
  const dayGroups = groupOrdersByDay(filteredOrders);
  const summary = buildOpsSummary(filteredOrders);
  const selectedOrder = orders.find((order) => order.orderId === selectedOrderId) || null;
  const baseQuery = {
    payment: activePayment !== "all" ? activePayment : undefined,
    workflow: activeWorkflow !== "all" ? activeWorkflow : undefined,
    search: search || undefined,
  };
  const productOptions = getProductOptions(orders);

  return (
    <main className="comic-page pt-24 pb-12">
      <section className="comic-wrap space-y-5">
        <div className="comic-hero">
          <div className="comic-kicker">Internal</div>
          <h1 className="comic-title">PARR Inventory</h1>
          <p className="comic-copy">Booking-safe Party at Red Rocks operations board backed by the live internal order store.</p>
          <p className="mt-2 text-sm text-white/60">
            This page does not replace or delete booking records. It is a simpler operator view of the same saved orders.
          </p>
        </div>

        <OpsViewTabs activeView={activeView} buildHref={(view) => buildHref(baseQuery, { view })} />
        <OpsKpiBar {...summary} />
        <OpsFilters activePayment={activePayment} activeWorkflow={activeWorkflow} search={search} />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div>
            {activeView === "calendar" ? (
              <OpsCalendarBoard
                dayGroups={dayGroups}
                buildOrderHref={(orderId) => buildHref(baseQuery, { view: activeView, order: orderId })}
              />
            ) : null}
            {activeView === "run-sheet" ? (
              <OpsRunSheet
                dayGroups={dayGroups}
                buildOrderHref={(orderId) => buildHref(baseQuery, { view: activeView, order: orderId })}
              />
            ) : null}
            {activeView === "all-orders" ? (
              <OpsOrdersTable
                orders={filteredOrders}
                buildOrderHref={(orderId) => buildHref(baseQuery, { view: activeView, order: orderId })}
              />
            ) : null}
          </div>

          <div>
            {selectedOrder ? (
              <OpsOrderDrawer order={selectedOrder} productOptions={productOptions} />
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/60">
                Select an order from the board to open the detail drawer.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
