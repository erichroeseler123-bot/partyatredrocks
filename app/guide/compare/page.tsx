import Image from "next/image";
import Link from "next/link";
import { GuideVisualHero } from "@/components/guide/GuideVisualHero";
import { guideVisuals } from "@/lib/guideVisuals";
import { curatedImages } from "@/lib/curatedImages";

const COMPARE_VISUALS = [
  {
    title: "Shared Shuttle",
    body: "Fixed pricing and one defined return plan beat improvising your way out with the crowd.",
    imageSrc: curatedImages.compareShared,
    imageAlt: "Shared shuttle transportation planning for Red Rocks",
  },
  {
    title: "Private SUV",
    body: "Best for small groups that want one vehicle, one pickup point, and a cleaner ride home.",
    imageSrc: curatedImages.compareSUV,
    imageAlt: "Private SUV service for Red Rocks groups",
  },
  {
    title: "Sprinter Van",
    body: "The van option keeps larger groups together without dropping back into generic fallback transport imagery.",
    imageSrc: curatedImages.compareVan,
    imageAlt: "Sprinter van transportation for Red Rocks groups",
  },
] as const;

export default function ShuttleComparison() {
  const comparisonSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Red Rocks Shuttle",
    provider: {
      "@type": "LocalBusiness",
      name: "Party at Red Rocks",
      address: "Golden, CO",
    },
    description: "Fixed-rate $59 shared shuttle and private SUV or van service from Denver and Golden to Red Rocks.",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "59.00",
      highPrice: "599.00",
      priceCurrency: "USD",
    },
  };

  return (
    <main className="min-h-screen bg-surface px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonSchema) }} />

        <GuideVisualHero
          eyebrow={guideVisuals.transportation.eyebrow}
          title="Comparing Red Rocks Ride Options"
          copy="Use the actual tradeoffs, not generic transport filler: fixed-price shuttle, private SUV, or van service depending on how your group wants to arrive and return."
          imageSrc={curatedImages.compareHero}
          imageAlt="Red Rocks arrival and transport planning context at sunset"
          actions={
            <>
              <Link href="/book/red-rocks-amphitheatre/custom/shared" className="btn-primary">
                Book Shuttle
              </Link>
              <Link href="/book/red-rocks-amphitheatre/private" className="btn-ghost">
                Book Private Ride
              </Link>
            </>
          }
        />

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {COMPARE_VISUALS.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-3xl border border-soft bg-surface-strong">
              <div className="relative aspect-[16/10] border-b border-soft">
                <Image src={item.imageSrc} alt={item.imageAlt} fill className="object-cover" sizes="(min-width: 1024px) 30vw, 100vw" />
              </div>
              <div className="p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-300">Compare</p>
                <h2 className="mt-3 text-2xl font-black tracking-tight">{item.title}</h2>
                <p className="mt-3 text-soft leading-relaxed">{item.body}</p>
              </div>
            </article>
          ))}
        </section>

        <div className="mt-10 overflow-x-auto rounded-3xl border border-soft shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface text-white">
                <th className="p-5">Feature</th>
                <th className="p-5">Party at Red Rocks</th>
                <th className="p-5">Broker/Public Vans</th>
                <th className="p-5">Rideshare (Uber/Lyft)</th>
              </tr>
            </thead>
            <tbody className="text-strong">
              <tr className="border-b border-soft">
                <td className="p-5 font-bold">Round-Trip Rate</td>
                <td className="p-5 font-bold text-green-400">$59 Fixed</td>
                <td className="p-5">$65 - $85</td>
                <td className="p-5 text-[#ffb07c]">Surge: $120 - $250</td>
              </tr>
              <tr className="border-b border-soft bg-white/5">
                <td className="p-5 font-bold">Drop-off Location</td>
                <td className="p-5 font-bold text-[#4cc9f0] underline">Top Circle (Row 70)</td>
                <td className="p-5">Upper North Lot</td>
                <td className="p-5">Jurassic Lot (1 mile hike)</td>
              </tr>
              <tr className="border-b border-soft">
                <td className="p-5 font-bold">Golden Pickup?</td>
                <td className="p-5 font-bold text-green-400">Yes (Trailhead)</td>
                <td className="p-5">No (Denver Only)</td>
                <td className="p-5">Variable</td>
              </tr>
              <tr>
                <td className="p-5 font-bold">Legal Authority</td>
                <td className="p-5 font-bold underline">PUC LL-02649</td>
                <td className="p-5">Mixed / Third-Party</td>
                <td className="p-5">Individual Contractors</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <section className="rounded-3xl border border-soft bg-surface-strong p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <h3 className="mb-4 text-2xl font-bold text-white">Why we bypass the broker trap</h3>
            <p className="text-soft leading-relaxed">
              Many popular shuttle sites are actually <strong>brokers</strong> who farm out your ride to third-party drivers.
              This often leads to ghost shuttles or late arrivals. At Party at Red Rocks, we run the actual plan with one operator and one point of contact.
            </p>
          </section>

          <section className="rounded-3xl border border-soft bg-surface-strong p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <h3 className="mb-4 text-2xl font-bold text-white">The Top Circle difference</h3>
            <p className="text-soft leading-relaxed">
              Most competitors drop you in the Upper North Lot. Our <Link href="/book/red-rocks-amphitheatre/private" className="text-[#4cc9f0] underline">private SUV service</Link> uses
              Top Circle access, putting your group closer to the venue and keeping the arrival cleaner.
            </p>
          </section>
        </div>

        <div className="mt-16 rounded-3xl border border-[#3df3ff]/30 bg-[linear-gradient(180deg,rgba(61,243,255,0.18),rgba(29,191,211,0.16))] p-12 text-center text-white shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <h2 className="mb-4 text-3xl font-black text-white">Ready for a smoother ride?</h2>
          <p className="mb-8 text-xl">Stop comparing and book the transport plan that actually fits the night.</p>
          <div className="flex flex-col justify-center gap-4 md:flex-row">
            <Link href="/book/red-rocks-amphitheatre/custom/shared" className="rounded-full bg-[#3df3ff] px-8 py-4 font-black text-[#08111e] transition hover:bg-[#62f6ff]">
              Shared Shuttle
            </Link>
            <Link href="/book/red-rocks-amphitheatre/private" className="brand-button-secondary inline-flex items-center justify-center rounded-full px-8 py-4 font-black">
              Private SUV or Van
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
