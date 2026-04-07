type PaymentFilter = "all" | "unpaid" | "partial" | "paid" | "manual_review";
type WorkflowFilter = "all" | "pending_payment" | "waiting" | "confirmed" | "resolved" | "canceled" | "needs_review";

export default function OpsFilters({
  activePayment,
  activeWorkflow,
  search,
}: {
  activePayment: PaymentFilter;
  activeWorkflow: WorkflowFilter;
  search: string;
}) {
  return (
    <form className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 md:grid-cols-3">
      <label className="text-sm text-white/80">
        Payment
        <select
          name="payment"
          defaultValue={activePayment}
          className="mt-1 min-h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-white"
        >
          <option value="all">All</option>
          <option value="unpaid">Unpaid</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
          <option value="manual_review">Manual review</option>
        </select>
      </label>
      <label className="text-sm text-white/80">
        Workflow
        <select
          name="workflow"
          defaultValue={activeWorkflow}
          className="mt-1 min-h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-white"
        >
          <option value="all">All</option>
          <option value="pending_payment">Pending payment</option>
          <option value="waiting">Waiting</option>
          <option value="confirmed">Confirmed</option>
          <option value="resolved">Resolved</option>
          <option value="canceled">Canceled</option>
          <option value="needs_review">Needs review</option>
        </select>
      </label>
      <label className="text-sm text-white/80">
        Search
        <input
          name="search"
          defaultValue={search}
          placeholder="Name, email, order, token"
          className="mt-1 min-h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-white placeholder:text-white/35"
        />
      </label>
      <div className="md:col-span-3 flex gap-2">
        <button className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black">Apply Filters</button>
      </div>
    </form>
  );
}
