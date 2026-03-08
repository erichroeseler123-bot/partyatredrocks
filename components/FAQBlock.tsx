import type { FaqRow } from "@/lib/faqs/schema";

export default function FAQBlock({
  title = "FAQ",
  rows,
}: {
  title?: string;
  rows: FaqRow[];
}) {
  if (!rows.length) return null;

  return (
    <section className="comic-panel" style={{ marginTop: 14 }}>
      <div className="comic-tag">{title}</div>
      <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
        {rows.map((row) => (
          <details key={row.id} className="comic-panel">
            <summary className="comic-h3" style={{ cursor: "pointer" }}>
              {row.question}
            </summary>
            <p className="comic-copy" style={{ marginTop: 8 }}>
              {row.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
