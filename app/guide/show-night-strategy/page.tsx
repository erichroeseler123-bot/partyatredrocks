import Link from "next/link";
import { GuideLocalInfo } from "@/components/guide/GuideLocalInfo";
import { GuideVisualHero } from "@/components/guide/GuideVisualHero";
import { guideVisuals } from "@/lib/guideVisuals";

export const metadata = {
  title: "Show-Night Planning Guide",
  description: "Arrival windows, weather risk, and the exit plan that keeps the night moving smoothly.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-surface text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <GuideVisualHero
          eyebrow={guideVisuals.pickup.eyebrow}
          title="Show-Night Planning Guide"
          copy="Arrival windows, weather risk, and the exit plan that keeps the night moving smoothly."
          imageSrc={guideVisuals.pickup.imageSrc}
          imageAlt={guideVisuals.pickup.imageAlt}
          actions={
            <>
              <Link href="/book" className="btn-primary">
                Book Shuttle — $59/pp →
              </Link>
              <Link href="/guide" className="btn-ghost">
                Back to Guides →
              </Link>
            </>
          }
        />

        <div className="mt-10">
          <GuideLocalInfo />
        </div>

        <div className="mt-10 rounded-3xl border border-soft bg-surface-strong p-6">
          <h2 className="text-2xl font-black">What actually matters</h2>
          <ul className="mt-4 space-y-2 text-soft leading-relaxed list-disc pl-5">
              <li>The busiest points of the night are arrival congestion and the ride home after the encore.</li>
              <li>Weather and temperature swings are the silent killers of comfort.</li>
              <li>Have a meeting point and backup plan before the show starts.</li>
              <li>Leaving smart matters more than arriving smart on packed nights.</li>
          </ul>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-black">Quick FAQ</h2>
          <div className="mt-4 space-y-3">
            <details className="rounded-2xl border border-soft bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">What time should I plan to leave?</summary>
              <p className="mt-2 text-soft leading-relaxed">Plan around the encore + crowd surge. Your best window depends on whether you prioritize speed or the full ending.</p>
            </details>
            <details className="rounded-2xl border border-soft bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">Where should we meet after the show?</summary>
              <p className="mt-2 text-soft leading-relaxed">Pick a specific landmark and stick to it—service and crowds make improvising fail.</p>
            </details>
            <details className="rounded-2xl border border-soft bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">What if it’s cold or snowing?</summary>
              <p className="mt-2 text-soft leading-relaxed">Assume longer exit times and plan warm layers + a clear pickup plan.</p>
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

        <footer className="mt-16 pt-10 border-t border-soft text-sm text-muted">
          Use this guide to set a clear arrival, meetup, and ride-home plan before the show starts.
        </footer>
      </div>
    </main>
  );
}
