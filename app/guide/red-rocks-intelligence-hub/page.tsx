import Link from "next/link";
import MusicWave from "@/components/MusicWave";

export const metadata = {
  title: "Red Rocks Visiting Guide",
  description:
    "Complete Red Rocks guide: history, geology, elevation, trails, visiting rules, and show-night planning links.",
  alternates: {
    canonical: "/guide/red-rocks-intelligence-hub",
  },
};

const sections = [
  {
    kicker: "Basic Facts",
    title: "Red Rocks At A Glance",
    bullets: [
      "Location: near Morrison, Colorado, roughly 10 miles west of Denver.",
      "Elevation: about 6,435 ft above sea level.",
      "Capacity: about 9,525 seats.",
      "Opened as amphitheatre: 1941.",
      "Owner: City and County of Denver (Denver Mountain Parks).",
    ],
  },
  {
    kicker: "Geology",
    title: "Why The Rocks Are Red",
    bullets: [
      "The rocks are part of the Fountain Formation, built from ancient sediment deposits.",
      "Red coloration mainly comes from iron oxide in the sandstone.",
      "Comparable Front Range formations appear at Garden of the Gods and the Flatirons.",
    ],
  },
  {
    kicker: "Formation",
    title: "How The Amphitheater Works Naturally",
    bullets: [
      "The bowl shape is a result of uplift and erosion over millions of years.",
      "Key formations include Creation Rock, Ship Rock, and Stage Rock.",
      "The monoliths form a natural acoustic shell that amplifies and reflects sound.",
    ],
  },
  {
    kicker: "Visiting",
    title: "Park Access And Timing",
    bullets: [
      "Park access is typically available from one hour before sunrise to one hour after sunset.",
      "On event days, amphitheatre areas may close in the afternoon for show prep.",
      "Daytime park admission is usually free when no ticketed event restrictions apply.",
    ],
  },
  {
    kicker: "Trails",
    title: "Most Useful Trails",
    bullets: [
      "Trading Post Trail: short scenic loop through formations and meadows.",
      "Red Rocks Trail: multi-use route that connects with adjacent park systems.",
      "Funicular Trail: steeper route following the old incline alignment.",
      "Geologic Overlook Trail: short path to viewpoint and interpretive markers.",
    ],
  },
  {
    kicker: "Practical",
    title: "Altitude And Show-Night Reality",
    bullets: [
      "At this elevation, stairs feel harder and fatigue sets in faster.",
      "Sun exposure and dry air are stronger than many visitors expect.",
      "Hydration, layering, and a clean transport plan reduce show-night stress.",
    ],
  },
] as const;

const faqRows = [
  "How high is Red Rocks?",
  "Why are the rocks red?",
  "Can you visit Red Rocks without a concert ticket?",
  "Which trail should first-time visitors do?",
  "How many stairs are in the amphitheatre workout route?",
  "What should I plan for weather and altitude?",
  "Is camping allowed inside Red Rocks Park?",
  "What is the fastest post-show exit strategy?",
];

export default function RedRocksIntelHubPage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Visiting Guide</div>
          <h1 className="comic-title">Red Rocks Visiting Guide</h1>
          <p className="comic-copy">
            One page with the core Red Rocks facts, geology, visiting rules, and practical planning basics before show night.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-primary" href="/shuttles">
              Book Ride
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/week/red-rocks">
              Live Lineup
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/guide/red-rocks-faq">
              Venue FAQ
            </Link>
          </div>
          <div style={{ marginTop: 18 }}>
            <MusicWave bars={24} />
          </div>
        </div>

        <section style={{ marginTop: 16 }}>
          <div className="comic-grid">
            {sections.map((section) => (
              <article key={section.title} className="comic-panel">
                <div className="comic-tag">{section.kicker}</div>
                <h2 className="comic-h3" style={{ marginTop: 10 }}>
                  {section.title}
                </h2>
                <ul style={{ marginTop: 10, paddingLeft: 18 }}>
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="comic-copy" style={{ marginTop: 6 }}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Common Questions</div>
          <h2 className="comic-h3" style={{ marginTop: 10 }}>
            Questions People Ask First
          </h2>
          <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
            {faqRows.map((q) => (
              <div key={q} className="comic-btn comic-btn-secondary !justify-start">
                {q}
              </div>
            ))}
          </div>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Next Step</div>
          <p className="comic-copy" style={{ marginTop: 10 }}>
            Once you know your date and plan for the venue, choose your ride option and book before show night.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-primary" href="/shuttles">
              See Shuttle Options
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/week/red-rocks">
              Search This Week
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
