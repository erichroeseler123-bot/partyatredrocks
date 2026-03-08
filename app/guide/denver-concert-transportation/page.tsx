import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Denver Concert Transportation Hub (2026)",
  description:
    "Plan Denver concert transportation across major venues: compare ride options, follow booking flow, and route into venue pages, weekly schedules, and guide intel.",
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
];

export default async function DenverConcertTransportationHubPage() {
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
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <div className="comic-hero">
          <div className="comic-kicker">Denver Transportation Hub</div>
          <h1 className="comic-title">Denver Concert Transportation</h1>
          <p className="comic-copy">
            Direct answer: this hub helps you move from venue discovery to a clean pickup plan across Denver and Front
            Range concert nights.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-primary" href="/find">
              Find Ride Options
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/week">
              Weekly Venue Schedules
            </Link>
          </div>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Major Venue Links</div>
          <div className="comic-grid" style={{ marginTop: 10 }}>
            {venueLinks.map((v) => (
              <Link key={v.href} href={v.href} className="comic-panel block">
                <h2 className="comic-h3">{v.label}</h2>
                <p className="comic-copy">Venue intel, upcoming shows, pickup strategy, and ride paths.</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Ride Type Comparison</div>
          <div className="overflow-x-auto" style={{ marginTop: 10 }}>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-2 pr-3">Ride Type</th>
                  <th className="py-2 pr-3">Best For</th>
                  <th className="py-2 pr-3">Main Tradeoff</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-3 font-semibold">Shared Shuttle</td>
                  <td className="py-2 pr-3">Predictable round-trip logistics</td>
                  <td className="py-2 pr-3">Less inbound timing flexibility</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-3 font-semibold">Private SUV</td>
                  <td className="py-2 pr-3">Small groups with tight schedule control</td>
                  <td className="py-2 pr-3">Higher upfront price</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-3 font-semibold">Private Van</td>
                  <td className="py-2 pr-3">Mid-size groups moving together</td>
                  <td className="py-2 pr-3">Requires earlier planning for best availability</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-3 font-semibold">Party Bus</td>
                  <td className="py-2 pr-3">Large groups / celebration nights</td>
                  <td className="py-2 pr-3">Best when booked ahead for specific events</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">How Booking Works</div>
          <ol className="comic-copy" style={{ marginTop: 10, paddingLeft: 18 }}>
            <li>Pick your venue and date.</li>
            <li>Review venue-specific parking and pickup logistics.</li>
            <li>Choose your ride type on <code>/find</code>.</li>
            <li>Confirm one clear meetup and fallback point before show close.</li>
          </ol>
        </section>

        <section className="comic-grid" style={{ marginTop: 16 }}>
          <article className="comic-panel">
            <div className="comic-tag">Best by Scenario</div>
            <h2 className="comic-h3">Solo / Pair</h2>
            <p className="comic-copy">Shared shuttle is usually the best default for budget + reliability.</p>
          </article>
          <article className="comic-panel">
            <div className="comic-tag">Best by Scenario</div>
            <h2 className="comic-h3">Group of 4–6</h2>
            <p className="comic-copy">Private SUV gives cleaner timing control and one coordinated return plan.</p>
          </article>
          <article className="comic-panel">
            <div className="comic-tag">Best by Scenario</div>
            <h2 className="comic-h3">Group of 7+</h2>
            <p className="comic-copy">Private van or party bus keeps the entire group together for ingress and exit.</p>
          </article>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Key Planning Links</div>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-primary" href="/find">
              Compare & Book
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/week">
              Weekly Discovery
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/week/red-rocks">
              Red Rocks Week
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/guide/transportation/shuttle-vs-uber">
              Shuttle vs Uber
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/guide/show-night-strategy/post-show-pickup-plan">
              Pickup Strategy
            </Link>
          </div>
        </section>

        <FAQBlock title="Denver Concert Transportation FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
