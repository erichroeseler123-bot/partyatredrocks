import Link from "next/link";
import { DISPLAY } from "@/lib/display";

export const metadata = {
  title: "Party Bus to Red Rocks",
  description:
    "Party bus group transportation to Red Rocks with coordinated departure and return planning.",
};

export default function PartyBusPage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Big Group Energy</div>
          <h1 className="comic-title">Party Bus Booking</h1>
          <p className="comic-copy">
            Turn the ride into the pregame while keeping your group synced from pickup to final drop-off.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-primary" href="/find">
              Get Party Bus Quote
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/book?type=party-bus">
              Start Group Booking
            </Link>
          </div>
        </div>

        <article className="comic-panel" style={{ marginTop: 14 }}>
          <img
            src={DISPLAY.images.marketing.shuttle}
            alt="Party bus transportation for concert groups"
            className="w-full h-52 object-cover rounded-xl border border-white/20"
            loading="lazy"
            decoding="async"
            width={640}
            height={416}
          />
          <div className="comic-grid">
            <div className="comic-panel">
              <div className="comic-tag">Best For</div>
              <div className="comic-h3">Large Celebrations</div>
              <p className="comic-copy">Great for birthdays, bachelor and bachelorette parties, and reunions.</p>
            </div>
            <div className="comic-panel">
              <div className="comic-tag">Show-Night Ops</div>
              <div className="comic-h3">Coordinated Return</div>
              <p className="comic-copy">One driver and one meetup plan keeps your entire group moving together.</p>
            </div>
          </div>
        </article>

        <div className="comic-mobile-cta">
          <Link className="comic-btn comic-btn-primary" href="/find">
            Request Party Bus Pricing
          </Link>
        </div>
      </section>
    </main>
  );
}
