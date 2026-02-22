import Link from "next/link";

export const metadata = {
  title: "Show-Night Strategy Guide",
  description: "Arrival windows, crowd flow, weather risk, and the exit plan that prevents ‘stuck at Red Rocks’ syndrome.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-surface text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500">
          Strategy
        </div>

        <h1 className="mt-3 text-5xl md:text-6xl font-black tracking-tight">
          Show-Night Strategy Guide
        </h1>

        <p className="mt-5 text-lg text-zinc-300 leading-relaxed">
          Arrival windows, crowd flow, weather risk, and the exit plan that prevents ‘stuck at Red Rocks’ syndrome.
        </p>

        <div className="mt-5 text-sm text-zinc-500">
          Last updated: Feb 11, 2026
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-surface-strong p-6">
          <h2 className="text-2xl font-black">What actually matters</h2>
          <ul className="mt-4 space-y-2 text-zinc-300 leading-relaxed list-disc pl-5">
              <li>The show-night ‘pain’ is predictable: arrival congestion + post-show extraction.</li>
              <li>Weather and temperature swings are the silent killers of comfort.</li>
              <li>Have a meeting point and backup plan before the show starts.</li>
              <li>Leaving smart matters more than arriving smart on packed nights.</li>
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/book-shuttle" className="btn-primary">
            Book Shuttle — $59/pp →
          </Link>
          <Link
            href="/guide"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            Back to Guides →
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-black">Quick FAQ</h2>
          <div className="mt-4 space-y-3">
            <details className="rounded-2xl border border-white/10 bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">What time should I plan to leave?</summary>
              <p className="mt-2 text-zinc-300 leading-relaxed">Plan around the encore + crowd surge. Your best window depends on whether you prioritize speed or the full ending.</p>
            </details>
            <details className="rounded-2xl border border-white/10 bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">Where should we meet after the show?</summary>
              <p className="mt-2 text-zinc-300 leading-relaxed">Pick a specific landmark and stick to it—service and crowds make improvising fail.</p>
            </details>
            <details className="rounded-2xl border border-white/10 bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">What if it’s cold or snowing?</summary>
              <p className="mt-2 text-zinc-300 leading-relaxed">Assume longer exit times and plan warm layers + a clear pickup plan.</p>
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
        "name": 'What time should I plan to leave?',
        "acceptedAnswer": {"@type":"Answer","text": 'Plan around the encore + crowd surge. Your best window depends on whether you prioritize speed or the full ending.'}
      },
      {
        "@type": "Question",
        "name": 'Where should we meet after the show?',
        "acceptedAnswer": {"@type":"Answer","text": 'Pick a specific landmark and stick to it—service and crowds make improvising fail.'}
      },
      {
        "@type": "Question",
        "name": 'What if it’s cold or snowing?',
        "acceptedAnswer": {"@type":"Answer","text": 'Assume longer exit times and plan warm layers + a clear pickup plan.'}
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
