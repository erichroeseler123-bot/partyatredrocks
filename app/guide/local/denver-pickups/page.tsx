import Link from "next/link";
import type { Metadata } from "next";
import ShuttleCTA from "@/components/cta/ShuttleCTA";
import { buildPageIntentMetadata } from "@/lib/pageIntentMetadata";
import { buildUnsplashImageSrc } from "@/lib/unsplash";

export const metadata: Metadata = {
  ...buildPageIntentMetadata("/guide/local/denver-pickups"),
  title: "Denver Pickup Locations for Red Rocks Shuttles | Party at Red Rocks",
  description:
    "Denver pickup location for Party at Red Rocks shuttle riders. Confirm the Sheraton Downtown pickup, see how the ride works, and book your Red Rocks transportation.",
  alternates: {
    canonical: "https://www.partyatredrocks.com/guide/local/denver-pickups",
  },
  openGraph: {
    title: "Denver Pickup Locations for Red Rocks Shuttles | Party at Red Rocks",
    description:
      "Sheraton Downtown pickup details, shuttle timing, and direct booking for Red Rocks transportation.",
    url: "https://www.partyatredrocks.com/guide/local/denver-pickups",
    type: "article",
  },
};

const PICKUP_ADDRESS = "1550 Court Pl, Denver, CO 80202";
const SHARED_BOOKING_PATH = "/book/red-rocks-amphitheatre/custom/shared";
const PRIVATE_BOOKING_PATH = "/book/red-rocks-amphitheatre/private";

