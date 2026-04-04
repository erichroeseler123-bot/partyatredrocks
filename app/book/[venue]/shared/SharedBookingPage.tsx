import CustomBooking from "@/components/CustomBooking";
import { DccReturnBanner } from "@/components/booking/DccReturnBanner";
import { LegalInlineNotice } from "@/components/legal/LegalInlineNotice";
import { notFound } from "next/navigation";
import venuesJson from "@/data/venues.json";
import { bookingVisuals } from "@/lib/bookingVisuals";
import { postDccSatelliteEvent, postWtaPartnerAcceptedIfNeeded } from "@/lib/dccSatellite";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildSharedBookingJsonLd } from "./sharedBookingSeo";
import { squareApplicationId, squareLocationId, squareWebSdkUrl } from "@/lib/square";
import Image from "next/image";

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
        <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
          <div className="absolute inset-0">
            <Image
              src={bookingVisuals.shared.imageSrc}
              alt={bookingVisuals.shared.imageAlt}
              fill
              unoptimized
              priority
              className="object-cover object-center opacity-42"
              sizes="(min-width: 1024px) 1240px, 100vw"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(98,246,255,0.12),transparent_38%),radial-gradient(circle_at_82%_18%,rgba(255,176,124,0.14),transparent_28%),linear-gradient(180deg,rgba(5,8,22,0.34),rgba(5,8,22,0.82)_56%,rgba(5,8,22,0.94)_100%)]" />
          </div>
          <div className="relative p-8 sm:p-10 lg:p-12">
            <div className="max-w-4xl">
              <div className="inline-flex items-center rounded-full border border-[#8fd0ff]/24 bg-[#8fd0ff]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
                Shared Shuttle
              </div>
              <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] text-white sm:text-[4rem]">
                Book Your $59 Shared Shuttle Tickets
              </h1>
              <p className="mt-5 max-w-3xl text-[15px] leading-7 text-white/80 sm:text-lg">
                Pick Denver or Golden, choose your date, and lock your shuttle seats without bouncing through extra choice screens.
              </p>
            </div>
          </div>
        </section>

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
            Choose Your Pickup And Book
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70 sm:text-[15px]">
            Denver vs. Golden is the main decision here. After that, move straight into date, seats, rider info, and payment.
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
          <LegalInlineNotice className="mt-6" />
        </section>
      </section>
    </main>
  );
}
