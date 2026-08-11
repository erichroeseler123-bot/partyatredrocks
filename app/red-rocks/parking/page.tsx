import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks Parking Guide",
  description:
    "Red Rocks parking guide with lot tradeoffs, timing guidance, walking effort planning, and post-show exit options.",
  alternates: { canonical: "/red-rocks/parking" },
};

const coreLinks = [
  { href: "/red-rocks", label: "Red Rocks Guide" },
  { href: "/red-rocks/transportation", label: "Transportation" },
  { href: "/red-rocks/parking", label: "Parking" },
  { href: "/red-rocks/faq", label: "FAQ" },
] as const;

export default async function RedRocksParkingPage({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;
  const faqRows = await getFaqRowsWithGlobal("red-rocks/parking.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
      { "@type": "ListItem", position: 3, name: "Parking", item: `${SITE}/red-rocks/parking` },
    ],
  };
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Red Rocks Parking Guide",
    description:
      "Red Rocks parking guide with lot tradeoffs, timing guidance, walking effort planning, and post-show exit options.",
    url: `${SITE}/red-rocks/parking`,
    mainEntityOfPage: `${SITE}/red-rocks/parking`,
    author: { "@type": "Organization", name: "Party at Red Rocks" },
    publisher: { "@id": `${SITE}/#organization` },
    about: [
      { "@type": "Place", name: "Red Rocks Amphitheatre", url: `${SITE}/venues/red-rocks-amphitheatre` },
      { "@type": "Thing", name: "Red Rocks parking and exit planning" },
    ],
  };

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        {faqRows.length > 0 ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        ) : null}

        <div className="comic-hero">
          <div className="comic-kicker">Parking</div>
          <h1 className="comic-title">Red Rocks Parking Guide</h1>
          <p className="comic-copy">
            There is no single best Red Rocks lot for every group. The right parking plan depends on when you arrive, how much
            walking your group is comfortable with, and how quickly you want to leave after the show.
          </p>
          <p className="comic-copy">
            The biggest parking problems usually come from arriving late or treating every lot like it works the same way. A small
            timing change can mean a longer walk, more stairs, and a slower exit once the crowd heads out.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link
              className="comic-btn comic-btn-primary"
              href={buildBookingHref({
                target: "book",
                venue: "red-rocks-amphitheatre",
                searchParams: sp,
              })}
            >
              Book Private Ride
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/red-rocks/transportation">
              Transportation Guide
            </Link>
          </div>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">How To Choose A Lot</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Start with your main priority. If your group wants less stair strain, arrive earlier and choose a plan that reduces
            the climb. If a smoother exit matters more, accept that you may walk farther before the show. If you want the least
            hassle overall, a pre-booked private ride may be the better fit.
          </p>
          <p className="comic-copy">
            Also account for weather, mobility, and altitude. A moderate walk can feel much harder in cold weather or at elevation,
            especially for first-time visitors.
          </p>
          <p className="comic-copy">
            Before the show starts, decide how your group will leave. That choice often matters more than the lot itself.
          </p>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Arrival Timing</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            On lighter nights, parking can feel manageable even with a looser arrival window. On busier nights, late arrival often
            means slower traffic, less favorable parking, and a longer walk to the venue. Arriving earlier than you would for an
            indoor arena is usually the safer move.
          </p>
          <p className="comic-copy">
            If you are meeting friends at the venue, agree on one fallback point before anyone arrives. Searching across multiple
            rows and lots takes longer than most people expect.
          </p>
          <p className="comic-copy">
            Dress for the walk in and out. Layers, water, and realistic pacing matter more than trying to rush once traffic starts
            to build.
          </p>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Post-Show Exit Reality</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Most parking frustration happens after the show. Thousands of people leave at once, and even a convenient lot can move
            slowly once the roads fill up. That is normal at Red Rocks.
          </p>
          <p className="comic-copy">
            If your group gets separated, keep one regroup plan and one text thread. Wandering between rows in the dark usually
            turns a short delay into a much longer one.
          </p>
          <p className="comic-copy">
            If getting out quickly really matters, it is worth comparing parking against a pre-booked private ride before show night.
          </p>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Red Rocks Parking Map</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            See trail, seating, geology, parking, and pickup layers together to choose a lot strategy that matches your arrival and
            exit plan.
          </p>
          <div style={{ marginTop: 10 }}>
            <Link href="/red-rocks/map" className="comic-btn comic-btn-secondary">
              Open Interactive Map
            </Link>
          </div>
        </section>

        <div className="comic-grid" style={{ marginTop: 16 }}>
          <Link href="/red-rocks/concert-guide" className="comic-panel block">
            <div className="comic-tag">Related</div>
            <h2 className="comic-h3">Concert Guide</h2>
            <p className="comic-copy">Pair parking decisions with stairs, weather, and seat movement planning.</p>
          </Link>
          <Link href="/red-rocks/transportation/parking-reality" className="comic-panel block">
            <div className="comic-tag">Deep Dive</div>
            <h2 className="comic-h3">Parking Reality</h2>
            <p className="comic-copy">Detailed breakdown of flow constraints and pickup alternatives.</p>
          </Link>
          <Link
            href={buildBookingHref({
              target: "book",
              venue: "red-rocks-amphitheatre",
              searchParams: sp,
            })}
            className="comic-panel block"
          >
            <div className="comic-tag">Alternative</div>
            <h2 className="comic-h3">See Private Ride Options</h2>
            <p className="comic-copy">Choose a $399 Suburban or $599 van for a private Red Rocks show-night ride.</p>
          </Link>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">More Red Rocks Guides</div>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {coreLinks.map((item) => (
              <Link key={item.href} href={item.href} className="comic-btn comic-btn-secondary">
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <FAQBlock title="Red Rocks Parking FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
