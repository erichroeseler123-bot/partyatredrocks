import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Best Time to Arrive at Red Rocks | Parking, Shuttle & Entry Tips",
  description:
    "When to arrive at Red Rocks Amphitheatre for concerts in 2026. Recommended arrival windows, parking lot strategy, shuttle meetup timing, and how early entry affects your night.",
  alternates: { canonical: `${SITE}/red-rocks/best-time-to-arrive` },
};

export default function BestTimeToArrivePage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Show Night Logistics</div>
          <h1 className="comic-title">Best Time to Arrive at Red Rocks</h1>
          <p className="comic-copy">
            Timing is everything at Red Rocks. Arrive too late and you fight parking plus stairs; too early and you wait in the
            cold. Use this practical 2026 timing guide.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 w-full px-4">
            <Link href="/book?venue=red-rocks-amphitheatre" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[180px] text-center">
              Book Shuttle - Lock Return
            </Link>
            <Link href="/red-rocks/parking" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
              Parking Guide
            </Link>
            <Link href="/red-rocks/transportation" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
              Shuttle and Rideshare
            </Link>
          </div>
        </div>

        <div className="comic-grid" style={{ marginTop: 32 }}>
          <article className="comic-panel">
            <div className="comic-tag">General Rule</div>
            <h2 className="comic-h3" style={{ marginTop: 12 }}>
              Arrive 2.5 to 3.5 hours before doors
            </h2>
            <p className="comic-copy" style={{ marginTop: 8 }}>
              Doors are usually 1.5 to 2 hours before show start. Add buffer for I-70 and Alameda traffic, lot queues, a 15 to
              30 minute stair climb, and security checks.
            </p>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">By Lot and Ticket Type</div>
            <ul style={{ marginTop: 12, paddingLeft: 20, listStyleType: "disc" }}>
              <li className="comic-copy mb-3">
                <strong>Lower South / preferred parking:</strong> 2 to 2.5 hours before doors.
              </li>
              <li className="comic-copy mb-3">
                <strong>Upper North / general parking:</strong> 3 to 3.5 hours before doors.
              </li>
              <li className="comic-copy mb-3">
                <strong>Shuttle riders:</strong> arrive at pickup 2.5 to 3 hours before show.
              </li>
              <li className="comic-copy">
                <strong>First-timers or upper rows:</strong> add 30 to 45 extra minutes for stairs and altitude.
              </li>
            </ul>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Post-Show Reality</div>
            <p className="comic-copy" style={{ marginTop: 12 }}>
              Encore usually ends around 11:00 to 11:30 PM. Set your exit plan before the last song, because pickup pressure
              peaks in the next 15 to 30 minutes.
            </p>
            <p className="comic-copy" style={{ marginTop: 12, fontWeight: 700 }}>
              Best move: pre-book return transportation.
            </p>
            <div style={{ marginTop: 16 }}>
              <Link href="/book?venue=red-rocks-amphitheatre" className="comic-btn comic-btn-primary w-full text-center">
                Book Return Ride
              </Link>
            </div>
          </article>
        </div>

        <section className="comic-panel" style={{ marginTop: 32 }}>
          <div className="comic-tag">Related Guides</div>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 w-full px-4">
            <Link href="/red-rocks/seating-chart" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
              Seating Chart
            </Link>
            <Link href="/red-rocks/parking" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
              Parking Strategy
            </Link>
            <Link href="/red-rocks/map" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
              Interactive Map
            </Link>
            <Link href="/red-rocks/transportation" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
              Shuttle vs Uber vs Driving
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
