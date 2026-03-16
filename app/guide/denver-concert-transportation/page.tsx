import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { GuideLocalInfo } from "@/components/guide/GuideLocalInfo";
import { GuideVisualHero } from "@/components/guide/GuideVisualHero";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";
import { guideVisuals } from "@/lib/guideVisuals";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Denver Concert Transportation Guide",
  description:
    "Plan concert transportation across Denver and Red Rocks: compare ride options, review venue guides, and book the right ride for the night.",
  alternates: {
    canonical: "/guide/denver-concert-transportation",
  },
};

const venueLinks = [
  { href: "/venues/red-rocks-amphitheatre", label: "Red Rocks Amphitheatre" },
  { href: "/venues/mission-ballroom", label: "Mission Ballroom" },
  { href: "/venues/fiddlers-green-amphitheatre", label: "Fiddler's Green Amphitheatre" },
  { href: "/venues/fillmore-auditorium", label: "Fillmore Auditorium" },
  { href: "/venues/gothic-theatre", label: "Gothic Theatre" },
  { href: "/venues/cervantes-masterpiece", label: "Cervantes' Masterpiece Ballroom" },
  { href: "/venues/ogden-theatre", label: "Ogden Theatre" },
  { href: "/venues/ball-arena", label: "Ball Arena" },
] as const;

const rideRows = [
  {
    rideType: "Shared Shuttle",
    bestFor: "Predictable round-trip service",
    tradeoff: "Less flexibility on departure timing",
  },
  {
    rideType: "Private SUV",
    bestFor: "Small groups with tighter schedule control",
    tradeoff: "Higher upfront price",
  },
  {
    rideType: "10 Passenger Van",
    bestFor: "Mid-size groups moving together",
    tradeoff: "Best when booked ahead",
  },
  {
    rideType: "24 Passenger Party Bus",
    bestFor: "Large group celebration nights",
    tradeoff: "Works best when reserved early",
  },
] as const;

export default async function DenverConcertTransportationGuidePage() {
  const faqRows = await getFaqRowsWithGlobal("guide/denver-concert-transportation.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Guide", item: `${SITE}/guide` },
      { "@type": "ListItem", position: 3, name: "Denver Concert Transportation", item: `${SITE}/guide/denver-concert-transportation` },
    ],
  };

  return (
    <main className="min-h-screen bg-surface px-6 py-20 text-white">
      <section className="mx-auto max-w-5xl">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <GuideVisualHero
          eyebrow={guideVisuals.transportation.eyebrow}
          title="Denver Concert Transportation"
          copy="Review major venues, compare ride types, and choose the best way to get to and from concert nights around Denver and Red Rocks."
          imageSrc={guideVisuals.transportation.imageSrc}
          imageAlt={guideVisuals.transportation.imageAlt}
          actions={
            <>
              <Link className="btn-primary" href="/book">
                Book a Ride
              </Link>
              <Link className="btn-ghost" href="/week">
                Upcoming Shows
              </Link>
            </>
          }
        />

        <section className="mt-10">
          <GuideLocalInfo variant="transportation" />
        </section>

        <section className="mt-10 rounded-3xl border border-soft bg-surface-strong p-6 md:p-8">
          <h2 className="text-2xl font-black tracking-tight">Venue guides</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {venueLinks.map((v) => (
              <Link key={v.href} href={v.href} className="rounded-3xl border border-soft bg-surface/30 p-6 no-underline transition hover:-translate-y-1 hover:border-white/20">
                <h3 className="text-xl font-black tracking-tight text-strong">{v.label}</h3>
                <p className="mt-3 text-soft leading-relaxed">Venue details, upcoming shows, and ride links.</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-soft bg-surface-strong p-6 md:p-8">
          <h2 className="text-2xl font-black tracking-tight">Ride options</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm text-soft">
              <thead>
                <tr className="border-b border-soft text-strong">
                  <th className="py-2 pr-3 font-black">Ride type</th>
                  <th className="py-2 pr-3 font-black">Best for</th>
                  <th className="py-2 pr-3 font-black">Main tradeoff</th>
                </tr>
              </thead>
              <tbody>
                {rideRows.map((row) => (
                  <tr key={row.rideType} className="border-b border-white/5">
                    <td className="py-3 pr-3 font-semibold text-strong">{row.rideType}</td>
                    <td className="py-3 pr-3">{row.bestFor}</td>
                    <td className="py-3 pr-3">{row.tradeoff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <article className="rounded-3xl border border-soft bg-surface-strong p-6">
            <h2 className="text-2xl font-black tracking-tight">Solo or pair</h2>
            <p className="mt-3 text-soft leading-relaxed">
              Shared shuttle seats are usually the best mix of price and reliability.
            </p>
          </article>
          <article className="rounded-3xl border border-soft bg-surface-strong p-6">
            <h2 className="text-2xl font-black tracking-tight">Group of 4–6</h2>
            <p className="mt-3 text-soft leading-relaxed">
              A private SUV gives your group one vehicle and one return plan for the night.
            </p>
          </article>
          <article className="rounded-3xl border border-soft bg-surface-strong p-6">
            <h2 className="text-2xl font-black tracking-tight">Group of 7+</h2>
            <p className="mt-3 text-soft leading-relaxed">
              A 10 passenger van, 14 passenger Sprinter, or 24 passenger party bus keeps everyone together from pickup to return.
            </p>
          </article>
        </section>

        <FAQBlock title="Denver Concert Transportation FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
