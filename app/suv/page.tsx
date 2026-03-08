import Link from "next/link";
import { DISPLAY } from "@/lib/display";

export const metadata = {
  title: "SUV Ride to Red Rocks",
  description:
    "Private SUV transportation to Red Rocks with door-to-door pickup and guaranteed return.",
  alternates: {
    canonical: "/private-suburban",
  },
};

export default function SuvPage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Private Ride</div>
          <h1 className="comic-title">SUV to Red Rocks</h1>
          <p className="comic-copy">
            Premium Suburban service for groups up to 6. Door-to-door routing with a locked-in ride home.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-primary" href="/private-suburban#book">
              Reserve SUV
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/find">
              Compare All Rides
            </Link>
          </div>
        </div>

        <article className="comic-panel" style={{ marginTop: 14 }}>
          <img
            src={DISPLAY.images.marketing.vipSuv}
            alt="Private suburban SUV transportation"
            className="w-full h-52 object-cover rounded-xl border border-white/20"
            loading="lazy"
            decoding="async"
            width={640}
            height={416}
          />
          <div className="comic-grid">
            <div className="comic-panel">
              <div className="comic-tag">Capacity</div>
              <div className="comic-h3">Up to 6 Guests</div>
              <p className="comic-copy">Best for date night, couples trips, or small group plans.</p>
            </div>
            <div className="comic-panel">
              <div className="comic-tag">Experience</div>
              <div className="comic-h3">Door to Door</div>
              <p className="comic-copy">Skip lot walking and surge queues with a single-booking plan.</p>
            </div>
          </div>
        </article>

        <div className="comic-mobile-cta">
          <Link className="comic-btn comic-btn-primary" href="/private-suburban#book">
            Book Private SUV
          </Link>
        </div>
      </section>
    </main>
  );
}
