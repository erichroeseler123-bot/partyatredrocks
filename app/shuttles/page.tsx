import Link from "next/link";
import { DISPLAY } from "@/lib/display";
import GlobalSearch from "@/components/GlobalSearch";

export default function ShuttlesPage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Transport HQ</div>
          <h1 className="comic-title">Book Your Ride to Red Rocks</h1>
          <p className="comic-copy">
            Fast mobile booking for shuttle seats, private SUVs, vans, and party bus options.
          </p>
          <div style={{ marginTop: 14 }}>
            <GlobalSearch />
          </div>
        </div>

        <div className="comic-grid">
          <article className="comic-panel">
            <img
              src={DISPLAY.images.marketing.shuttle}
              alt="Shared shuttle ride to Red Rocks"
              className="w-full h-44 object-cover rounded-xl border border-white/20"
            />
            <div className="comic-tag" style={{ marginTop: 10 }}>
              Shared Ride
            </div>
            <h2 className="comic-h3">$59 Shuttle Seat</h2>
            <p className="comic-copy">Fixed-price seats, meetup clarity, guaranteed return trip.</p>
            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link className="comic-btn comic-btn-primary" href="/book?type=shuttle">
                Book Shuttle
              </Link>
              <Link className="comic-btn comic-btn-secondary" href="/find">
                Compare Rides
              </Link>
            </div>
          </article>

          <article className="comic-panel">
            <img
              src={DISPLAY.images.marketing.vipSuv}
              alt="Private suburban SUV service"
              className="w-full h-44 object-cover rounded-xl border border-white/20"
            />
            <div className="comic-tag" style={{ marginTop: 10 }}>
              Private
            </div>
            <h2 className="comic-h3">Suburban SUV</h2>
            <p className="comic-copy">Door-to-door private ride for up to 6 guests.</p>
            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link className="comic-btn comic-btn-primary" href="/private-suburban">
                Reserve SUV
              </Link>
              <Link className="comic-btn comic-btn-secondary" href="/find">
                Pick Date
              </Link>
            </div>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Group Ride</div>
            <h2 className="comic-h3">10–14 Passenger Van</h2>
            <p className="comic-copy">
              Keep your whole group together with one booking flow and one return plan.
            </p>
            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link className="comic-btn comic-btn-primary" href="/private-van">
                Reserve Van
              </Link>
              <Link className="comic-btn comic-btn-secondary" href="/find">
                View All
              </Link>
            </div>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Celebration</div>
            <h2 className="comic-h3">Party Bus</h2>
            <p className="comic-copy">
              High-energy group transport for birthdays, reunions, and big show nights.
            </p>
            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link className="comic-btn comic-btn-primary" href="/party-bus">
                Get Quote
              </Link>
              <Link className="comic-btn comic-btn-secondary" href="/find">
                Compare
              </Link>
            </div>
          </article>
        </div>

        <div className="comic-mobile-cta">
          <Link className="comic-btn comic-btn-primary" href="/book?type=shuttle">
            Continue to Booking
          </Link>
        </div>
      </section>
    </main>
  );
}
