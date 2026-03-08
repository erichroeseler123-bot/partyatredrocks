type ComparisonRow = {
  mode: string;
  reliability: string;
  cost: string;
  bestFor: string;
};

type Props = {
  title: string;
  rows: ComparisonRow[];
};

export default function TransportComparisonTable({ title, rows }: Props) {
  return (
    <section className="comic-panel" style={{ marginTop: 16 }}>
      <div className="comic-tag">{title}</div>
      <div className="overflow-x-auto" style={{ marginTop: 10 }}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-2 pr-3">Mode</th>
              <th className="py-2 pr-3">Reliability</th>
              <th className="py-2 pr-3">Cost Profile</th>
              <th className="py-2 pr-3">Best For</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.mode} className="border-b border-white/5 align-top">
                <td className="py-2 pr-3 font-semibold text-white/90">{row.mode}</td>
                <td className="py-2 pr-3 text-white/80">{row.reliability}</td>
                <td className="py-2 pr-3 text-white/80">{row.cost}</td>
                <td className="py-2 pr-3 text-white/80">{row.bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
