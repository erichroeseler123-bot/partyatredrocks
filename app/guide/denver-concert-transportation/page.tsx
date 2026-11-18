import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { GuideLocalInfo } from "@/components/guide/GuideLocalInfo";
import { GuideVisualHero } from "@/components/guide/GuideVisualHero";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";
import { guideVisuals } from "@/lib/guideVisuals";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Denver Concert Transportation Guide | Red Rocks & Front Range Venues",
  description:
    "Plan concert transportation across Denver and Red Rocks: compare private Suburban ($499) and Private Van ($699) service, review venue guides, and book for your group.",
  alternates: {
    canonical: `${SITE}/guide/denver-concert-transportation`,
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
    rideType: "Private Suburban ($499 Red Rocks)",
    bestFor: "Groups up to 6 wanting door-to-door pickup, Upper North Lot tailgate & waiting driver",
    tradeoff: "Flat vehicle rate rather than single-rider ticket",
  },
  {
    rideType: "Private Van ($699 Red Rocks)",
    bestFor: "Groups of 7–10 riding, tailgating, and heading home together",
    tradeoff: "High demand on weekend sellouts—reserve early",
  },
  {
    rideType: "Denver / Boulder Venue SUV ($250)",
    bestFor: "Mission Ballroom, Ball Arena, Fiddler's Green & Folsom Field nights",
    tradeoff: "Confirm availability with dispatch for non-Red Rocks dates",
  },
  {
    rideType: "Rideshare (Uber / Lyft)",
    bestFor: "Solo riders with flexible post-show wait tolerance",
    tradeoff: "Post-encore surge pricing, Jurassic Lot hikes, no gear storage",
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
              <Link className="btn-primary" href="/book/red-rocks-amphitheatre/private">
                Book Private Ride
              </Link>
              <Link className="btn-ghost" href="/red-rocks/concerts">
                2027 Red Rocks Concerts
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
            <h2 className="text-2xl font-black tracking-tight">Couples & small crews</h2>
            <p className="mt-3 text-soft leading-relaxed">
              Reserve a dedicated Private Suburban ($499 flat round-trip) when you want door-to-door service and zero post-show rideshare stress.
            </p>
          </article>
          <article className="rounded-3xl border border-soft bg-surface-strong p-6">
            <h2 className="text-2xl font-black tracking-tight">Group of 4–6</h2>
            <p className="mt-3 text-soft leading-relaxed">
              Splitting a $499 Private Suburban (~$83 per guest for 6) includes Upper North Lot tailgating gear and a driver who waits through the show.
            </p>
          </article>
          <article className="rounded-3xl border border-soft bg-surface-strong p-6">
            <h2 className="text-2xl font-black tracking-tight">Group of 7–10</h2>
            <p className="mt-3 text-soft leading-relaxed">
              The 10-passenger Private Van ($699 flat round-trip, ~$70 per guest for 10) keeps your entire crew together from pickup to final drop-off.
            </p>
          </article>
        </section>

        <FAQBlock title="Denver Concert Transportation FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
