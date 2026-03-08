import Link from "next/link";
import MusicWave from "@/components/MusicWave";

export const metadata = {
  title: "Red Rocks Guides",
  description:
    "Transportation strategy, parking reality, venue policies, and show-night execution plans for Red Rocks.",
  alternates: {
    canonical: "/guide",
  },
};

type Card = {
  title: string;
  desc: string;
  href: string;
  kicker?: string;
};

const featured: Card[] = [
  {
    title: "Red Rocks Intelligence Hub",
    desc: "History, geology, trails, elevation, and visiting facts in one authority page.",
    href: "/guide/red-rocks-intelligence-hub",
    kicker: "Hub",
  },
  {
    title: "All Guides",
    desc: "Master index of every guide, sorted for fast scanning.",
    href: "/guide/all",
    kicker: "Index",
  },
  {
    title: "Transportation Hub",
    desc: "Shuttle vs rideshare, surge risks, and post-show extraction.",
    href: "/guide/transportation",
    kicker: "Core",
  },
  {
    title: "Parking Reality",
    desc: "Lot strategy, walking costs, and exit flow tradeoffs.",
    href: "/guide/parking",
    kicker: "Logistics",
  },
  {
    title: "Policies",
    desc: "Bag rules, prohibited items, and gate-readiness checklist.",
    href: "/guide/policies",
    kicker: "Rules",
  },
];

const deepDive: Card[] = [
  {
    title: "Show-Night Strategy",
    desc: "Arrival timing, weather pivots, and meetup discipline.",
    href: "/guide/show-night-strategy",
    kicker: "Playbook",
  },
  {
    title: "Local Pickups",
    desc: "Denver pickup zones and where groups stage best.",
    href: "/guide/local/denver-pickups",
    kicker: "Local",
  },
  {
    title: "Event Guides",
    desc: "Artist-specific briefings with actionable logistics.",
    href: "/guide/events/2026-season-preview",
    kicker: "Events",
  },
  {
    title: "Red Rocks Week Calendar",
    desc: "Live lineup view with direct booking links.",
    href: "/week/red-rocks",
    kicker: "Calendar",
  },
];

function GuideCard({ card }: { card: Card }) {
  return (
    <Link href={card.href} className="comic-panel block">
      {card.kicker ? <div className="comic-tag">{card.kicker}</div> : null}
      <h2 className="comic-h3">{card.title}</h2>
      <p className="comic-copy">{card.desc}</p>
      <div className="comic-sub" style={{ marginTop: 12 }}>
        Open guide →
      </div>
    </Link>
  );
}

export default function GuideHub() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Authority Section</div>
          <h1 className="comic-title">Red Rocks Guide Command</h1>
          <p className="comic-copy">
            Deep local intelligence for transportation, policies, venue tactics, and show-night planning.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-primary" href="/find">
              Book Ride Now
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/week/red-rocks">
              Open Live Calendar
            </Link>
          </div>
          <div style={{ marginTop: 18 }}>
            <MusicWave />
          </div>
        </div>

        <section style={{ marginTop: 18 }}>
          <div className="comic-tag">Featured Guides</div>
          <div className="comic-grid">
            {featured.map((card) => (
              <GuideCard key={card.href} card={card} />
            ))}
          </div>
        </section>

        <section style={{ marginTop: 18 }}>
          <div className="comic-tag">Deep Dives</div>
          <div className="comic-grid">
            {deepDive.map((card) => (
              <GuideCard key={card.href} card={card} />
            ))}
          </div>
        </section>

        <section className="comic-panel" style={{ marginTop: 18 }}>
          <div className="comic-tag">Trusted Sources</div>
          <div className="comic-copy" style={{ marginTop: 8 }}>
            Validate venue and road conditions before every show-night decision.
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a className="comic-btn comic-btn-secondary" href="https://www.redrocksonline.com" target="_blank" rel="noreferrer">
              Venue Source
            </a>
            <a className="comic-btn comic-btn-secondary" href="https://www.cotrip.org" target="_blank" rel="noreferrer">
              COtrip
            </a>
          </div>
        </section>

        <div className="comic-mobile-cta">
          <Link className="comic-btn comic-btn-primary" href="/find">
            Book Ride to Your Show
          </Link>
        </div>
      </section>
    </main>
  );
}
