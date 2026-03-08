import "server-only";

import Link from "next/link";
import { listInternalOrders, type InternalOrderRow as OrderRow } from "@/lib/orders";
import InternalOrderOpsEditor from "@/components/internal/InternalOrderOpsEditor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PaymentFilter = "all" | "unpaid" | "partial" | "paid";
type HandoffFilter = "all" | "manual" | "url" | "request_sent";
type ViewFilter = "all" | "needs-action";

function customerName(customer: Record<string, unknown> | null | undefined): string {
  if (!customer) return "n/a";
  const first = typeof customer.firstName === "string" ? customer.firstName : "";
  const last = typeof customer.lastName === "string" ? customer.lastName : "";
  const joined = `${first} ${last}`.trim();
  return joined || "n/a";
}

function customerEmail(customer: Record<string, unknown> | null | undefined): string {
  if (!customer) return "n/a";
  return typeof customer.email === "string" && customer.email.trim() ? customer.email : "n/a";
}

function formatAmount(value: unknown): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "n/a";
  return `$${value.toFixed(2)}`;
}

function formatCreatedAt(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-US", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function paymentStatusOf(row: OrderRow): PaymentFilter | "unknown" {
  const status = row.payment && typeof row.payment.status === "string" ? row.payment.status : "unknown";
  if (status === "unpaid" || status === "partial" || status === "paid") return status;
  return "unknown";
}

function handoffModeOf(row: OrderRow): HandoffFilter | "unknown" {
  const mode = row.payment && typeof row.payment.handoffMode === "string" ? row.payment.handoffMode : "unknown";
  if (mode === "manual" || mode === "url") return mode;
  return "unknown";
}

function operatorPaymentStepOf(row: OrderRow): "none" | "request_sent" | "paid" {
  return row.operatorPaymentStep === "request_sent" || row.operatorPaymentStep === "paid"
    ? row.operatorPaymentStep
    : "none";
}

function handoffUrlOf(row: OrderRow): string | null {
  const url = row.payment && typeof row.payment.handoffUrl === "string" ? row.payment.handoffUrl.trim() : "";
  return /^https?:\/\//i.test(url) ? url : null;
}

function operatorActionOf(row: OrderRow): string | null {
  const text =
    row.payment && typeof row.payment.operatorAction === "string" ? row.payment.operatorAction.trim() : "";
  return text || null;
}

function needsAction(row: OrderRow): boolean {
  const paymentStatus = paymentStatusOf(row);
  if (paymentStatus === "unpaid" || paymentStatus === "partial") return true;
  if (paymentStatus === "unknown" && handoffModeOf(row) === "manual") return true;
  return false;
}

function followUpStatusOf(row: OrderRow): "new" | "contacted" | "waiting" | "resolved" {
  return row.followUpStatus === "contacted" ||
    row.followUpStatus === "waiting" ||
    row.followUpStatus === "resolved"
    ? row.followUpStatus
    : "new";
}

function followUpBadgeClass(status: "new" | "contacted" | "waiting" | "resolved"): string {
  if (status === "resolved") return "bg-emerald-500/20 text-emerald-200 border-emerald-400/30";
  if (status === "waiting") return "bg-amber-500/20 text-amber-200 border-amber-400/30";
  if (status === "contacted") return "bg-cyan-500/20 text-cyan-200 border-cyan-400/30";
  return "bg-white/10 text-white/80 border-white/20";
}

function ageHours(createdAt: string): number | null {
  const createdMs = Date.parse(createdAt);
  if (Number.isNaN(createdMs)) return null;
  const diffMs = Date.now() - createdMs;
  return diffMs >= 0 ? Math.floor(diffMs / 3_600_000) : 0;
}

function ageLabel(createdAt: string): string {
  const h = ageHours(createdAt);
  return h === null ? "n/a" : `${h}h`;
}

