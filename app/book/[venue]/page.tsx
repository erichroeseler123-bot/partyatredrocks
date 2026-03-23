import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import venuesJson from "@/data/venues.json";
import { UnsplashImg } from "@/components/UnsplashImg";
import { TrustStrip } from "@/components/TrustStrip";
import { PlanningLinks } from "@/components/booking/PlanningLinks";
import { PrivatePromoBanner } from "@/components/booking/PrivatePromoBanner";
import { DccReturnBanner } from "@/components/booking/DccReturnBanner";
import { postDccSatelliteEvent, postWtaPartnerAcceptedIfNeeded } from "@/lib/dccSatellite";
import { getBookingVenueImage } from "@/data/media";
import {
  buildBookingHref,
  buildVenueRequestHref,
  type HandoffSearchParams,
} from "@/lib/parrHandoff";

type VenueRow = {
  slug?: string;
  name?: string;
  city?: string;
  state?: string;
  kind?: string;
};

function getVenue(slug: string): VenueRow | null {
  return (venuesJson as Record<string, VenueRow>)[slug] ?? null;
}

const RED_ROCKS_PRIVATE_CATALOG_WIDGET_URL =
  "https://gosnotransportation58.rezdy.com/catalog/541037/party-at-red-rocks?iframe=true";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ venue: string }>;
}): Promise<Metadata> {
  const { venue } = await params;

  const venueMedia = getBookingVenueImage(venue);
  if (!venueMedia) {
    return {};
  }

  return {
    openGraph: {
      images: [
        {
          url: `https://www.partyatredrocks.com${venueMedia.hero}`,
          width: 1200,
          height: 630,
          alt: venueMedia.heroAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [`https://www.partyatredrocks.com${venueMedia.hero}`],
    },
  };
}

export default async function VenueBookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ venue: string }>;
  searchParams: Promise<HandoffSearchParams>;
}) {
  const { venue } = await params;
  const sp = await searchParams;
  const row = getVenue(venue);
  if (!row?.slug || !row?.name) notFound();

  const isRedRocks = venue === "red-rocks-amphitheatre";
  const venueMedia = getBookingVenueImage(venue);

  await postDccSatelliteEvent({
    eventType: "handoff_viewed",
    searchParams: sp,
    sourcePath: `/book/${venue}`,
    stage: "venue_selection",
    booking: { venueSlug: venue },
  });

  await postWtaPartnerAcceptedIfNeeded({
    searchParams: sp,
    sourcePath: `/book/${venue}`,
  });

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1240px] flex-col gap-8">
        <section className="relative min-h-[60vh] overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.92),rgba(6,9,18,0.88))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:min-h-[72vh] sm:p-10 lg:min-h-[90vh] lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,91,46,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(143,208,255,0.14),transparent_28%)]" />
          {venueMedia ? (
            <div className="absolute inset-0">
              <Image
                src={venueMedia.hero}
                alt={venueMedia.heroAlt}
                fill
                className="object-cover object-center opacity-70 brightness-95"
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 1240px, 100vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(5,8,22,0.38)_0%,rgba(5,8,22,0.16)_45%,rgba(5,8,22,0.52)_100%)]" />
            </div>
          ) : null}
          <div className="relative flex min-h-[calc(60vh-4rem)] max-w-3xl flex-col justify-center sm:min-h-[calc(72vh-5rem)] lg:min-h-[calc(90vh-6rem)]">
            <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
              {isRedRocks ? "Red Rocks Shuttle Booking" : `${row.name} Shuttle Booking`}
            </div>
            <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] drop-shadow-[0_10px_32px_rgba(0,0,0,0.65)] sm:text-[4rem] lg:text-[5rem]">
              {isRedRocks ? "Elevate Your Red Rocks Night" : row.name}
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/86 drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)] sm:text-lg">
              {isRedRocks
                ? "Fixed $59 shuttles, private SUVs and party buses, a guaranteed ride home, and less post-show chaos. Book around the Red Rocks nights people are actually planning for."
                : "Choose the ride style that matches this venue, then move into the right booking page."}
            </p>
            <div className="mt-6 text-sm font-bold text-white/68">
              {[row.city, row.state].filter(Boolean).join(", ")}
            </div>
            <PlanningLinks
              venue={venue}
              source={Array.isArray(sp.source) ? sp.source[0] : sp.source}
              className="mt-6"
            />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={isRedRocks ? buildBookingHref({ target: "shared", venue, searchParams: sp }) : buildVenueRequestHref({ venue, searchParams: sp })}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ffd6a3]/28 bg-[linear-gradient(180deg,#a95f28_0%,#8d4f20_100%)] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#120f0b] transition hover:bg-[linear-gradient(180deg,#b66c31_0%,#975321_100%)]"
              >
                {isRedRocks ? "Book Shuttle Seats" : "Request Venue Ride"}
              </Link>
              <Link
                href={isRedRocks ? "/week/red-rocks" : `/venues/${venue}`}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-black/20 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                {isRedRocks ? "See This Week" : "Open Venue Guide"}
              </Link>
            </div>
          </div>
        </section>

        <DccReturnBanner searchParams={sp} />

        {isRedRocks ? <PrivatePromoBanner /> : null}

        {isRedRocks ? (
          <section className="overflow-visible rounded-[30px] border border-white/10 bg-[#0b1224] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-6">
            <Script src="https://gosnotransportation58.rezdy.com/pluginJs" strategy="afterInteractive" />
            <div className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
              Red Rocks Booking
            </div>
            <h2 className="text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">
              Book Your Ride Now
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70 sm:text-[15px]">
              Jump straight into the live Red Rocks private vehicle widget if you already know this is the night and want the fastest path to booking.
            </p>
            <TrustStrip className="mb-4 mt-5" />
            <iframe
              seamless
              width="100%"
              height="1000"
              frameBorder="0"
              className="rezdy w-full rounded-[20px] border-0 bg-white"
              src={RED_ROCKS_PRIVATE_CATALOG_WIDGET_URL}
              title="Red Rocks private vehicle booking widget"
            />
          </section>
        ) : null}

        <section className="grid gap-4 lg:grid-cols-2">
          <Link
            href={
              isRedRocks
                ? buildBookingHref({ target: "shared", venue, searchParams: sp })
                : buildVenueRequestHref({ venue, searchParams: sp })
            }
            className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
          >
            {venueMedia ? (
              <div className="relative mb-4 h-44 overflow-hidden rounded-[18px] border border-white/10">
                <UnsplashImg
                  src={venueMedia.card}
                  query={`${row.name} shared shuttle transportation`}
                  alt={venueMedia.cardAlt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  width={960}
                  height={528}
                />
              </div>
            ) : null}
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
              Shared Shuttle
            </div>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">
              {isRedRocks ? "Per-Person Shuttle Seats" : "See Shared Ride Availability"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              {isRedRocks
                ? "Seat-based shuttle options with round-trip service and online booking."
                : "Open the ride finder for current shared availability and venue options."}
            </p>
            <div className="mt-5 text-sm font-bold text-[#ffb07c]">
              {isRedRocks ? "Choose shared shuttle →" : "Open ride finder →"}
            </div>
          </Link>

          <Link
            href={
              isRedRocks
                ? buildBookingHref({ target: "private", venue, searchParams: sp })
                : buildVenueRequestHref({ venue, searchParams: sp })
            }
            className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
          >
            {venueMedia ? (
              <div className="relative mb-4 h-44 overflow-hidden rounded-[18px] border border-white/10">
                <UnsplashImg
                  src={venueMedia.hero}
                  query={`${row.name} private concert transportation`}
                  alt={isRedRocks ? "Private ride path for Red Rocks concert nights" : venueMedia.heroAlt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  width={960}
                  height={528}
                />
              </div>
            ) : null}
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
              Private Ride
            </div>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">
              {isRedRocks ? "SUV, Van, Sprinter, or Party Bus" : "Private Vehicle Service"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              {isRedRocks
                ? "Private vehicle options for couples, crews, and larger groups with online booking."
                : "Private venue transport for Denver and Boulder nights where one vehicle for the whole group makes more sense."}
            </p>
            <div className="mt-5 text-sm font-bold text-[#ffb07c]">
              {isRedRocks ? "Choose private option →" : "Open private booking →"}
            </div>
          </Link>
        </section>

        <TrustStrip />
      </section>
    </main>
  );
}
