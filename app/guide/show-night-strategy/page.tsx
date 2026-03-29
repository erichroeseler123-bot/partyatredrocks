import Link from "next/link";
import { GuideLocalInfo } from "@/components/guide/GuideLocalInfo";
import { GuideVisualHero } from "@/components/guide/GuideVisualHero";
import { guideVisuals } from "@/lib/guideVisuals";

const SHARED_HREF = "/book/red-rocks-amphitheatre/custom/shared";
const PRIVATE_HREF = "/book/red-rocks-amphitheatre/private";

export const metadata = {
  title: "Show-Night Planning Guide",
  description: "Arrival windows, weather risk, exit timing, and the transport choice that keeps the whole night clean.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-surface px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <GuideVisualHero
          eyebrow={guideVisuals.pickup.eyebrow}
          title="Show-Night Planning Guide"
          copy="Arrival windows, weather risk, and the exit plan that keeps the night moving smoothly. Then make the transport decision before the crowd does it for you."
          imageSrc={guideVisuals.pickup.imageSrc}
          imageAlt={guideVisuals.pickup.imageAlt}
          actions={
            <>
              <Link href={SHARED_HREF} className="btn-primary">
                Book Shuttle Seats
              </Link>
              <Link href={PRIVATE_HREF} className="btn-ghost">
                Book Private Ride
              </Link>
            </>
          }
        />

        <section className="mt-10 rounded-3xl border border-soft bg-surface-strong p-6 md:p-8">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-muted">Decision Bridge</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">The real show-night decision is how you are getting home</h2>
          <p className="mt-3 max-w-3xl text-soft leading-relaxed">
            Weather, timing, and the encore rush all hit hardest when your ride plan is vague. Lock the transport choice in now, then the rest of the night gets easier.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-3xl border border-soft bg-surface p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-300">Best Value</p>
              <h3 className="mt-3 text-2xl font-black tracking-tight">$59 Shuttle Seats</h3>
              <p className="mt-3 text-soft leading-relaxed">Best if you want a fixed-price ride with a real pickup and return plan already set.</p>
              <Link href={SHARED_HREF} className="btn-primary mt-6 inline-flex">
                Book Shuttle
              </Link>
            </article>
            <article className="rounded-3xl border border-soft bg-surface p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-300">Best For Groups</p>
              <h3 className="mt-3 text-2xl font-black tracking-tight">Private SUV or Van</h3>
              <p className="mt-3 text-soft leading-relaxed">Best if your group wants one vehicle, flexible timing, and no uncertainty after the show.</p>
              <Link href={PRIVATE_HREF} className="btn-ghost mt-6 inline-flex">
                Book Private Ride
              </Link>
            </article>
          </div>
        </section>

        <div className="mt-10">
          <GuideLocalInfo variant="show-night" />
        </div>

        <div className="mt-10 rounded-3xl border border-soft bg-surface-strong p-6">
          <h2 className="text-2xl font-black">What actually matters</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-soft">
            <li>The busiest points of the night are arrival congestion and the ride home after the show.</li>
            <li>Weather and temperature swings are the silent killers of comfort.</li>
            <li>Have a meeting point and backup plan before the show starts.</li>
            <li>Leaving smart matters more than arriving smart on packed nights.</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/red-rocks/transportation/is-shuttle-worth-it" className="btn-ghost">
              Is the Shuttle Worth It?
            </Link>
            <Link href={SHARED_HREF} className="btn-primary">
              Book Shuttle
            </Link>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-black">Quick FAQ</h2>
          <div className="mt-4 space-y-3">
            <details className="rounded-2xl border border-soft bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">What time should I plan to leave?</summary>
              <p className="mt-2 leading-relaxed text-soft">Plan around the encore plus the crowd surge. Or book a ride now and stop making the whole night depend on your exit improvisation.</p>
            </details>
            <details className="rounded-2xl border border-soft bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">Where should we meet after the show?</summary>
              <p className="mt-2 leading-relaxed text-soft">Pick a specific landmark and stick to it. If you want the simplest version of this, use a booked shuttle or private ride.</p>
            </details>
            <details className="rounded-2xl border border-soft bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">What if it is cold or snowing?</summary>
              <p className="mt-2 leading-relaxed text-soft">Assume longer exit times, bring warm layers, and do not leave the ride-home plan unresolved.</p>
            </details>
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What time should I plan to leave?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Plan around the encore plus the crowd surge. Or book a ride now and stop making the whole night depend on your exit improvisation.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Where should we meet after the show?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Pick a specific landmark and stick to it. If you want the simplest version of this, use a booked shuttle or private ride.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What if it is cold or snowing?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Assume longer exit times, bring warm layers, and do not leave the ride-home plan unresolved.',
                  },
                },
              ],
            }),
          }}
        />
      </div>
    </main>
  );
}
