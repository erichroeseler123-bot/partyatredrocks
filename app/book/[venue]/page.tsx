import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import venuesJson from "@/data/venues.json";
import { UnsplashImg } from "@/components/UnsplashImg";
import { TrustStrip } from "@/components/TrustStrip";
import { LegalInlineNotice } from "@/components/legal/LegalInlineNotice";
import { PlanningLinks } from "@/components/booking/PlanningLinks";
import { PrivatePromoBanner } from "@/components/booking/PrivatePromoBanner";
import { DccReturnBanner } from "@/components/booking/DccReturnBanner";
import { postDccSatelliteEvent, postWtaPartnerAcceptedIfNeeded } from "@/lib/dccSatellite";
import { getBookingVenueImage } from "@/data/media";
import { curatedImages } from "@/lib/curatedImages";
import { bookingVisuals } from "@/lib/bookingVisuals";
import { buildVenueBookingJsonLd, buildVenueBookingMetadata } from "./bookingSeo";
import { SharedBookingPage } from "./shared/SharedBookingPage";
import { buildSharedBookingMetadata } from "./shared/sharedBookingSeo";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ venue: string }>;
}): Promise<Metadata> {
  const { venue } = await params;

  const venueMedia = getBookingVenueImage(venue);
  if (venue === "red-rocks-amphitheatre") {
    return buildSharedBookingMetadata(`/book/${venue}`);
  }
  if (!venueMedia) {
    return {};
  }

  const row = getVenue(venue);
  if (!row?.name) return {};
  return buildVenueBookingMetadata({
    venue,
    venueName: row.name,
    heroImage: venueMedia.hero,
    heroAlt: venueMedia.heroAlt,
  });
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
  if (isRedRocks) {
    return SharedBookingPage({
      venue,
      searchParams: sp,
      sourcePath: `/book/${venue}`,
      basePath: `/book/${venue}`,
      stage: "shared_booking_primary",
    });
  }
  const artist = Array.isArray(sp.artist) ? sp.artist[0] : sp.artist;
  const dateRaw = Array.isArray(sp.date) ? sp.date[0] : sp.date;
  const dateLabel = dateRaw
    ? new Date(`${dateRaw}T12:00:00`).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

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

  const bookingJsonLd = buildVenueBookingJsonLd({
    venue,
    venueName: row.name,
  });

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookingJsonLd) }} />
      <section className="mx-auto flex max-w-[1120px] flex-col gap-8">
        <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
          <div className="absolute inset-0">
            <Image
              src={isRedRocks ? curatedImages.homepageHero : venueMedia?.hero || curatedImages.homepageHero}
              alt={isRedRocks ? "Red Rocks Amphitheatre at dusk" : venueMedia?.heroAlt || `${row.name} booking hero`}
              fill
              unoptimized={isRedRocks}
              className="object-cover object-center opacity-52"
              priority
              fetchPriority="high"
              sizes="(min-width: 1024px) 1120px, 100vw"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(98,246,255,0.12),transparent_36%),radial-gradient(circle_at_82%_18%,rgba(255,176,124,0.14),transparent_28%),linear-gradient(180deg,rgba(5,8,22,0.34),rgba(5,8,22,0.82)_56%,rgba(5,8,22,0.94)_100%)]" />
          </div>

          <div className="relative p-8 sm:p-10 lg:p-12">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-[#8fd0ff]/24 bg-[#8fd0ff]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
                {isRedRocks ? "Ride Types" : `${row.name} Ride Types`}
              </div>
              <h1 className="mt-5 text-[2.4rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[3.6rem] lg:text-[4.3rem]">
                {isRedRocks ? "Choose Your Red Rocks Ride" : row.name}
              </h1>
              <p className="mt-5 max-w-3xl text-[15px] leading-7 text-white/82 sm:text-lg">
                {isRedRocks
                  ? "Start with the same clean choice architecture as the private page: shared shuttle seats if you want the fixed-price move, or private SUV and van service if your group wants one vehicle and one return plan."
                  : "Choose the ride style that matches this venue, then move into the right booking path."}
              </p>

              {artist || dateLabel ? (
                <div className="mt-6 inline-flex flex-wrap items-center gap-2 rounded-[22px] border border-emerald-400/28 bg-emerald-500/10 px-4 py-3 text-sm text-white/90">
                  <span className="font-black uppercase tracking-[0.16em] text-emerald-200">Selected Night</span>
                  <span>
                    {artist || "Your show"}
                    {dateLabel ? ` · ${dateLabel}` : ""}
                  </span>
                </div>
              ) : null}

              <div className="mt-6 text-sm font-bold text-white/68">
                {[row.city, row.state].filter(Boolean).join(", ")}
              </div>

              <PlanningLinks
                venue={venue}
                source={Array.isArray(sp.source) ? sp.source[0] : sp.source}
                className="mt-6"
              />

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href={isRedRocks ? buildBookingHref({ target: "private", venue, searchParams: sp }) : buildVenueRequestHref({ venue, searchParams: sp })}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#62f6ff] bg-[#62f6ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#05111a] shadow-[0_18px_40px_rgba(61,243,255,0.24)] transition hover:bg-[#8cf8ff]"
                >
                  {isRedRocks ? "Book Private Ride" : "Request Venue Ride"}
                </Link>
                <Link
                  href={isRedRocks ? "/week/red-rocks" : `/venues/${venue}`}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/28 bg-[#152038] px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#1d2a46]"
                >
                  {isRedRocks ? "See This Week" : "Open Venue Guide"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <DccReturnBanner searchParams={sp} />

        {isRedRocks ? <PrivatePromoBanner /> : null}

        <section className="grid gap-4 lg:grid-cols-2">
          <Link
            href={
              isRedRocks
                ? buildBookingHref({ target: "private", venue, searchParams: sp })
                : buildVenueRequestHref({ venue, searchParams: sp })
            }
            className="group rounded-[28px] border border-[#62f6ff]/18 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-[#62f6ff]/38 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
          >
            {venueMedia ? (
              <div className="relative mb-4 h-44 overflow-hidden rounded-[18px] border border-white/10">
                {isRedRocks ? (
                  <Image
                    src={bookingVisuals.private.imageSrc}
                    alt={bookingVisuals.private.imageAlt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    width={960}
                    height={528}
                    unoptimized
                  />
                ) : (
                  <UnsplashImg
                    src={venueMedia.hero}
                    query={`${row.name} private concert transportation`}
                    alt={isRedRocks ? "Private ride path for Red Rocks concert nights" : venueMedia.heroAlt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    width={960}
                    height={528}
                  />
                )}
              </div>
            ) : null}
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
              Private Ride
            </div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">
              {isRedRocks ? "Step 1: Private SUV or van" : "Private Vehicle Service"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              {isRedRocks
                ? "The same private path as the SUV page: start with the Suburban-sized option, then move up to the van only if your group needs more room."
                : "Private venue transport for Denver and Boulder nights where one vehicle for the whole group makes more sense."}
            </p>
            <div className="mt-5 text-sm font-bold text-[#ffb07c]">
{isRedRocks ? "Open private options →" : "Open private booking →"}
            </div>
          </Link>

          <Link
            href={
              isRedRocks
                ? buildBookingHref({ target: "shared", venue, searchParams: sp })
                : buildVenueRequestHref({ venue, searchParams: sp })
            }
            className="group rounded-[28px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-[#62f6ff]/32 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
          >
            {venueMedia ? (
              <div className="relative mb-4 h-44 overflow-hidden rounded-[18px] border border-white/10">
                {isRedRocks ? (
                  <Image
                    src={bookingVisuals.shared.imageSrc}
                    alt={bookingVisuals.shared.imageAlt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    width={960}
                    height={528}
                    unoptimized
                  />
                ) : (
                  <UnsplashImg
                    src={venueMedia.card}
                    query={`${row.name} shared shuttle transportation`}
                    alt={venueMedia.cardAlt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    width={960}
                    height={528}
                  />
                )}
              </div>
            ) : null}
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
              Shared Shuttle
            </div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">
              {isRedRocks ? "Step 2: Start with shuttle seats" : "See Shared Ride Availability"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              {isRedRocks
                ? "Fixed-price seats, one pickup plan, and the cleanest way to keep the night simple without booking a full vehicle."
                : "Open the ride finder for current shared availability and venue options."}
            </p>
            <div className="mt-5 text-sm font-bold text-[#ffb07c]">
{isRedRocks ? "Choose shuttle seats →" : "Open ride finder →"}
            </div>
          </Link>
        </section>

        <TrustStrip />
        <LegalInlineNotice />
      </section>
    </main>
  );
}
