import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";
import { RED_ROCKS_ENTITIES } from "@/lib/redRocksAuthority";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks Wildlife Guide",
  description:
    "Long-form wildlife guide for Red Rocks Park: common species, observation timing, safety practices, and habitat-aware visit planning.",
  alternates: { canonical: "/red-rocks/wildlife" },
};

export default async function RedRocksWildlifePage() {
  const faqRows = await getFaqRowsWithGlobal("red-rocks/wildlife.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
      { "@type": "ListItem", position: 3, name: "Wildlife", item: `${SITE}/red-rocks/wildlife` },
    ],
  };
  const wildlifeAuthorityPages = RED_ROCKS_ENTITIES.filter((p) => p.category === "wildlife");

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        {faqRows.length > 0 ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        ) : null}

        <div className="comic-hero">
          <div className="comic-kicker">Wildlife</div>
          <h1 className="comic-title">Wildlife at Red Rocks: What You May See and How To Observe</h1>
          <p className="comic-copy">
            Red Rocks is a concert landmark, but it is also active habitat. Visitors commonly report sightings of mule deer,
            coyotes, foxes, hawks, and seasonal reptiles. Wildlife visibility changes with time of day, weather, and crowd volume,
            so the best viewing experiences usually come from lower-traffic windows and slower pacing.
          </p>
          <p className="comic-copy">
            Good wildlife observation is simple: keep distance, move predictably, avoid feeding, and stay on marked routes. The
            goal is to see behavior without changing behavior.
          </p>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Common Species Profile</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Mule deer are among the most frequent sightings near open edges and vegetation transitions. Coyotes and foxes may be
            active in quieter hours, especially near lower-traffic zones. Raptors often use ridge winds and thermal patterns for
            hunting and gliding, which makes high-viewpoint observation rewarding for bird-focused visitors.
          </p>
          <p className="comic-copy">
            Seasonal conditions influence visibility. Warmer periods can increase reptile encounters near sun-exposed edges, while
            cooler windows may improve mammal movement around dawn and dusk.
          </p>
          <p className="comic-copy">
            Wildlife movement is dynamic. Treat sightings as bonus outcomes, not guaranteed stops.
          </p>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Responsible Viewing Rules</div>
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            <li className="comic-copy">Observe from distance and avoid direct approach.</li>
            <li className="comic-copy">Never feed wildlife or leave food scraps on trails.</li>
            <li className="comic-copy">Keep to marked paths to reduce habitat disturbance.</li>
            <li className="comic-copy">Use calm movement and lower noise where practical.</li>
            <li className="comic-copy">If an animal changes direction because of you, increase distance.</li>
          </ul>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Best Times and Planning Windows</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Early and late daylight windows are often best for wildlife observation and comfort. Midday can still produce sightings,
            but heat and traffic frequently reduce movement. If your schedule includes a concert, separate wildlife viewing from
            show-night rush timing to keep both experiences better.
          </p>
          <p className="comic-copy">
            Bring binoculars if birdwatching is a priority and keep a steady pace. Slower movement usually improves both sightings
            and safety.
          </p>
          <p className="comic-copy">
            Pair this page with the hiking guide for route-specific planning and with transportation pages for evening logistics.
          </p>
        </section>

        <div className="comic-grid" style={{ marginTop: 16 }}>
          <Link href="/red-rocks/hiking-trails" className="comic-panel block">
            <div className="comic-tag">Related</div>
            <h2 className="comic-h3">Hiking Trails</h2>
            <p className="comic-copy">Choose routes that fit wildlife and pacing goals.</p>
          </Link>
          <Link href="/red-rocks/visiting-guide" className="comic-panel block">
            <div className="comic-tag">Related</div>
            <h2 className="comic-h3">Visiting Guide</h2>
            <p className="comic-copy">Align wildlife timing with weather and day planning.</p>
          </Link>
          <Link href="/book?venue=red-rocks-amphitheatre" className="comic-panel block">
            <div className="comic-tag">CTA</div>
            <h2 className="comic-h3">Concert Night Ride Planning</h2>
            <p className="comic-copy">Book transport after daytime route decisions are set.</p>
          </Link>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Wildlife Index</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Browse species and safety pages in the Red Rocks wildlife cluster.
          </p>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {wildlifeAuthorityPages.map((page) => (
              <Link key={page.slug} href={`/red-rocks/${page.slug}`} className="comic-btn comic-btn-secondary">
                {page.title}
              </Link>
            ))}
          </div>
        </section>

        <FAQBlock title="Red Rocks Wildlife FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
