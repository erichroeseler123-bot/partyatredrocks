import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";
import { RED_ROCKS_ENTITIES } from "@/lib/redRocksAuthority";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks Transportation Guide",
  description:
    "Long-form transportation guide for Red Rocks: shuttle vs rideshare, parking constraints, pickup timing, and return planning.",
  alternates: { canonical: "/red-rocks/transportation" },
};

const coreLinks = [
  { href: "/red-rocks", label: "Hub" },
  { href: "/red-rocks/transportation", label: "Transportation" },
  { href: "/red-rocks/parking", label: "Parking" },
  { href: "/red-rocks/faq", label: "FAQ" },
] as const;

export default async function RedRocksTransportationPage() {
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

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        {faqRows.length > 0 ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        ) : null}

        <div className="comic-hero">
          <div className="comic-kicker">Transportation</div>
          <h1 className="comic-title">How To Get To Red Rocks Without Breaking Your Night</h1>
          <p className="comic-copy">
            Direct answer: transportation is the highest-risk operational decision for Red Rocks. People focus on tickets and set
            times, but the breakdown usually happens in parking ingress, post-show pickup coordination, or last-minute rideshare
            dependence. A strong plan starts before arrival, with one route in and one route out that your whole group can execute.
          </p>
          <p className="comic-copy">
            Red Rocks behaves differently from dense city venues. Vehicle routes narrow near event peaks, stair movement takes real
            energy at elevation, and crowd release happens in a short window after encore. If you wait to decide on transportation
            until the end of the show, you are solving a complex logistics problem in the worst possible moment.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-primary" href="/find">
              Compare Ride Options
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/week/red-rocks">
              Match Plan To This Week
            </Link>
          </div>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">The Three Transportation Models</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Model one is self-driving and parking. It offers independence, but your night depends on lot selection, arrival timing,
            and your tolerance for delayed exit. Model two is rideshare on demand. It can work on lower-demand nights but has the
            highest volatility after sold-out shows because supply and demand become disconnected exactly when everyone requests a
            ride at once. Model three is pre-planned transport, such as shuttle or private service, where pickup terms are known
            in advance and your group follows a fixed return sequence.
          </p>
          <p className="comic-copy">
            The right model is not universal. Couples with flexible timing may prefer shared service. Groups needing control over
            departure windows may prefer private options. Visitors who prioritize lowest direct cost may still choose parking, but
            should do it with realistic expectations about egress and walking effort.
          </p>
          <p className="comic-copy">
            In all models, success comes from pre-commitment: agree on the meeting point, communication fallback, and departure
            trigger before entering the venue.
          </p>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Arrival and Return Timing</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Arrival timing at Red Rocks should be earlier than your city-venue instinct. Last-minute arrivals compress stress:
            vehicle queueing, longer walks from less favorable parking zones, and less margin for security lines. Earlier arrival
            protects against those compounding delays and gives your group time to settle before performance start.
          </p>
          <p className="comic-copy">
            Return timing deserves equal planning. The common mistake is assuming you can "figure it out after the encore." In
            practice, that is when decision quality drops. Design your return trigger now: leave at a planned point in the set,
            or wait at a pre-agreed regroup location until your ride is in position.
          </p>
          <p className="comic-copy">
            If your group includes older guests or anyone sensitive to stairs and altitude, include extra transition time both
            pre-show and post-show. Physical pacing is logistics, not an afterthought.
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
          <div className="comic-tag">Operational Checklist</div>
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            <li className="comic-copy">Choose transport mode at least one day before the event.</li>
            <li className="comic-copy">Set a primary and backup meeting location.</li>
            <li className="comic-copy">Share one contact thread for all riders.</li>
            <li className="comic-copy">Confirm departure timing and expected walk distance.</li>
            <li className="comic-copy">Keep weather and altitude pace in the plan.</li>
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

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Transportation Topic Index</div>
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
