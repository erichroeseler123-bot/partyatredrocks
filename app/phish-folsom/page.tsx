import type { Metadata } from "next";
import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Phish at Folsom Field 2026 | Boulder Run Shuttle Guide",
  description:
    "Phish at Folsom Field in Boulder, July 31 to August 2, 2026. Run details, transport planning, and direct shuttle booking links.",
  alternates: { canonical: `${SITE}/phish-folsom` },
};

export default function PhishFolsomPage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Special Event Guide</div>
          <h1 className="comic-title">Phish at Folsom Field: The Annual Colorado Run</h1>
          <p className="comic-copy">
            Three nights in Boulder now anchor one of the largest jam weekends in Colorado. If you are planning this run,
            transport setup matters as much as tickets.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/find?venue=ball-arena&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[220px] text-center">
              Book Shuttle for Phish →
            </Link>
            <Link href="/scene/jam" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[220px] text-center">
              Back to Jam Scene
            </Link>
          </div>
        </div>

        <section className="comic-grid mt-8">
          <article className="comic-panel">
            <div className="comic-tag">2026 Run Details</div>
            <ul className="comic-copy mt-4 space-y-2 list-disc pl-6">
              <li>Dates: July 31 to August 2, 2026 (Friday to Sunday).</li>
              <li>Venue: Folsom Field, Boulder, Colorado.</li>
              <li>Scale: Stadium-size jam crowd with heavy post-show egress pressure.</li>
              <li>Tickets: Check Phish.com and Ticketmaster for current inventory.</li>
            </ul>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Why Demand Spikes</div>
            <ul className="comic-copy mt-4 space-y-2 list-disc pl-6">
              <li>US-36 and Boulder corridors compress after each night.</li>
              <li>Rideshare surge after encore can be extreme on large runs.</li>
              <li>Out-of-state groups need fixed return plans, not ad hoc pickups.</li>
              <li>Pre-booked return logistics reduce curb chaos and wait times.</li>
            </ul>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Ride Planning Tips</div>
            <ul className="comic-copy mt-4 space-y-2 list-disc pl-6">
              <li>Arrive 90 to 120 minutes before doors for smoother ingress.</li>
              <li>Pick a post-show meetup point away from primary exits.</li>
              <li>Book group transport early for all three nights when possible.</li>
              <li>Use one coordinator contact so pickup messaging stays clean.</li>
            </ul>
          </article>
        </section>

        <section className="comic-panel mt-8">
          <div className="comic-tag">Shuttle Pricing Context</div>
          <p className="comic-copy mt-4">
            For large-demand nights like this, private group transport is usually the most reliable option. Current venue
            routing can be booked from the finder flow using the linked CTA above.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 w-full px-4">
            <Link href="/find?venue=ball-arena&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[220px] text-center">
              Reserve Return Ride
            </Link>
            <Link href="/scene/jam" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[220px] text-center">
              More Jam Shows
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
