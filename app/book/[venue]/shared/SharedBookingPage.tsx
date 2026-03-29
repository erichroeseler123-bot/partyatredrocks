import { BookingVisualHero } from "@/components/booking/BookingVisualHero";
import CustomBooking from "@/components/CustomBooking";
import { DccReturnBanner } from "@/components/booking/DccReturnBanner";
import { notFound } from "next/navigation";
import venuesJson from "@/data/venues.json";
import { bookingVisuals } from "@/lib/bookingVisuals";
import { postDccSatelliteEvent, postWtaPartnerAcceptedIfNeeded } from "@/lib/dccSatellite";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildSharedBookingJsonLd } from "./sharedBookingSeo";
import { squareApplicationId, squareLocationId, squareWebSdkUrl } from "@/lib/square";

type VenueRow = {
  slug?: string;
  name?: string;
};

type SharedBookingPageInput = {
  venue: string;
  searchParams: HandoffSearchParams;
  sourcePath: string;
  basePath: string;
  stage: string;
};

function getVenue(slug: string): VenueRow | null {
  return (venuesJson as Record<string, VenueRow>)[slug] ?? null;
}

function firstValue(searchParams: HandoffSearchParams, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export async function SharedBookingPage({
  venue,
  searchParams,
  sourcePath,
  basePath,
  stage,
}: SharedBookingPageInput) {
  if (venue !== "red-rocks-amphitheatre") notFound();

  const row = getVenue(venue);
  if (!row?.name) notFound();

  const artist = firstValue(searchParams, "artist");
  const dateRaw = firstValue(searchParams, "date");
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
    searchParams,
    sourcePath,
    stage,
    booking: { venueSlug: venue },
  });

  await postWtaPartnerAcceptedIfNeeded({
    searchParams,
    sourcePath,
  });

  const jsonLd = buildSharedBookingJsonLd(basePath);

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
      <section className="mx-auto flex max-w-[1240px] flex-col gap-8">
        <BookingVisualHero
          eyebrow={bookingVisuals.shared.eyebrow}
          title={bookingVisuals.shared.title}
          copy={bookingVisuals.shared.copy}
          imageSrc={bookingVisuals.shared.imageSrc}
          imageAlt={bookingVisuals.shared.imageAlt}
        />

        <DccReturnBanner searchParams={searchParams} />

        {artist || dateLabel ? (
          <section className="rounded-2xl border border-emerald-400/28 bg-emerald-500/10 p-4 sm:p-5">
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-200">Quick ride selection</div>
            <p className="mt-2 text-sm text-white/88 sm:text-[15px]">
              You&apos;re booking for <span className="font-black text-white">{artist || "your selected artist"}</span>
              {dateLabel ? (
                <>
                  {" "}
                  on <span className="font-black text-white">{dateLabel}</span>
                </>
              ) : null}
              .
            </p>
          </section>
        ) : null}

        <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Shared Shuttle Checkout</div>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white">
            Book Your Red Rocks Shuttle
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70 sm:text-[15px]">
            Choose your pickup, select your date, and reserve your seat in seconds.
          </p>
          <div className="mt-6">
            <CustomBooking
              venue={venue}
              searchParams={searchParams}
              squareAppId={squareApplicationId()}
              squareLocationId={squareLocationId()}
              squareSdkUrl={squareWebSdkUrl()}
            />
          </div>
        </section>
      </section>
    </main>
  );
}
