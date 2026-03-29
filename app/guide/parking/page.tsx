import Link from "next/link";
import { GuideLocalInfo } from "@/components/guide/GuideLocalInfo";
import { GuideVisualHero } from "@/components/guide/GuideVisualHero";
import { guideVisuals } from "@/lib/guideVisuals";

const SHARED_HREF = "/book/red-rocks-amphitheatre/custom/shared";
const PRIVATE_HREF = "/book/red-rocks-amphitheatre/private";

export const metadata = {
  title: "Red Rocks Parking Guide",
  description: "Parking strategy, exit risk, and the faster transport choice if you do not want to deal with lot chaos.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-surface px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <GuideVisualHero
          eyebrow={guideVisuals.parking.eyebrow}
          title="Red Rocks Parking Guide"
          copy="Parking matters, but the real decision is whether you want to deal with lots, stairs, and post-show gridlock at all."
          imageSrc={guideVisuals.parking.imageSrc}
          imageAlt={guideVisuals.parking.imageAlt}
          actions={
            <>
              <Link href={SHARED_HREF} className="btn-primary">
                Skip Parking, Book Shuttle
              </Link>
              <Link href={PRIVATE_HREF} className="btn-ghost">
                Book Private Ride
              </Link>
            </>
          }
        />

        <section className="mt-10 rounded-3xl border border-soft bg-surface-strong p-6 md:p-8">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-muted">Decision Bridge</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">You have two real options</h2>
          <p className="mt-3 max-w-3xl text-soft leading-relaxed">
            If you are reading a parking guide because you want the smoothest night possible, the move is not just choosing the right lot. It is deciding whether to park at all.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-3xl border border-soft bg-surface p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-300">Best Value</p>
              <h3 className="mt-3 text-2xl font-black tracking-tight">$59 Shuttle Seats</h3>
              <p className="mt-3 text-soft leading-relaxed">
                Best if you want fixed pricing, no parking-lot decisions, and a real ride home after the show.
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-soft">
                <li>No lot hunt</li>
                <li>No post-show surge pricing</li>
                <li>No driving after the show</li>
              </ul>
              <Link href={SHARED_HREF} className="btn-primary mt-6 inline-flex">
                Book Shuttle Seats
              </Link>
            </article>
            <article className="rounded-3xl border border-soft bg-surface p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-300">Best For Groups</p>
              <h3 className="mt-3 text-2xl font-black tracking-tight">Private SUV or Van</h3>
              <p className="mt-3 text-soft leading-relaxed">
                Best if your group wants one vehicle, one pickup plan, and the easiest possible arrival and return.
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-soft">
                <li>No split cars</li>
                <li>No lot walk for the whole group</li>
                <li>Cleaner exit after the show</li>
              </ul>
              <Link href={PRIVATE_HREF} className="btn-ghost mt-6 inline-flex">
                Book Private Ride
              </Link>
            </article>
          </div>
        </section>

        <div className="mt-10">
          <GuideLocalInfo variant="parking" />
        </div>

        <div className="mt-10 rounded-3xl border border-soft bg-surface-strong p-6">
          <h2 className="text-2xl font-black">What actually matters</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-soft">
            <li>Lots fill by time, not by good intentions. Earlier arrival changes everything.</li>
            <li>The best "experience" lot is not always the best exit lot.</li>
            <li>Your ride home matters as much as where you park on sold-out nights.</li>
            <li>If you do not want to deal with any of that, book the shuttle or private ride before the night starts.</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/red-rocks/transportation/shuttle-vs-driving" className="btn-ghost">
              Shuttle vs Driving
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
              <summary className="cursor-pointer font-black">Is parking free at Red Rocks?</summary>
              <p className="mt-2 leading-relaxed text-soft">Often yes for general events, but free parking still comes with arrival pressure, walking, and exit congestion.</p>
            </details>
            <details className="rounded-2xl border border-soft bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">What time should I arrive?</summary>
              <p className="mt-2 leading-relaxed text-soft">For busy nights, arrive well before doors or skip the lot strategy entirely and use a booked ride.</p>
            </details>
            <details className="rounded-2xl border border-soft bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">How do I avoid gridlock?</summary>
              <p className="mt-2 leading-relaxed text-soft">Pick your exit route before the show, or avoid the lot problem by using shuttle or private transportation.</p>
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
                  name: 'Is parking free at Red Rocks?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Often yes for general events, but free parking still comes with arrival pressure, walking, and exit congestion.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What time should I arrive?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'For busy nights, arrive well before doors or skip the lot strategy entirely and use a booked ride.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How do I avoid gridlock?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Pick your exit route before the show, or avoid the lot problem by using shuttle or private transportation.',
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
