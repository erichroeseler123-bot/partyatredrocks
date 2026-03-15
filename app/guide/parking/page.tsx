import Link from "next/link";

export const metadata = {
  title: "Red Rocks Parking Guide",
  description: "Which lots fill first, how to reduce walking, and how to avoid the exit gridlock that traps people for an hour.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-surface text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-[11px] font-black uppercase tracking-[0.25em] text-muted">
          Parking
        </div>

        <h1 className="mt-3 text-5xl md:text-6xl font-black tracking-tight">
          Red Rocks Parking Guide
        </h1>

        <p className="mt-5 text-lg text-soft leading-relaxed">
          Which lots fill first, how to reduce walking, and how to avoid the exit gridlock that traps people for an hour.
        </p>

        <div className="mt-5 text-sm text-muted">
          Last updated: Feb 11, 2026
        </div>

        <div className="mt-10 rounded-3xl border border-soft bg-surface-strong p-6">
          <h2 className="text-2xl font-black">What actually matters</h2>
          <ul className="mt-4 space-y-2 text-soft leading-relaxed list-disc pl-5">
              <li>Lots fill by time, not by good intentions—earlier arrival changes everything.</li>
              <li>The best ‘experience’ lot isn’t always the best ‘exit’ lot.</li>
              <li>Your way out matters as much as where you park on sold-out nights.</li>
              <li>If you want a fast exit, park with your departure route in mind.</li>
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/book" className="btn-primary">
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
              <summary className="cursor-pointer font-black">Is parking free at Red Rocks?</summary>
              <p className="mt-2 text-soft leading-relaxed">Often yes for general events, but rules can vary by event; plan to arrive early regardless.</p>
            </details>
            <details className="rounded-2xl border border-soft bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">What time should I arrive?</summary>
              <p className="mt-2 text-soft leading-relaxed">For busy nights, arriving well before doors gives you better lot selection and less stress.</p>
            </details>
            <details className="rounded-2xl border border-soft bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">How do I avoid gridlock?</summary>
              <p className="mt-2 text-soft leading-relaxed">Pick an exit route before the show, and don’t wait until the crowd surge to move.</p>
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
        "name": 'Is parking free at Red Rocks?',
        "acceptedAnswer": {"@type":"Answer","text": 'Often yes for general events, but rules can vary by event; plan to arrive early regardless.'}
      },
      {
        "@type": "Question",
        "name": 'What time should I arrive?',
        "acceptedAnswer": {"@type":"Answer","text": 'For busy nights, arriving well before doors gives you better lot selection and less stress.'}
      },
      {
        "@type": "Question",
        "name": 'How do I avoid gridlock?',
        "acceptedAnswer": {"@type":"Answer","text": 'Pick an exit route before the show, and don’t wait until the crowd surge to move.'}
      }
            ],
          }),
        }}
      />

        <footer className="mt-16 pt-10 border-t border-soft text-sm text-muted">
          Use this guide to decide whether parking or a shuttle makes more sense for your night.
        </footer>
      </div>
    </main>
  );
}
