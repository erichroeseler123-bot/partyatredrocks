import Link from "next/link";

export const metadata = {
  title: "Red Rocks Transportation Guide",
  description: "Shuttle vs rideshare, pricing reality, and the most reliable way to get out after the encore.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-surface text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-[11px] font-black uppercase tracking-[0.25em] text-muted">
          Transportation
        </div>

        <h1 className="mt-3 text-5xl md:text-6xl font-black tracking-tight">
          Red Rocks Transportation Guide
        </h1>

        <p className="mt-5 text-lg text-soft leading-relaxed">
          Shuttle vs rideshare, pricing reality, and the most reliable way to get out after the encore.
        </p>

        <div className="mt-5 text-sm text-muted">
          Last updated: Feb 11, 2026
        </div>

        <div className="mt-10 rounded-3xl border border-soft bg-surface-strong p-6">
          <h2 className="text-2xl font-black">What actually matters</h2>
          <ul className="mt-4 space-y-2 text-soft leading-relaxed list-disc pl-5">
              <li>Rideshare is fine early — it fails most often after the show (surge + chaos + enforcement).</li>
              <li>Your real risk is post-show extraction, not getting there.</li>
              <li>Fixed-route shuttles win on predictability; private SUVs win on control.</li>
              <li>If you drive, plan your exit route before doors open.</li>
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/book-shuttle" className="btn-primary">
            Book Shuttle — $59/pp →
          </Link>
          <Link
            href="/guide"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-soft pill hover:pill-soft transition"
          >
            Back to Guides →
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-black">Quick FAQ</h2>
          <div className="mt-4 space-y-3">
            <details className="rounded-2xl border border-soft bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">Is Uber/Lyft reliable after the show?</summary>
              <p className="mt-2 text-soft leading-relaxed">It can be, but it’s the highest-failure window due to surge, traffic patterns, and pickup enforcement.</p>
            </details>
            <details className="rounded-2xl border border-soft bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">What’s the most reliable option?</summary>
              <p className="mt-2 text-soft leading-relaxed">A scheduled shuttle or pre-arranged private pickup with a defined meet point.</p>
            </details>
            <details className="rounded-2xl border border-soft bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">Where is the main pickup chaos?</summary>
              <p className="mt-2 text-soft leading-relaxed">Lower areas and rideshare zones right after encore—timing and meet points matter.</p>
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
        "name": 'Is Uber/Lyft reliable after the show?',
        "acceptedAnswer": {"@type":"Answer","text": 'It can be, but it’s the highest-failure window due to surge, traffic patterns, and pickup enforcement.'}
      },
      {
        "@type": "Question",
        "name": 'What’s the most reliable option?',
        "acceptedAnswer": {"@type":"Answer","text": 'A scheduled shuttle or pre-arranged private pickup with a defined meet point.'}
      },
      {
        "@type": "Question",
        "name": 'Where is the main pickup chaos?',
        "acceptedAnswer": {"@type":"Answer","text": 'Lower areas and rideshare zones right after encore—timing and meet points matter.'}
      }
            ],
          }),
        }}
      />

        <footer className="mt-16 pt-10 border-t border-soft text-sm text-muted">
          This is the authority layer: no fluff, no hype — just show-night reality and what works.
        </footer>
      </div>
    </main>
  );
}