export default function DenverPickups() {
  const shareImage = `https://www.partyatredrocks.com${buildUnsplashImageSrc({
    query: "downtown denver shuttle pickup red rocks",
    src: "/hero/hero-home.jpg",
    alt: "Downtown Denver Red Rocks shuttle pickup",
    width: 1200,
    height: 630,
  })}`;

  const localSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Party at Red Rocks",
    url: "https://www.partyatredrocks.com",
    image: shareImage,
    address: {
      "@type": "PostalAddress",
      streetAddress: "1550 Court Pl",
      addressLocality: "Denver",
      addressRegion: "CO",
      postalCode: "80202",
    },
    geo: { "@type": "GeoCoordinates", latitude: 39.743, longitude: -104.9897 },
    priceRange: "$59-$599",
    areaServed: ["Denver, CO", "Morrison, CO", "Denver Metro"],
  };

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />

      <section className="mx-auto flex max-w-[1120px] flex-col gap-8">
        <section id="downtown-pickup" className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="inline-flex items-center rounded-full border border-[#8fd0ff]/30 bg-[#8fd0ff]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Denver Pickup
          </div>
          <h1 className="mt-5 max-w-4xl text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem]">
            Denver Pickup Locations for Red Rocks Shuttles
          </h1>
          <p className="mt-5 max-w-3xl text-[15px] leading-7 text-white/80 sm:text-lg">
            If you are looking for the Denver pickup spot for Red Rocks transportation, you are in the right place. Our main downtown pickup is the Sheraton Denver Downtown. From here, you can book shuttle seats for $59 or upgrade to a private vehicle for your group.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8fd0ff]">Pickup Address</div>
              <div className="mt-3 text-base font-semibold text-white">{PICKUP_ADDRESS}</div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8fd0ff]">Arrival Buffer</div>
              <div className="mt-3 text-base font-semibold text-white">Arrive 45 minutes before departure</div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8fd0ff]">Return Plan</div>
              <div className="mt-3 text-base font-semibold text-white">Ride back staged after the show</div>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={SHARED_BOOKING_PATH} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#62f6ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#8cf8ff]">
              Book $59 Shuttle Seats
            </Link>
            <Link href={PRIVATE_BOOKING_PATH} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10">
              Book Private SUV or Van
            </Link>
            <Link href="/week/red-rocks" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10">
              See This Week&apos;s Shows
            </Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section id="hotel-pickup" className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
            <div className="text-[22px] font-black uppercase tracking-[0.18em] text-[#ffb07c] sm:text-[24px]">Step 1</div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">Go to the Sheraton Downtown pickup</h2>
            <p className="mt-3 text-[15px] leading-7 text-white/74">
              The Sheraton Denver Downtown is the main staging point for riders leaving from downtown. It is the simplest pickup for most guests staying in central Denver.
            </p>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-white/76 sm:text-base">
              <li><strong className="text-white">Official pickup:</strong> {PICKUP_ADDRESS}</li>
              <li><strong className="text-white">Best practice:</strong> arrive early enough to check in without rushing</li>
              <li><strong className="text-white">Vehicle mix:</strong> shuttles for shared riders, SUVs and vans for private groups</li>
              <li><strong className="text-white">After the show:</strong> the return ride is already planned before you leave Denver</li>
            </ul>
          </section>

          <section id="private-pickup" className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
            <div className="text-[22px] font-black uppercase tracking-[0.18em] text-[#ffb07c] sm:text-[24px]">Step 2</div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">Choose the booking path that fits your night</h2>
            <div className="mt-6 grid gap-4">
              <Link href={SHARED_BOOKING_PATH} className="rounded-[24px] border border-[#62f6ff]/28 bg-[#09101f] p-5 transition hover:border-[#62f6ff]/48 hover:bg-[#0d1629] hover:no-underline">
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#62f6ff]">Most Popular</div>
                <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">$59 Shuttle Seats</h3>
                <p className="mt-3 text-sm leading-7 text-white/72">Best for solo riders and small groups who want the simplest fixed-price route to Red Rocks.</p>
                <div className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#62f6ff] px-5 text-sm font-black uppercase tracking-[0.16em] text-[#07111d]">Book Shuttle</div>
              </Link>
              <Link href={PRIVATE_BOOKING_PATH} className="rounded-[24px] border border-white/12 bg-black/15 p-5 transition hover:bg-black/25 hover:no-underline">
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ffb07c]">Upgrade</div>
                <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">Private SUV or Van</h3>
                <p className="mt-3 text-sm leading-7 text-white/72">Best for groups that want one vehicle, one pickup plan, and a guaranteed ride back together.</p>
                <div className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-white/14 bg-white/6 px-5 text-sm font-black uppercase tracking-[0.16em] text-white">Book Private Ride</div>
              </Link>
            </div>
          </section>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
            <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Map</div>
            <div className="mt-5 aspect-square min-h-[320px] overflow-hidden rounded-[24px] border border-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.35)] md:aspect-auto md:h-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.439164214555!2d-104.99227562402128!3d39.74301597155639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876c78d052848c41%3A0xe212879659b85c8e!2sSheraton%20Denver%20Downtown%20Hotel!5e0!3m2!1sen!2sus!4v1706990100000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sheraton Denver Downtown pickup map"
              />
            </div>
          </section>

          <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
            <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">What Riders Need to Know</div>
            <div className="mt-5 grid gap-4">
              <div className="rounded-[22px] border border-white/10 bg-black/15 p-5 text-sm leading-7 text-white/76">
                <strong className="text-white">This page is for booking transport.</strong> If you came here from an old downtown pickup link, the next move is not to keep browsing. Pick your ride and lock it in.
              </div>
              <div className="rounded-[22px] border border-white/10 bg-black/15 p-5 text-sm leading-7 text-white/76">
                If you just need a seat, use the shuttle booking flow. If you are coordinating a group, go straight to the private ride page.
              </div>
              <div className="rounded-[22px] border border-white/10 bg-black/15 p-5 text-sm leading-7 text-white/76">
                For hotel and downtown traffic, this Sheraton pickup is the core reference point. You do not need to hunt through multiple guide pages to move forward.
              </div>
              <div className="mt-2 flex flex-wrap gap-3">
                <a href="https://www.marriott.com/en-us/hotels/dencc-sheraton-denver-downtown-hotel/overview/" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/6 px-4 text-xs font-black uppercase tracking-[0.16em] text-white/88 transition hover:bg-white/10">
                  Sheraton Details
                </a>
                <Link href="/red-rocks/transportation" className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/6 px-4 text-xs font-black uppercase tracking-[0.16em] text-white/88 transition hover:bg-white/10">
                  Transportation Guide
                </Link>
              </div>
            </div>
          </section>
        </section>

        <ShuttleCTA
          title="Downtown Denver Pickup to Red Rocks"
          blurb="Sheraton Downtown pickup, fixed-price shuttle seats, private vehicle upgrades, and a return ride after the show."
          href={SHARED_BOOKING_PATH}
          button="Book Denver Shuttle"
        />
      </section>
    </main>
  );
}
