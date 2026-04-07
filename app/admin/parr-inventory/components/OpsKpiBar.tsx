export default function OpsKpiBar({
  totalOrders,
  totalSeats,
  unpaidOrders,
  needsReview,
  waiting,
  confirmed,
}: {
  totalOrders: number;
  totalSeats: number;
  unpaidOrders: number;
  needsReview: number;
  waiting: number;
  confirmed: number;
}) {
  const items = [
    { label: "bookings", value: totalOrders, tone: "border-white/15 bg-white/5 text-white" },
    { label: "seats", value: totalSeats, tone: "border-cyan-400/30 bg-cyan-500/15 text-cyan-100" },
    { label: "unpaid", value: unpaidOrders, tone: "border-amber-400/30 bg-amber-500/15 text-amber-100" },
    { label: "needs review", value: needsReview, tone: "border-red-400/30 bg-red-500/15 text-red-100" },
    { label: "waiting", value: waiting, tone: "border-indigo-400/30 bg-indigo-500/15 text-indigo-100" },
    { label: "confirmed", value: confirmed, tone: "border-emerald-400/30 bg-emerald-500/15 text-emerald-100" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
      {items.map((item) => (
        <div key={item.label} className={`rounded-2xl border p-4 ${item.tone}`}>
          <div className="text-[11px] uppercase tracking-[0.16em]">{item.label}</div>
          <div className="mt-2 text-2xl font-black">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
