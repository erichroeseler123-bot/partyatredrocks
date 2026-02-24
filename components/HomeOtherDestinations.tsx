import Link from "next/link";

export default function HomeOtherDestinations() {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-14">
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.32em] text-muted">
            Not Red Rocks?
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-black tracking-tight">
            Mishawaka + other venues
          </h2>
          <p className="mt-2 text-soft">
            Keep the homepage clean. These live on their own pages.
          </p>
        </div>

        <Link href="/venues" className="text-link">
          See all venues →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link href="/venues/mishawaka-amphitheatre" className="mini-card">
          <div className="mini-kicker">Mishawaka</div>
          <div className="mini-title">Mishawaka Amphitheatre</div>
          <div className="mini-sub">
            Venue intel + booking options on the Mish page.
          </div>
          <div className="mini-cta">Open Mish page →</div>
        </Link>

        <Link href="/book-all-venues" className="mini-card">
          <div className="mini-kicker">Other venues</div>
          <div className="mini-title">All-Venue City Service</div>
          <div className="mini-sub">
            Flat-rate private vehicle service for Denver metro venues.
          </div>
          <div className="mini-cta">See options →</div>
        </Link>
      </div>
    </section>
  );
}
