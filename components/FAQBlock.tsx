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
    <section className="mt-10 rounded-3xl border border-soft bg-surface-strong p-6 md:p-8">
      <h2 className="text-2xl font-black tracking-tight text-strong">{title}</h2>
      <div className="mt-5 grid gap-3">
        {rows.map((row) => (
          <details key={row.id} className="rounded-2xl border border-soft bg-surface/30 p-5">
            <summary className="cursor-pointer text-base font-black tracking-tight text-strong">
              {row.question}
            </summary>
            <p className="mt-3 text-soft leading-relaxed">
              {row.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
