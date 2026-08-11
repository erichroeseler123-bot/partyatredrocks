import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { GuideLocalInfo } from "@/components/guide/GuideLocalInfo";
import { GuideVisualHero } from "@/components/guide/GuideVisualHero";
import { guideVisuals } from "@/lib/guideVisuals";
import { curatedImages } from "@/lib/curatedImages";
import { pageVisuals } from "@/lib/pageVisuals";

const PRIVATE_HREF = "/book/red-rocks-amphitheatre/private";
const LOGISTICS_VISUALS = [
  {
    title: "Pickup Window",
    body: "A clean night starts with a real arrival window and one clear plan for where the group meets.",
    imageSrc: curatedImages.logisticsPickup,
    imageAlt: "Friends meeting up before Red Rocks pickup at night",
  },
  {
    title: "Arrival Buffer",
    body: "Traffic, security, and stairs punish late starts more than almost any other part of the night.",
    imageSrc: curatedImages.logisticsArrival,
    imageAlt: "Red Rocks arrival flow and walking in before the show",
  },
  {
    title: "After The Encore",
    body: "The ride home should already be settled before the crowd surge begins.",
    imageSrc: curatedImages.logisticsExit,
    imageAlt: "Post-show crowd exit and return ride logistics at night",
  },
] as const;

const SITE = "https://www.partyatredrocks.com";

export const metadata: Metadata = {
  title: pageVisuals.logistics.title,
  description: pageVisuals.logistics.description,
  alternates: { canonical: `${SITE}/guide/show-night-strategy` },
  openGraph: {
    title: pageVisuals.logistics.title,
    description: pageVisuals.logistics.description,
    url: `${SITE}/guide/show-night-strategy`,
    type: "article",
    images: [{ url: pageVisuals.logistics.shareImage, alt: "Show-night planning at Red Rocks" }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageVisuals.logistics.title,
    description: pageVisuals.logistics.description,
    images: [pageVisuals.logistics.shareImage],
  },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-surface px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <GuideVisualHero
          eyebrow={guideVisuals.pickup.eyebrow}
          title="Show-Night Planning Guide"
          copy="Arrival windows, weather risk, and the exit plan that keeps the night moving smoothly. Then make the transportation decision before the crowd does it for you."
          imageSrc={curatedImages.logisticsHero}
          imageAlt="People walking up into Red Rocks for a concert at night"
          actions={
            <Link href={PRIVATE_HREF} className="btn-primary">
              Book Private Transportation
            </Link>
          }
        />

        <section className="mt-10 rounded-3xl border border-soft bg-surface-strong p-6 md:p-8">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-muted">Decision Bridge</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">The real show-night decision is how your group is getting home</h2>
          <p className="mt-3 max-w-3xl text-soft leading-relaxed">
            Weather, timing, and the encore rush all hit hardest when your ride plan is vague. Party at Red Rocks currently offers private transportation only, so your group keeps one vehicle and one plan for the night.
          </p>
          <article className="mt-6 rounded-3xl border border-soft bg-surface p-6">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-300">Private Service</p>
            <h3 className="mt-3 text-2xl font-black tracking-tight">Private Suburban or Van</h3>
            <p className="mt-3 text-soft leading-relaxed">Best if your group wants one vehicle, a clear pickup plan, and the return ride handled as part of the same booking.</p>
            <Link href={PRIVATE_HREF} className="btn-primary mt-6 inline-flex">
              View Private Vehicles
            </Link>
          </article>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {LOGISTICS_VISUALS.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-3xl border border-soft bg-surface-strong">
              <div className="relative aspect-[16/10] border-b border-soft">
                <Image src={item.imageSrc} alt={item.imageAlt} fill className="object-cover" sizes="(min-width: 1024px) 30vw, 100vw" />
              </div>
              <div className="p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-300">Show-Night Visual</p>
                <h2 className="mt-3 text-2xl font-black tracking-tight">{item.title}</h2>
                <p className="mt-3 text-soft leading-relaxed">{item.body}</p>
              </div>
            </article>
          ))}
        </section>

        <div className="mt-10">
          <GuideLocalInfo variant="show-night" />
        </div>

        <div className="mt-10 rounded-3xl border border-soft bg-surface-strong p-6">
          <h2 className="text-2xl font-black">What actually matters</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-soft">
            <li>The busiest points of the night are arrival congestion and the ride home after the show.</li>
            <li>Weather and temperature swings can change how much buffer time you need.</li>
            <li>Have a meeting point and backup plan before the show starts.</li>
            <li>If you book private transportation, use the confirmed pickup and return instructions for your group.</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/red-rocks/transportation" className="btn-ghost">
              Transportation Guide
            </Link>
            <Link href={PRIVATE_HREF} className="btn-primary">
              Book Private Transportation
            </Link>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-black">Quick FAQ</h2>
          <div className="mt-4 space-y-3">
            <details className="rounded-2xl border border-soft bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">What time should I plan to leave?</summary>
              <p className="mt-2 leading-relaxed text-soft">Plan around the encore plus the crowd surge. If you have private transportation booked, follow the confirmed return plan for your ride.</p>
            </details>
            <details className="rounded-2xl border border-soft bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">Where should we meet after the show?</summary>
              <p className="mt-2 leading-relaxed text-soft">Use the meeting instructions confirmed for your private ride and make sure everyone in the group has the same plan before the show.</p>
            </details>
            <details className="rounded-2xl border border-soft bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">What if it is cold or snowing?</summary>
              <p className="mt-2 leading-relaxed text-soft">Assume longer movement and exit times, bring warm layers, and keep the ride-home plan clear before the show begins.</p>
            </details>
          </div>
        </div>
      </div>
    </main>
  );
}