function ageBadgeClass(createdAt: string): string {
  const h = ageHours(createdAt);
  if (h === null) return "bg-white/10 text-white/80 border-white/20";
  if (h >= 12) return "bg-red-500/20 text-red-200 border-red-400/40";
  if (h >= 2) return "bg-amber-500/20 text-amber-200 border-amber-400/30";
  return "bg-white/10 text-white/80 border-white/20";
}

function paymentBadgeClass(status: string): string {
  if (status === "paid") return "bg-emerald-500/20 text-emerald-200 border-emerald-400/30";
  if (status === "partial") return "bg-amber-500/20 text-amber-200 border-amber-400/30";
  if (status === "unpaid") return "bg-red-500/20 text-red-200 border-red-400/40";
  return "bg-white/10 text-white/80 border-white/20";
}

function operatorPaymentStepBadgeClass(step: string): string {
  if (step === "paid") return "bg-emerald-500/20 text-emerald-200 border-emerald-400/30";
  if (step === "request_sent") return "bg-cyan-500/20 text-cyan-200 border-cyan-400/30";
  return "bg-white/10 text-white/80 border-white/20";
}

export default async function InternalOrdersPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = searchParams ? await searchParams : {};
  const orders = await listInternalOrders();
  const requestedPayment = Array.isArray(sp.payment) ? sp.payment[0] : sp.payment;
  const requestedHandoff = Array.isArray(sp.handoff) ? sp.handoff[0] : sp.handoff;
  const requestedView = Array.isArray(sp.view) ? sp.view[0] : sp.view;
  const activePaymentFilter: PaymentFilter =
    requestedPayment === "unpaid" || requestedPayment === "partial" || requestedPayment === "paid"
      ? requestedPayment
      : "all";
  const activeHandoffFilter: HandoffFilter =
    requestedHandoff === "manual" || requestedHandoff === "url" || requestedHandoff === "request_sent"
      ? requestedHandoff
      : "all";
  const activeView: ViewFilter = requestedView === "all" ? "all" : "needs-action";

  const filteredOrders = orders.filter((row) => {
    if (activeView === "needs-action" && !needsAction(row)) return false;
    if (activePaymentFilter !== "all" && paymentStatusOf(row) !== activePaymentFilter) return false;
    if (activeHandoffFilter === "request_sent") {
      if (operatorPaymentStepOf(row) !== "request_sent") return false;
    } else if (activeHandoffFilter !== "all" && handoffModeOf(row) !== activeHandoffFilter) {
      return false;
    }
    return true;
  })
  .sort((a, b) => {
    if (activeView === "needs-action") {
      return a.createdAt.localeCompare(b.createdAt); // oldest first in queue mode
    }
    return b.createdAt.localeCompare(a.createdAt);
  });

  const counts = {
    needsAction: orders.filter((row) => needsAction(row)).length,
    waiting: orders.filter((row) => followUpStatusOf(row) === "waiting").length,
    resolved: orders.filter((row) => followUpStatusOf(row) === "resolved").length,
    newManualUnpaid: orders.filter((row) => {
      const paymentStatus = paymentStatusOf(row);
      const handoffMode = handoffModeOf(row);
      const step = operatorPaymentStepOf(row);
      return handoffMode === "manual" && paymentStatus === "unpaid" && step === "none";
    }).length,
    requestSentWaiting: orders.filter((row) => {
      return operatorPaymentStepOf(row) === "request_sent" || followUpStatusOf(row) === "waiting";
    }).length,
    paidToday: orders.filter((row) => {
      const paid = paymentStatusOf(row) === "paid";
      if (!paid || !row.lastTouchedAt) return false;
      const d = new Date(row.lastTouchedAt);
      if (Number.isNaN(d.getTime())) return false;
      const now = new Date();
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    }).length,
  };

  const queueRows = orders
    .filter((row) => needsAction(row))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const queueLanes = {
    newManualUnpaid: queueRows.filter((row) => {
      return (
        handoffModeOf(row) === "manual" &&
        paymentStatusOf(row) === "unpaid" &&
        operatorPaymentStepOf(row) === "none"
      );
    }),
    requestSentWaiting: queueRows.filter((row) => {
      return operatorPaymentStepOf(row) === "request_sent";
    }),
    unpaidWithUrl: queueRows.filter((row) => {
      return handoffModeOf(row) === "url" && paymentStatusOf(row) !== "paid";
    }),
  };

  const queuePreview = queueRows.slice(0, 8);

  return (
    <main className="comic-page pt-24 pb-12">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Internal</div>
          <h1 className="comic-title">Order Log</h1>
          <p className="comic-copy">Booking + payment reconciliation from the orders database.</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(["all", "unpaid", "partial", "paid"] as PaymentFilter[]).map((filter) => {
            const active = activePaymentFilter === filter;
            const params = new URLSearchParams();
            if (filter !== "all") params.set("payment", filter);
            if (activeHandoffFilter !== "all") params.set("handoff", activeHandoffFilter);
            if (activeView !== "all") params.set("view", activeView);
            const href = params.toString() ? `/internal/orders?${params.toString()}` : "/internal/orders";
            return (
              <Link
                key={filter}
                href={href}
                className={`comic-btn ${active ? "comic-btn-primary" : "comic-btn-secondary"}`}
              >
                {filter}
              </Link>
            );
          })}
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {(["all", "manual", "url", "request_sent"] as HandoffFilter[]).map((filter) => {
            const active = activeHandoffFilter === filter;
            const params = new URLSearchParams();
            if (activePaymentFilter !== "all") params.set("payment", activePaymentFilter);
            if (filter !== "all") params.set("handoff", filter);
            if (activeView !== "all") params.set("view", activeView);
            const href = params.toString() ? `/internal/orders?${params.toString()}` : "/internal/orders";
            return (
              <Link
                key={filter}
                href={href}
                className={`comic-btn ${active ? "comic-btn-primary" : "comic-btn-secondary"}`}
              >
                {filter === "request_sent" ? "handoff: request sent" : `handoff: ${filter}`}
              </Link>
            );
          })}
          {(["all", "needs-action"] as ViewFilter[]).map((view) => {
            const active = activeView === view;
            const params = new URLSearchParams();
            if (activePaymentFilter !== "all") params.set("payment", activePaymentFilter);
            if (activeHandoffFilter !== "all") params.set("handoff", activeHandoffFilter);
            if (view !== "all") params.set("view", view);
            const href = params.toString() ? `/internal/orders?${params.toString()}` : "/internal/orders";
            return (
              <Link
                key={view}
                href={href}
                className={`comic-btn ${active ? "comic-btn-primary" : "comic-btn-secondary"}`}
              >
                {view === "all" ? "view: all" : "view: needs action"}
              </Link>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-red-400/30 bg-red-500/20 px-3 py-1 text-red-200">
            new manual unpaid: {counts.newManualUnpaid}
          </span>
          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/20 px-3 py-1 text-cyan-200">
            request sent / waiting: {counts.requestSentWaiting}
          </span>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3 py-1 text-emerald-200">
            paid today: {counts.paidToday}
          </span>
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-white/85">
            needs action: {counts.needsAction}
          </span>
          <span className="rounded-full border border-amber-400/30 bg-amber-500/20 px-3 py-1 text-amber-200">
            waiting: {counts.waiting}
          </span>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3 py-1 text-emerald-200">
            resolved: {counts.resolved}
          </span>
        </div>

        <div className="comic-panel mt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="comic-h3">Operator Queue</h2>
            <Link className="comic-btn comic-btn-secondary" href="/internal/orders?view=needs-action">
              Open Needs-Action Queue
            </Link>
          </div>

          <div className="mt-3 grid gap-2 md:grid-cols-3">
            <Link
              href="/internal/orders?view=needs-action&payment=unpaid&handoff=manual"
              className="rounded-xl border border-red-400/30 bg-red-500/15 p-3"
            >
              <p className="text-[11px] uppercase tracking-[0.16em] text-red-200">New Manual Unpaid</p>
              <p className="mt-1 text-2xl font-black text-white">{queueLanes.newManualUnpaid.length}</p>
              <p className="mt-1 text-xs text-red-100/80">Send Rezdy payment request and mark sent.</p>
            </Link>
            <Link
              href="/internal/orders?view=needs-action&handoff=request_sent"
              className="rounded-xl border border-cyan-400/30 bg-cyan-500/15 p-3"
            >
              <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200">Request Sent / Waiting</p>
              <p className="mt-1 text-2xl font-black text-white">{queueLanes.requestSentWaiting.length}</p>
              <p className="mt-1 text-xs text-cyan-100/80">Follow up until webhook/payment marks paid.</p>
            </Link>
            <Link
              href="/internal/orders?view=needs-action&handoff=url"
              className="rounded-xl border border-amber-400/30 bg-amber-500/15 p-3"
            >
              <p className="text-[11px] uppercase tracking-[0.16em] text-amber-200">URL Handoff Unpaid</p>
              <p className="mt-1 text-2xl font-black text-white">{queueLanes.unpaidWithUrl.length}</p>
              <p className="mt-1 text-xs text-amber-100/80">Send/verify customer payment link usage.</p>
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-2 pr-3">Oldest Next</th>
                  <th className="py-2 pr-3">Age</th>
                  <th className="py-2 pr-3">Payment</th>
                  <th className="py-2 pr-3">Handoff</th>
                  <th className="py-2 pr-3">Customer</th>
                  <th className="py-2 pr-3">Last Touched</th>
                </tr>
              </thead>
              <tbody>
                {queuePreview.map((row) => {
                  const orderNumber =
                    row.booking && typeof row.booking.orderNumber === "string"
                      ? row.booking.orderNumber
                      : (row.rezdyBookingReference ?? "n/a");
                  const paymentStatus = paymentStatusOf(row);
                  const handoffMode = handoffModeOf(row);
                  return (
                    <tr key={`queue-${row.internalOrderId}`} className="border-b border-white/5">
                      <td className="py-2 pr-3">{orderNumber}</td>
                      <td className="py-2 pr-3">
                        <span
                          className={`inline-flex rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.12em] ${ageBadgeClass(
                            row.createdAt
                          )}`}
                        >
                          {ageLabel(row.createdAt)}
                        </span>
                      </td>
                      <td className="py-2 pr-3">
                        <span
                          className={`inline-flex rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.12em] ${paymentBadgeClass(
                            paymentStatus
                          )}`}
                        >
                          {paymentStatus}
                        </span>
                      </td>
                      <td className="py-2 pr-3">
                        {handoffMode === "unknown" ? "n/a" : handoffMode}
                        {operatorPaymentStepOf(row) === "request_sent" ? " / request_sent" : ""}
                      </td>
                      <td className="py-2 pr-3">{customerName(row.customer)}</td>
                      <td className="py-2 pr-3">
                        {row.lastTouchedAt ? formatCreatedAt(row.lastTouchedAt) : "n/a"}
                      </td>
                    </tr>
                  );
                })}
                {queuePreview.length === 0 ? (
                  <tr>
                    <td className="py-2 text-white/70" colSpan={6}>
                      No active queue items.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="comic-panel mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-2 pr-3">Created</th>
                <th className="py-2 pr-3">Last Touched</th>
                <th className="py-2 pr-3">Age</th>
                <th className="py-2 pr-3">Product</th>
                <th className="py-2 pr-3">Order Number</th>
                <th className="py-2 pr-3">Booking Status</th>
                <th className="py-2 pr-3">Payment Status</th>
                <th className="py-2 pr-3">Handoff</th>
                <th className="py-2 pr-3">Handoff Detail</th>
                <th className="py-2 pr-3">Payment Ops</th>
                <th className="py-2 pr-3">Total Due</th>
                <th className="py-2 pr-3">Total Paid</th>
                <th className="py-2 pr-3">Customer</th>
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">Session</th>
                <th className="py-2 pr-3">Follow-up</th>
                <th className="py-2 pr-3">Ops</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((row) => {
                const bookingStatus =
                  row.booking && typeof row.booking.status === "string" ? row.booking.status : "n/a";
                const paymentStatus =
                  row.payment && typeof row.payment.status === "string" ? row.payment.status : "n/a";
                const handoffMode =
                  row.payment && typeof row.payment.handoffMode === "string" ? row.payment.handoffMode : "n/a";
                const handoffUrl = handoffUrlOf(row);
                const operatorAction = operatorActionOf(row);
                const followUpStatus = followUpStatusOf(row);
                const notes = typeof row.notes === "string" ? row.notes : "";
                const operatorPaymentStep =
                  row.operatorPaymentStep === "request_sent" || row.operatorPaymentStep === "paid"
                    ? row.operatorPaymentStep
                    : "none";
                const canMarkPaymentRequestSent =
                  handoffMode === "manual" &&
                  (paymentStatus === "unpaid" || paymentStatus === "partial") &&
                  operatorPaymentStep !== "paid";
                const orderNumber =
                  row.booking && typeof row.booking.orderNumber === "string"
                    ? row.booking.orderNumber
                    : (row.rezdyBookingReference ?? "n/a");

                return (
                  <tr key={row.internalOrderId} className="border-b border-white/5 align-top">
                    <td className="py-2 pr-3">{formatCreatedAt(row.createdAt)}</td>
                    <td className="py-2 pr-3">
                      {row.lastTouchedAt ? formatCreatedAt(row.lastTouchedAt) : "n/a"}
                    </td>
                    <td className="py-2 pr-3">
                      <span
                        className={`inline-flex rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.12em] ${ageBadgeClass(
                          row.createdAt
                        )}`}
                      >
                        {ageLabel(row.createdAt)}
                      </span>
                    </td>
                    <td className="py-2 pr-3">{row.productCode || "n/a"}</td>
                    <td className="py-2 pr-3">{orderNumber}</td>
                    <td className="py-2 pr-3">{bookingStatus}</td>
                    <td className="py-2 pr-3">
                      <span
                        className={`inline-flex rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.12em] ${paymentBadgeClass(
                          paymentStatus
                        )}`}
                      >
                        {paymentStatus}
                      </span>
                    </td>
                    <td className="py-2 pr-3">{handoffMode}</td>
                    <td className="py-2 pr-3">
                      {handoffMode === "url" && handoffUrl ? (
                        <a
                          href={handoffUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-white/80"
                        >
                          payment link
                        </a>
                      ) : handoffMode === "manual" ? (
                        operatorAction || "Send payment request from Rezdy dashboard."
                      ) : (
                        "n/a"
                      )}
                    </td>
                    <td className="py-2 pr-3">
                      <span
                        className={`inline-flex rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.12em] ${operatorPaymentStepBadgeClass(
                          operatorPaymentStep
                        )}`}
                      >
                        {operatorPaymentStep}
                      </span>
                    </td>
                    <td className="py-2 pr-3">{formatAmount(row.payment?.totalDue)}</td>
                    <td className="py-2 pr-3">{formatAmount(row.payment?.totalPaid)}</td>
                    <td className="py-2 pr-3">{customerName(row.customer)}</td>
                    <td className="py-2 pr-3">{customerEmail(row.customer)}</td>
                    <td className="py-2 pr-3">{row.sessionKey || "n/a"}</td>
                    <td className="py-2 pr-3">
                      <span
                        className={`inline-flex rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.12em] ${followUpBadgeClass(
                          followUpStatus
                        )}`}
                      >
                        {followUpStatus}
                      </span>
                    </td>
                    <td className="py-2 pr-3">
                      <InternalOrderOpsEditor
                        internalOrderId={row.internalOrderId}
                        initialNotes={notes}
                        initialFollowUpStatus={followUpStatus}
                        canMarkPaymentRequestSent={canMarkPaymentRequestSent}
                        paymentRequestSentAt={row.paymentRequestSentAt ?? null}
                        operatorPaymentStep={operatorPaymentStep}
                      />
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 ? (
                <tr>
                  <td className="py-3 text-muted" colSpan={17}>
                    No orders for this filter.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
