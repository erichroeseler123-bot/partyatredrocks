import type { Metadata } from "next";
import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";
import { RED_ROCKS_ENTITIES } from "@/lib/redRocksAuthority";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";
const DEFAULT_OG_IMAGE =
  `${SITE}/api/unsplash-image?q=red+rocks+amphitheatre+concert+night+denver+colorado&src=%2Fhero%2Fhero-home.jpg&alt=Red+Rocks+shuttle+transportation&w=1200&h=630`;

export const metadata: Metadata = {
  title: "Red Rocks Transportation Guide",
  description:
    "Red Rocks transportation guide with shuttle, rideshare, parking, pickup timing, and return planning for concert nights.",
  alternates: { canonical: `${SITE}/red-rocks/transportation` },
  openGraph: {
    title: "Red Rocks Transportation Guide",
    description:
      "Red Rocks transportation guide with shuttle, rideshare, parking, pickup timing, and return planning for concert nights.",
    url: `${SITE}/red-rocks/transportation`,
    type: "article",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        alt: "Red Rocks transportation guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Rocks Transportation Guide",
    description:
      "Red Rocks transportation guide with shuttle, rideshare, parking, pickup timing, and return planning for concert nights.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const coreLinks = [
  { href: "/red-rocks", label: "Red Rocks Guide" },
  { href: "/red-rocks/transportation", label: "Transportation" },
  { href: "/red-rocks/parking", label: "Parking" },
  { href: "/red-rocks/faq", label: "FAQ" },
] as const;

export default async function RedRocksTransportationPage({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;
  const transportationEntities = RED_ROCKS_ENTITIES.filter((entity) => entity.category === "transportation");
  const faqRows = await getFaqRowsWithGlobal("red-rocks/transportation.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
      { "@type": "ListItem", position: 3, name: "Transportation", item: `${SITE}/red-rocks/transportation` },
    ],
  };
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Red Rocks Transportation Guide",
    description:
      "Red Rocks transportation guide with shuttle, rideshare, parking, pickup timing, and return planning for concert nights.",
    url: `${SITE}/red-rocks/transportation`,
    mainEntityOfPage: `${SITE}/red-rocks/transportation`,
    author: { "@type": "Organization", name: "Party at Red Rocks" },
    publisher: { "@id": `${SITE}/#organization` },
    about: [
      { "@type": "Place", name: "Red Rocks Amphitheatre", url: `${SITE}/venues/red-rocks-amphitheatre` },
      { "@type": "Service", name: "Red Rocks shuttle transportation", url: `${SITE}/book/red-rocks-amphitheatre/custom/shared` },
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
          <div className="comic-kicker">Transportation</div>
          <h1 className="comic-title">How To Get To Red Rocks</h1>
          <p className="comic-copy">
            Red Rocks transportation usually comes down to three choices: drive and park, use rideshare, or book a shuttle or
            private ride in advance. The best option depends on your group size, timing, and how much certainty you want after
            the show.
          </p>
          <p className="comic-copy">
            Red Rocks is different from a downtown arena. Traffic builds before doors, walking can be steep, and the rush after
            the encore happens fast. If you know how you are getting in and out before show night, the whole evening is easier.
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
              Book a Ride
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/week/red-rocks">
              Shows This Week
            </Link>
          </div>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Your Main Options</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Driving gives you full control, but it also means dealing with parking, stairs, and post-show traffic yourself.
            Rideshare can work on lighter nights, but it is the least predictable option once a sold-out crowd heads out at the
            same time. Pre-booked shuttle or private rides give you the clearest pickup and return plan before the night starts.
          </p>
          <p className="comic-copy">
            Shared shuttle seats work well for couples, friends, and smaller groups who want a round-trip option without driving.
            Private rides are better when your group wants one vehicle for the full night. Parking can still make sense if you are
            prepared for the walk in and the slower exit after the show.
          </p>
          <p className="comic-copy">
            Whatever you choose, decide before show night. The easiest Red Rocks nights are the ones where everyone already knows
            the meeting point, timing, and return plan.
          </p>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Arrival and Return Timing</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Red Rocks usually rewards earlier arrival. Late arrival can mean more traffic, less favorable parking, and a more
            rushed walk to the venue. Giving yourself extra time makes security, stairs, and seat-finding much easier.
          </p>
          <p className="comic-copy">
            The return trip matters just as much. If you wait until the encore ends to decide what to do, that is when the venue
            is most crowded and the options are least clear. Have one regroup point and one return plan before the show starts.
          </p>
          <p className="comic-copy">
            If anyone in your group is sensitive to stairs, altitude, or weather, build extra walking and transition time into the
            night.
          </p>
        </section>

        <div className="comic-grid" style={{ marginTop: 16 }}>
          <Link href="/red-rocks/transportation/shuttle-vs-uber" className="comic-panel block">
            <div className="comic-tag">Compare</div>
            <h2 className="comic-h3">Shuttle vs Uber at Red Rocks</h2>
            <p className="comic-copy">Cost and reliability comparison with post-show risk notes.</p>
          </Link>
          <Link href="/red-rocks/transportation/parking-reality" className="comic-panel block">
            <div className="comic-tag">Parking</div>
            <h2 className="comic-h3">Parking Reality</h2>
            <p className="comic-copy">Ingress, lot tradeoffs, stair load, and exit bottlenecks.</p>
          </Link>
          <Link href="/red-rocks/transportation/post-show-pickup" className="comic-panel block">
            <div className="comic-tag">Pickup</div>
            <h2 className="comic-h3">Post-Show Pickup Strategy</h2>
            <p className="comic-copy">How to avoid regroup failures when crowds surge at close.</p>
          </Link>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Before Show Night</div>
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            <li className="comic-copy">Decide how your group is getting to Red Rocks before the day of the show.</li>
            <li className="comic-copy">Set one meeting point for the ride in and one meeting point for the ride back.</li>
            <li className="comic-copy">Keep everyone on the same text thread.</li>
            <li className="comic-copy">Allow extra time for traffic, stairs, and security.</li>
            <li className="comic-copy">Check the weather and bring layers that match the walk in and out.</li>
          </ul>
        </section>

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

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">More Transportation Topics</div>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {transportationEntities.map((entity) => (
              <Link key={entity.slug} href={`/red-rocks/${entity.slug}`} className="comic-btn comic-btn-secondary">
                {entity.title}
              </Link>
            ))}
          </div>
        </section>

        <FAQBlock title="Red Rocks Transportation FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
