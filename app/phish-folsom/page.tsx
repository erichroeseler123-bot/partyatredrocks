import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Phish at Folsom Field 2026 | Boulder Run Guide & Shuttle Rides",
  description:
    "Phish's annual Colorado run at Folsom Field in Boulder - July 31 to August 2, 2026. Tradition, tickets, planning tips, and why shuttle rides beat parking and surge pricing.",
  alternates: { canonical: `${SITE}/phish-folsom` },
};

export default function PhishFolsomPage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap max-w-4xl mx-auto">
        <div className="comic-hero text-center">
          <div className="comic-kicker">Jam Scene Special</div>
          <h1 className="comic-title">Phish at Folsom Field 2026</h1>
          <p className="comic-copy text-xl mt-4">
            The annual Colorado run returns to Folsom Field - three nights of deep jams, bust-outs, and Boulder magic.
            Plan your trip and book your ride before post-show chaos hits.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 mt-8">
            <Link href="/find?venue=ball-arena&qty=2" className="comic-btn comic-btn-primary min-w-[220px] text-center">
              Book Shuttle Ride →
            </Link>
            <Link href="/scene/jam" className="comic-btn comic-btn-secondary min-w-[220px] text-center">
              Back to Jam Scene
            </Link>
          </div>
        </div>

        <section className="comic-panel mt-12">
          <div className="comic-tag">The Tradition Continues</div>
          <h2 className="comic-h3 mt-6">From Dick's to Folsom Field</h2>
          <p className="comic-copy mt-4">
            Phish's Colorado summer run has been a staple since 2011 - first at Dick's Sporting Goods Park in Commerce
            City (2011-2023), where fans turned the venue into a massive "Phish city" with camping, tailgating, and
            legendary late-night sets. In 2024, the band moved the run to Folsom Field on the University of Colorado
            Boulder campus - a historic stadium with mountain views, better acoustics, and a more central location. The
            switch proved popular, and the 2026 Phish at Folsom Field run is already confirmed as the biggest jam event
            in the state.
          </p>
          <p className="comic-copy mt-4">
            Expect deep jams, bust-outs, and the classic Phish experience - three nights of magic under the Flatirons.
          </p>
        </section>

        <section className="comic-panel mt-8">
          <div className="comic-tag">2026 Run Details</div>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="font-bold text-lg">Dates & Venue</h3>
              <ul className="comic-copy mt-2 space-y-2">
                <li>
                  <strong>Dates</strong>: July 31 - August 2, 2026 (Fri-Sun)
                </li>
                <li>
                  <strong>Venue</strong>: Folsom Field, Boulder, CO (University of Colorado campus)
                </li>
                <li>
                  <strong>Capacity</strong>: ~50,000 per night (outdoor stadium setup)
                </li>
                <li>
                  <strong>Lineup</strong>: Phish (full band sets, no openers announced yet)
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg">Tickets & Logistics</h3>
              <ul className="comic-copy mt-2 space-y-2">
                <li>
                  <strong>Tickets</strong>: On sale now via Ticketmaster / Phish.com
                </li>
                <li>
                  <strong>Seating</strong>: General admission lawn + reserved seating
                </li>
                <li>
                  <strong>Camping/Parking</strong>: Limited on-campus options; most fans stay in Boulder hotels/Airbnb
                  or nearby camping (Nederland, Lyons)
                </li>
                <li>
                  <strong>Traffic Note</strong>: I-25 and US-36 get slammed post-show - pre-book rides
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="comic-panel mt-8">
          <div className="comic-tag">Why Shuttle Demand Spikes for Phish</div>
          <p className="comic-copy mt-4">
            Folsom Field is ~45 minutes from Denver/Boulder metro - I-25 and US-36 become gridlock after the show.
            Uber/Lyft surge pricing often hits $100-$200+ per ride. Your group needs reliable, pre-booked transport -
            especially for late-night returns.
          </p>

          <h3 className="comic-h3 mt-6">Your Shuttle Pricing for Phish Runs</h3>
          <div className="comic-copy mt-4 space-y-2">
            <p>
              <strong>Red Rocks rates (if applicable for side shows)</strong>: Suburban $499, 10-pass van $699,
              14-pass van $799, 20-pass bus $1,000 round-trip
            </p>
            <p>
              <strong>Other Denver/Boulder venues (including Folsom-area pickups)</strong>: $250 flat suburban
              round-trip (up to 6-7 passengers)
            </p>
            <p>
              <strong>Mishawaka-style shared</strong>: Not applicable for this scale - private bookings recommended
            </p>
            <p className="font-semibold mt-4">
              All prices are round-trip (pickup before show + return after). Book early - Phish runs create massive
              demand.
            </p>
          </div>

          <div className="flex justify-center mt-8">
            <Link href="/find?venue=ball-arena&qty=2" className="comic-btn comic-btn-primary min-w-[280px] text-center">
              Book Your Phish Shuttle Ride Now →
            </Link>
          </div>
        </section>

        <section className="comic-panel mt-8">
          <div className="comic-tag">Pro Tips for Phish Fans</div>
          <ul className="comic-copy mt-4 space-y-3 list-disc pl-6">
            <li>Arrive 90-120 min before doors - parking/traffic buffer is key</li>
            <li>Pre-arrange pickup point away from main exits to avoid gridlock</li>
            <li>
              Stay hydrated, respect the lot scene, and have your ride locked in - it's a long, beautiful night
            </li>
            <li>Group bookings save money - vans/buses for 10-20 people are perfect for Phish crews</li>
          </ul>
        </section>

        <section className="comic-panel mt-12 text-center">
          <h2 className="comic-h3">Ready for Phish at Folsom Field?</h2>
          <p className="comic-copy mt-4">
            Secure your ride before surge pricing and parking stress - book now and enjoy the run.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <Link href="/find?venue=ball-arena&qty=2" className="comic-btn comic-btn-primary min-w-[240px]">
              Book Shuttle →
            </Link>
            <Link href="/scene/jam" className="comic-btn comic-btn-secondary min-w-[240px]">
              Back to Jam Scene →
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
