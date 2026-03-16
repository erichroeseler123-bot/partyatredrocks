import Link from "next/link";
import { DISPLAY } from "@/lib/display";
import { buildBookingHref } from "@/lib/parrHandoff";
import { PrivatePromoBanner } from "@/components/booking/PrivatePromoBanner";

export const metadata = {
  title: "10 Passenger Van to Red Rocks",
  description:
    "10 passenger van service for Red Rocks show nights with group pickup and coordinated return.",
};

export default function PrivateVanPage() {
  const vanHref = buildBookingHref({ target: "private-option", venue: "red-rocks-amphitheatre", option: "van" });
  const bookingHref = buildBookingHref({ target: "book", venue: "red-rocks-amphitheatre" });

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Group Transport</div>
          <h1 className="comic-title">10 Passenger Van Service</h1>
          <p className="comic-copy">
            Keep your full group together with one vehicle, one timeline, and one post-show pickup plan.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-primary" href={vanHref}>
              Get Van Options
            </Link>
            <Link className="comic-btn comic-btn-secondary" href={bookingHref}>
              Start Booking
            </Link>
          </div>
        </div>

        <PrivatePromoBanner className="mt-4" />

        <article className="comic-panel" style={{ marginTop: 14 }}>
          <img
            src={DISPLAY.images.marketing.fleet}
            alt="Private group van transportation"
            className="w-full h-52 object-cover rounded-xl border border-white/20"
            loading="lazy"
            decoding="async"
            width={640}
            height={416}
          />
          <div className="comic-grid">
            <div className="comic-panel">
              <div className="comic-tag">Capacity</div>
              <div className="comic-h3">Up to 10 Passengers</div>
              <p className="comic-copy">Ideal for birthday groups, team nights, and alumni crews.</p>
            </div>
            <div className="comic-panel">
              <div className="comic-tag">Coordination</div>
              <div className="comic-h3">One Pickup, One Return</div>
              <p className="comic-copy">Avoid split rides and surge uncertainty after the encore.</p>
            </div>
          </div>
        </article>

        <div className="comic-mobile-cta">
          <Link className="comic-btn comic-btn-primary" href={vanHref}>
            Find Van Availability
          </Link>
        </div>
      </section>
    </main>
  );
}
