import Link from "next/link";

export const metadata = {
  title: "Best Parking Lots at Red Rocks",
  description: "Which lots fill first, what’s closest to entries, and how to park for a faster exit.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-surface text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500">
          Parking • Lots
        </div>

        <h1 className="mt-3 text-5xl md:text-6xl font-black tracking-tight">
          Best Parking Lots at Red Rocks
        </h1>

        <p className="mt-5 text-lg text-zinc-300 leading-relaxed">
          Which lots fill first, what’s closest to entries, and how to park for a faster exit.
        </p>

        <div className="mt-5 text-sm text-zinc-500">
          Last updated: Feb 11, 2026
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-surface-strong p-6">
          <h2 className="text-2xl font-black">What actually matters</h2>
          <ul className="mt-4 space-y-2 text-zinc-300 leading-relaxed list-disc pl-5">
              <li>Early arrival = better options. Late arrival = whatever’s left.</li>
              <li>Closest lots can be slowest to exit if everyone funnels the same way.</li>
              <li>Parking for exit means choosing a route, not just a spot.</li>
              <li>If you’re with a group, pick a meet point before you separate.</li>
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/book-shuttle" className="btn-primary">
            Book Shuttle — $59/pp →
          </Link>
          <Link
            href="/guide/parking"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            Back to Parking →
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-black">Quick FAQ</h2>
          <div className="mt-4 space-y-3">
            <details className="rounded-2xl border border-white/10 bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">Which lot is closest?</summary>
              <p className="mt-2 text-zinc-300 leading-relaxed">Closest varies by where you enter—arriving early is what actually determines proximity.</p>
            </details>
            <details className="rounded-2xl border border-white/10 bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">How do I get out faster?</summary>
              <p className="mt-2 text-zinc-300 leading-relaxed">Choose a departure route before the show ends and avoid the biggest crowd funnels.</p>
            </details>
            <details className="rounded-2xl border border-white/10 bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">Is it okay to tailgate?</summary>
              <p className="mt-2 text-zinc-300 leading-relaxed">Follow venue rules for the event—some nights are stricter than others.</p>
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
        "name": 'Which lot is closest?',
        "acceptedAnswer": {"@type":"Answer","text": 'Closest varies by where you enter—arriving early is what actually determines proximity.'}
      },
      {
        "@type": "Question",
        "name": 'How do I get out faster?',
        "acceptedAnswer": {"@type":"Answer","text": 'Choose a departure route before the show ends and avoid the biggest crowd funnels.'}
      },
      {
        "@type": "Question",
        "name": 'Is it okay to tailgate?',
        "acceptedAnswer": {"@type":"Answer","text": 'Follow venue rules for the event—some nights are stricter than others.'}
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
