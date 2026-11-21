import "server-only";

import Link from "next/link";
import { listInternalOrders } from "@/lib/orders";
import { listAdminInventoryPools } from "@/lib/inventory/parrVehicleInventory";
import { normalizeInternalOrder } from "@/lib/parr/ops/normalize";
import { buildOpsSummary, groupOrdersByDay } from "@/lib/parr/ops/grouping";
import type { FleetOwner } from "@/lib/parr/fleet";
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
type WorkflowFilter = "all" | "pending_payment" | "waiting" | "confirmed" | "resolved" | "canceled" | "needs_review";
type OwnerFilter = "all" | FleetOwner;
type WarningFilter = "all" | "reassignment_only";

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
    order.fleetOwnerLabel,
    order.inventoryLabel,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(search.toLowerCase());
}

function buildHref(
  basePath: string,
  base: Record<string, string | undefined>,
  patch: Record<string, string | undefined>
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...base, ...patch })) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function InventoryConsolePage({
  searchParams,
  defaultOwner = "parr",
  basePath,
  title,
  copy,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
  defaultOwner?: OwnerFilter;
  basePath: string;
  title: string;
  copy: string;
}) {
  const sp = searchParams ? await searchParams : {};
  const selectedOrderId = Array.isArray(sp.order) ? sp.order[0] : sp.order;
  const activeViewRaw = Array.isArray(sp.view) ? sp.view[0] : sp.view;
  const activePaymentRaw = Array.isArray(sp.payment) ? sp.payment[0] : sp.payment;
  const activeWorkflowRaw = Array.isArray(sp.workflow) ? sp.workflow[0] : sp.workflow;
  const activeOwnerRaw = Array.isArray(sp.owner) ? sp.owner[0] : sp.owner;
  const activeWarningRaw = Array.isArray(sp.warning) ? sp.warning[0] : sp.warning;
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
    activeWorkflowRaw === "canceled" ||
    activeWorkflowRaw === "needs_review"
      ? activeWorkflowRaw
      : "all";
  const activeOwner: OwnerFilter =
    activeOwnerRaw === "all" || activeOwnerRaw === "parr" || activeOwnerRaw === "friend_fleet"
      ? activeOwnerRaw
      : defaultOwner;
  const activeWarning: WarningFilter = activeWarningRaw === "reassignment_only" ? activeWarningRaw : "all";

  const orders = (await listInternalOrders()).map(normalizeInternalOrder);
  const filteredOrders = orders.filter((order) => {
    if (activeOwner !== "all" && order.fleetOwner !== activeOwner) return false;
    if (activePayment !== "all" && order.paymentState !== activePayment) return false;
    if (activeWorkflow !== "all" && order.workflowState !== activeWorkflow) return false;
    if (activeWarning === "reassignment_only" && !order.hasReassignmentWarning) return false;
    if (!matchesSearch(order, search)) return false;
    return true;
  });
  const dayGroups = groupOrdersByDay(filteredOrders);
  const summary = buildOpsSummary(filteredOrders);
  const selectedOrder = orders.find((order) => order.orderId === selectedOrderId) || null;
  const baseQuery = {
    owner: activeOwner !== defaultOwner ? activeOwner : undefined,
    payment: activePayment !== "all" ? activePayment : undefined,
    workflow: activeWorkflow !== "all" ? activeWorkflow : undefined,
    warning: activeWarning !== "all" ? activeWarning : undefined,
    search: search || undefined,
  };
  const productOptions = getProductOptions(orders);
  const nativeInvBoard = await listAdminInventoryPools().catch(() => ({
    pools: [],
    unresolvedAlerts: [],
  }));

  return (
    <main className="comic-page pt-24 pb-12">
      <section className="comic-wrap space-y-5">
        <div className="comic-hero">
          <div className="comic-kicker">Internal</div>
          <h1 className="comic-title">{title}</h1>
          <p className="comic-copy">{copy}</p>
          <p className="mt-2 text-sm text-white/60">
            This page never deletes booking history. It is a simpler operator view of the same saved orders and sales.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Link href="/admin/parr-inventory" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-white/80 hover:bg-white/10">
              PARR board
            </Link>
            <Link href="/admin/friend-fleet-inventory" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-white/80 hover:bg-white/10">
              Friend fleet board
            </Link>
          </div>
        </div>

        {nativeInvBoard.unresolvedAlerts.length > 0 ? (
          <section
            data-testid="admin-reconciliation-alerts"
            className="rounded-3xl border border-rose-400/45 bg-rose-500/12 p-5 text-white"
          >
            <div className="text-xs font-black uppercase tracking-[0.2em] text-rose-200">
              Action Required · Rezdy / PARR Inventory Reconciliation Disagreements ({nativeInvBoard.unresolvedAlerts.length})
            </div>
            <p className="mt-1 text-xs text-rose-100/85">
              Affected service dates and vehicle classes are automatically blocked from new online sales until reconciled via <code>POST /api/internal/rezdy-inventory</code>. Completed customer bookings remain preserved.
            </p>
            <ul className="mt-3 space-y-2 text-xs">
              {nativeInvBoard.unresolvedAlerts.map((alert) => (
                <li key={alert.alertId} className="rounded-2xl border border-rose-400/30 bg-black/30 p-3">
                  <div className="font-bold text-rose-100">
                    [{alert.code}] {alert.canonicalServiceDate} · {alert.vehicleSlug.toUpperCase()} ({alert.canonicalShowId})
                  </div>
                  <div className="mt-0.5 text-white/85">{alert.summary}</div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {nativeInvBoard.pools.length > 0 ? (
          <section
            data-testid="admin-durable-native-pools"
            className="rounded-3xl border border-white/12 bg-white/5 p-5 text-white"
          >
            <div className="text-xs font-black uppercase tracking-[0.2em] text-[#ffb07c]">
              Durable Native Vehicle Inventory Pools (Suburban Cap: 6 · Van Cap: 3)
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {nativeInvBoard.pools.map(({ ledger, summary: ps }) => (
                <div
                  key={ledger.poolKey}
                  className="rounded-2xl border border-white/12 bg-black/30 p-3.5 text-xs"
                >
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>{ps.canonicalServiceDate} · {ps.vehicleSlug === "suv" ? "Suburban" : "Private Van"}</span>
                    <span className={ps.reconciliationBlocked ? "text-rose-300" : ps.available ? "text-emerald-300" : "text-amber-300"}>
                      {ps.reconciliationBlocked ? "BLOCKED (RECONCILE)" : ps.available ? `${ps.availableCount}/${ps.capacity} Open` : "SOLD OUT (0)"}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-white/70">
                    Show: {ps.canonicalShowId} · Sold: {ps.confirmedSoldCount} · Held: {ps.activeHoldCount} · Pending: {ps.pendingPaymentCount} · Blocked: {ps.reconciliationBlockedUnitCount}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <OpsViewTabs activeView={activeView} buildHref={(view) => buildHref(basePath, baseQuery, { view })} />
        <OpsKpiBar {...summary} />
        <OpsFilters
          activeOwner={activeOwner}
          activePayment={activePayment}
          activeWorkflow={activeWorkflow}
          activeWarning={activeWarning}
          search={search}
        />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div>
            {activeView === "calendar" ? (
              <OpsCalendarBoard
                dayGroups={dayGroups}
                buildOrderHref={(orderId) => buildHref(basePath, baseQuery, { view: activeView, order: orderId })}
              />
            ) : null}
            {activeView === "run-sheet" ? (
              <OpsRunSheet
                dayGroups={dayGroups}
                buildOrderHref={(orderId) => buildHref(basePath, baseQuery, { view: activeView, order: orderId })}
              />
            ) : null}
            {activeView === "all-orders" ? (
              <OpsOrdersTable
                orders={filteredOrders}
                buildOrderHref={(orderId) => buildHref(basePath, baseQuery, { view: activeView, order: orderId })}
              />
            ) : null}
          </div>

          <div>
            {selectedOrder ? (
              <OpsOrderDrawer order={selectedOrder} productOptions={productOptions} />
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/60">
                Select a booking from the board to open the detail drawer.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
