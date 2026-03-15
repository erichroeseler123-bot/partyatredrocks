import Link from "next/link";

export const metadata = {
  title: "Red Rocks Policies Guide",
  description: "Bag policy, entry rules, and the practical version of what actually gets enforced at the gate.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-surface text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-[11px] font-black uppercase tracking-[0.25em] text-muted">
          Policies
        </div>

        <h1 className="mt-3 text-5xl md:text-6xl font-black tracking-tight">
          Red Rocks Policies Guide
        </h1>

        <p className="mt-5 text-lg text-soft leading-relaxed">
          Bag policy, entry rules, and the practical version of what actually gets enforced at the gate.
        </p>

        <div className="mt-5 text-sm text-muted">
          Last updated: Feb 11, 2026
        </div>

        <div className="mt-10 rounded-3xl border border-soft bg-surface-strong p-6">
          <h2 className="text-2xl font-black">What actually matters</h2>
          <ul className="mt-4 space-y-2 text-soft leading-relaxed list-disc pl-5">
              <li>Rule text and enforcement don’t always match — plan for strict enforcement.</li>
              <li>Small + simple beats clever every time at the gate.</li>
              <li>Anything that slows screening increases your chance of being turned back.</li>
              <li>If you’re unsure, don’t bring it.</li>
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/book" className="btn-primary">
            Book a Ride
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
              <summary className="cursor-pointer font-black">What bags usually pass?</summary>
              <p className="mt-2 text-soft leading-relaxed">Small, simple bags that are easy to screen. Avoid complicated pockets and oversized bags.</p>
            </details>
            <details className="rounded-2xl border border-soft bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">Will they really turn me away?</summary>
              <p className="mt-2 text-soft leading-relaxed">Yes—especially on busy nights when screening is strict and lines are long.</p>
            </details>
            <details className="rounded-2xl border border-soft bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">What’s the safest move?</summary>
              <p className="mt-2 text-soft leading-relaxed">Bring as little as possible.</p>
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
        "name": 'What bags usually pass?',
        "acceptedAnswer": {"@type":"Answer","text": 'Small, simple bags that are easy to screen. Avoid complicated pockets and oversized bags.'}
      },
      {
        "@type": "Question",
        "name": 'Will they really turn me away?',
        "acceptedAnswer": {"@type":"Answer","text": 'Yes—especially on busy nights when screening is strict and lines are long.'}
      },
      {
        "@type": "Question",
        "name": 'What’s the safest move?',
        "acceptedAnswer": {"@type":"Answer","text": 'Bring as little as possible.'}
      }
            ],
          }),
        }}
      />

        <footer className="mt-16 pt-10 border-t border-soft text-sm text-muted">
          Bring as little as possible, and plan your ride before show night.
        </footer>
      </div>
    </main>
  );
}
