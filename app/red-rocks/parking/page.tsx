import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks Parking Guide",
  description:
    "Long-form Red Rocks parking strategy with lot tradeoffs, timing guidance, walking effort planning, and post-show exit options.",
  alternates: { canonical: "/red-rocks/parking" },
};

const coreLinks = [
  { href: "/red-rocks", label: "Hub" },
  { href: "/red-rocks/transportation", label: "Transportation" },
  { href: "/red-rocks/parking", label: "Parking" },
  { href: "/red-rocks/faq", label: "FAQ" },
] as const;

export default async function RedRocksParkingPage() {
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

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        {faqRows.length > 0 ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        ) : null}

        <div className="comic-hero">
          <div className="comic-kicker">Parking</div>
          <h1 className="comic-title">Red Rocks Parking: Practical Strategy, Not Guesswork</h1>
          <p className="comic-copy">
            Direct answer: there is no perfect Red Rocks lot. Every option trades one benefit for one cost. The best parking plan
            depends on your priorities: faster entry, less stair effort, or faster exit. The mistake is assuming a single lot
            recommendation works for every group and every show.
          </p>
          <p className="comic-copy">
            Most parking frustration comes from hidden dependencies. Arrival time affects which zones remain realistic. Zone choice
            affects uphill effort and how quickly your group reaches seats. Where you end up parked affects the difficulty of
            leaving at scale after encore. If you do not decide these tradeoffs in advance, you end up with a random outcome at
            peak demand.
          </p>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">How To Choose A Lot Strategy</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Start by naming the primary objective. If your group includes guests who want lower stair strain, prioritize arrival
            earlier and target parking that reduces pre-show climbing. If your group values a cleaner exit path, accept potential
            pre-show walking in exchange for less egress friction. If your group wants low stress at all costs, pre-arranged
            shuttle or private transport may be better than self-parking.
          </p>
          <p className="comic-copy">
            Then define hard constraints: arrival window, weather tolerance, and mobility needs. Weather turns minor incline into
            major effort. Altitude magnifies perceived exertion. A realistic plan should account for both, especially if anyone in
            the group is visiting from lower elevation.
          </p>
          <p className="comic-copy">
            Finally, define your return trigger. Will you leave with the final song, wait for full lights, or regroup before
            moving? This decision changes whether your parking choice feels efficient or frustrating.
          </p>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Arrival Windows That Actually Work</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            On low-demand nights, parking can feel manageable even with looser timing. On high-demand nights, late arrival often
            creates a chain reaction: slower ingress, less favorable parking, longer walks, and compressed pre-show setup. The
            safest default is to arrive earlier than your normal indoor-venue pattern.
          </p>
          <p className="comic-copy">
            If your plan includes meeting friends on-site, set one fixed fallback point. Searching multiple lots and rows in low
            light increases friction and burns time you expected to spend settling in.
          </p>
          <p className="comic-copy">
            Keep your hydration and weather layer plan tied to parking distance. If your likely walk is longer than expected,
            having the right layer and pace matters more than trying to rush to your seat.
          </p>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Post-Show Exit Reality</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Exit speed is where most assumptions fail. Thousands of people leave in a narrow window, and road capacity does not
            scale linearly with demand. A lot that felt convenient before the show may become slow at release. This is normal at
            Red Rocks and should be planned for, not treated as an exception.
          </p>
          <p className="comic-copy">
            If your group gets separated, have a predefined regroup protocol: one person stays put, one person navigates, everyone
            uses one thread for location updates. Unstructured movement in dark, crowded transitions is the biggest cause of long
            delays.
          </p>
          <p className="comic-copy">
            If your group has strict next-morning obligations, weigh that heavily. Paying for a more controlled transport path can
            be worth it when time certainty is more valuable than lowest direct cost.
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
          <Link href="/find" className="comic-panel block">
            <div className="comic-tag">Alternative</div>
            <h2 className="comic-h3">Skip Driving, Compare Rides</h2>
            <p className="comic-copy">See shuttle and private options aligned to your group size.</p>
          </Link>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Cluster Navigation</div>
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
