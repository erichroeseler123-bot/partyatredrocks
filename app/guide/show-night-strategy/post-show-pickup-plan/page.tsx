import Link from "next/link";

export const metadata = {
  title: "Post-Show Pickup Plan (Don’t Get Stranded)",
  description: "Where to go, what to text, and how to avoid the post-encore chaos window that strands people.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-surface text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500">
          Strategy • Exit
        </div>

        <h1 className="mt-3 text-5xl md:text-6xl font-black tracking-tight">
          Post-Show Pickup Plan (Don’t Get Stranded)
        </h1>

        <p className="mt-5 text-lg text-zinc-300 leading-relaxed">
          Where to go, what to text, and how to avoid the post-encore chaos window that strands people.
        </p>

        <div className="mt-5 text-sm text-zinc-500">
          Last updated: Feb 11, 2026
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-surface-strong p-6">
          <h2 className="text-2xl font-black">What actually matters</h2>
          <ul className="mt-4 space-y-2 text-zinc-300 leading-relaxed list-disc pl-5">
              <li>Decide: speed exit vs full encore. You can’t optimize both.</li>
              <li>Pick a meet point that’s specific and easy to describe.</li>
              <li>Text instructions before the encore starts (service can be unreliable).</li>
              <li>Have a fallback: warm place, backup pickup, or shuttle plan.</li>
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/book-shuttle" className="btn-primary">
            Book Shuttle — $59/pp →
          </Link>
          <Link
            href="/guide/show-night-strategy"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            Back to Strategy →
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-black">Quick FAQ</h2>
          <div className="mt-4 space-y-3">
            <details className="rounded-2xl border border-white/10 bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">What’s the #1 mistake people make?</summary>
              <p className="mt-2 text-zinc-300 leading-relaxed">Waiting until after encore to decide where to meet.</p>
            </details>
            <details className="rounded-2xl border border-white/10 bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">What should I text my driver/friends?</summary>
              <p className="mt-2 text-zinc-300 leading-relaxed">A landmark + ETA + backup meet point.</p>
            </details>
            <details className="rounded-2xl border border-white/10 bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">How long does it take to get out?</summary>
              <p className="mt-2 text-zinc-300 leading-relaxed">Depends on crowd + weather + enforcement. Assume it takes longer on sold-out nights.</p>
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
        "name": 'What’s the #1 mistake people make?',
        "acceptedAnswer": {"@type":"Answer","text": 'Waiting until after encore to decide where to meet.'}
      },
      {
        "@type": "Question",
        "name": 'What should I text my driver/friends?',
        "acceptedAnswer": {"@type":"Answer","text": 'A landmark + ETA + backup meet point.'}
      },
      {
        "@type": "Question",
        "name": 'How long does it take to get out?',
        "acceptedAnswer": {"@type":"Answer","text": 'Depends on crowd + weather + enforcement. Assume it takes longer on sold-out nights.'}
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
