import Link from "next/link";

export const metadata = {
  title: "Shuttle vs Uber to Red Rocks",
  description: "A real-world comparison: price, reliability, pickup friction, and how people get stranded after the encore.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-surface text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500">
          Transportation • Comparison
        </div>

        <h1 className="mt-3 text-5xl md:text-6xl font-black tracking-tight">
          Shuttle vs Uber to Red Rocks
        </h1>

        <p className="mt-5 text-lg text-zinc-300 leading-relaxed">
          A real-world comparison: price, reliability, pickup friction, and how people get stranded after the encore.
        </p>

        <div className="mt-5 text-sm text-zinc-500">
          Last updated: Feb 11, 2026
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-surface-strong p-6">
          <h2 className="text-2xl font-black">What actually matters</h2>
          <ul className="mt-4 space-y-2 text-zinc-300 leading-relaxed list-disc pl-5">
              <li>Uber/Lyft: best for flexible arrival; worst for post-show reliability.</li>
              <li>Shuttle: best for predictable return; requires showing up on time.</li>
              <li>Private SUV: best for control + comfort; higher cost but fewer failure modes.</li>
              <li>Your biggest risk is the post-show surge + pickup enforcement window.</li>
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/book-shuttle" className="btn-primary">
            Book Shuttle — $59/pp →
          </Link>
          <Link
            href="/guide/transportation"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            Back to Transportation →
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-black">Quick FAQ</h2>
          <div className="mt-4 space-y-3">
            <details className="rounded-2xl border border-white/10 bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">Why does rideshare fail after the show?</summary>
              <p className="mt-2 text-zinc-300 leading-relaxed">Everyone requests at once, traffic patterns compress, and pickups are constrained to specific zones.</p>
            </details>
            <details className="rounded-2xl border border-white/10 bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">Is a shuttle worth it?</summary>
              <p className="mt-2 text-zinc-300 leading-relaxed">If you value certainty and a guaranteed ride back, yes.</p>
            </details>
            <details className="rounded-2xl border border-white/10 bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">What’s the best choice for groups?</summary>
              <p className="mt-2 text-zinc-300 leading-relaxed">Shuttle for budget + simplicity; private SUV for control and comfort.</p>
            </details>
          </div>
        </div>


      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
      {
        "@type": "Question",
        "name": 'Why does rideshare fail after the show?',
        "acceptedAnswer": {"@type":"Answer","text": 'Everyone requests at once, traffic patterns compress, and pickups are constrained to specific zones.'}
      },
      {
        "@type": "Question",
        "name": 'Is a shuttle worth it?',
        "acceptedAnswer": {"@type":"Answer","text": 'If you value certainty and a guaranteed ride back, yes.'}
      },
      {
        "@type": "Question",
        "name": 'What’s the best choice for groups?',
        "acceptedAnswer": {"@type":"Answer","text": 'Shuttle for budget + simplicity; private SUV for control and comfort.'}
      }
            ],
          }),
        }}
      />

        <footer className="mt-16 pt-10 border-t border-white/10 text-sm text-zinc-400">
          This is the authority layer: no fluff, no hype — just show-night reality and what works.
        </footer>
      </div>
    </main>
  );
}
