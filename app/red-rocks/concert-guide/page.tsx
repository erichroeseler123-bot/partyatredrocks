import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks Concert Guide",
  description:
    "Long-form Red Rocks concert planning guide covering arrival timing, stairs, weather, seat movement, and pickup strategy.",
  alternates: { canonical: "/red-rocks/concert-guide" },
};

const coreLinks = [
  { href: "/red-rocks", label: "Hub" },
  { href: "/red-rocks/transportation", label: "Transportation" },
  { href: "/red-rocks/parking", label: "Parking" },
  { href: "/red-rocks/faq", label: "FAQ" },
] as const;

export default async function RedRocksConcertGuidePage() {
  const faqRows = await getFaqRowsWithGlobal("red-rocks/concert-guide.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
      { "@type": "ListItem", position: 3, name: "Concert Guide", item: `${SITE}/red-rocks/concert-guide` },
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
          <div className="comic-kicker">Concert Guide</div>
          <h1 className="comic-title">Red Rocks Concert Planning, End To End</h1>
          <p className="comic-copy">
            Direct answer: Red Rocks show planning is about movement and timing as much as music. Capacity is significant, the
            venue is open-air, and stair effort at elevation is real. A strong plan covers arrival, weather, seat movement,
            regrouping, and return transport before doors open.
          </p>
          <p className="comic-copy">
            Many first-time visitors plan Red Rocks like an indoor arena. That mismatch creates stress. In an arena, weather has
            low impact and surface movement is relatively flat. At Red Rocks, temperature, wind, rain risk, and steep transitions
            all affect comfort and pacing. The people who have the best experience usually front-load decisions rather than trying
            to optimize in real time.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-primary" href="/week/red-rocks">
              Browse This Week
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/find">
              Lock Your Ride
            </Link>
          </div>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Before You Leave Home</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Build your pre-show checklist around timing certainty, not best-case speed. Set departure target, confirm who is riding
            together, decide what each person carries, and agree on backup communication if phone service degrades in crowd load.
            Keep your bag and layer choices aligned with venue policy and forecast rather than habit.
          </p>
          <p className="comic-copy">
            If your group includes out-of-state guests, mention altitude and stair effort in advance. That single expectation reset
            can prevent pace splits later in the night.
          </p>
          <p className="comic-copy">
            For high-interest shows, treat timing like an operations plan. Build a buffer window and protect it.
          </p>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Arrival, Entry, and Seat Movement</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Arrival should be early enough to absorb traffic variability without panic. Entry is smoother when your group is
            physically and logistically ready on approach: tickets accessible, bag policy understood, and regroup point chosen.
          </p>
          <p className="comic-copy">
            Inside, avoid unnecessary seat migration early in the show. Stair transitions in crowded aisles are where time and
            energy disappear. If you want merchandise, food, or photos, choose controlled windows instead of repeatedly breaking
            flow.
          </p>
          <p className="comic-copy">
            Keep hydration steady and pace realistic. The best Red Rocks nights come from sustainable movement, not rushed movement.
          </p>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Post-Show Exit and Pickup</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            The highest friction window starts at close. Everyone exits in similar time bands, and transport demand spikes at once.
            If your group has no pre-set return protocol, you lose time in duplicate texting, mismatched location assumptions, and
            repeated direction changes.
          </p>
          <p className="comic-copy">
            Set a clear rule: one meeting location, one timeline, one fallback. If your ride is scheduled, align your departure
            rhythm to that schedule. If you are driving, align your movement to your lot strategy and traffic expectations.
          </p>
          <p className="comic-copy">
            If your plan is still "we will decide after the encore," you do not yet have a plan.
          </p>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Show-Night Checklist</div>
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            <li className="comic-copy">Confirm forecast and temperature swing before departure.</li>
            <li className="comic-copy">Carry only what is necessary under venue policy constraints.</li>
            <li className="comic-copy">Set a regroup point before music starts.</li>
            <li className="comic-copy">Decide your departure trigger for the return leg.</li>
            <li className="comic-copy">Use one transport plan, not competing backup ideas.</li>
          </ul>
        </section>

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

        <FAQBlock title="Red Rocks Concert FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
