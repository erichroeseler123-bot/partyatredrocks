import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { buildBookingHref, type HandoffSearchParams } from "@/lib/parrHandoff";
import { BookingVisualHero } from "@/components/booking/BookingVisualHero";
import { DccReturnBanner } from "@/components/booking/DccReturnBanner";
import { LegalInlineNotice } from "@/components/legal/LegalInlineNotice";
import { PrivateBookingForm } from "@/components/booking/PrivateBookingForm";
import { RezdyBookingEmbed } from "@/components/booking/rezdy/RezdyBookingEmbed";
import { bookingVisuals } from "@/lib/bookingVisuals";
import { postDccSatelliteEvent, postWtaPartnerAcceptedIfNeeded } from "@/lib/dccSatellite";
import {
  getPrivateRideOption,
  isPublicPrivateRideSlug,
  SUBURBAN_PRICE_LABEL,
  VAN_PRICE_LABEL,
  type PrivateRideSlug,
} from "@/lib/rideCatalog";
import { getPrivateRidePricingForDate, PARR_VALUE_PROPOSITION } from "@/lib/pricing";
import { squareApplicationId, squareLocationId, squareWebSdkUrl } from "@/lib/square";
import { buildPrivateOptionJsonLd, buildPrivateOptionMetadata } from "../../bookingSeo";

const REZDY_PRIVATE_PRODUCTS = {
  suv: {
    productId: "596193",
    productName: "Suburban",
    rezdyUrl: "https://gosnotransportation58.rezdy.com/596193/suburban?iframe=true",
  },
  van: {
    productId: "630812",
    productName: "10 Passenger Van",
    rezdyUrl: "https://gosnotransportation58.rezdy.com/630812/van-10-passenger?iframe=true",
  },
} as const;

function firstValue(searchParams: HandoffSearchParams, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ venue: string; option: PrivateRideSlug }>;
}): Promise<Metadata> {
  const { venue, option } = await params;
  if (venue !== "red-rocks-amphitheatre") return {};

  const rideOption = getPrivateRideOption(option);
  if (!rideOption) return {};
  if (!isPublicPrivateRideSlug(option)) {
    return {
      title: `${rideOption.title} | Party at Red Rocks`,
      robots: { index: false, follow: false },
    };
  }

  return buildPrivateOptionMetadata({
    venue,
    optionSlug: rideOption.slug,
    optionTitle: rideOption.title,
    optionBody: rideOption.body,
    optionPriceLabel: rideOption.priceLabel,
  });
}

export default async function PrivateOptionPage({
  params,
  searchParams,
}: {
  params: Promise<{ venue: string; option: PrivateRideSlug }>;
  searchParams: Promise<HandoffSearchParams>;
}) {
  const { venue, option } = await params;
  const sp = await searchParams;

  if (venue !== "red-rocks-amphitheatre") notFound();

  const rideOption = getPrivateRideOption(option);
  if (!rideOption) notFound();
  if (!isPublicPrivateRideSlug(rideOption.slug)) redirect(`/book/${venue}/private/suv`);

  const qtyValue = firstValue(sp, "qty");
  const vehicleQty = qtyValue ? Math.max(1, Number(qtyValue) || 1) : 1;
  const jsonLd = buildPrivateOptionJsonLd({
    venue,
    optionSlug: rideOption.slug,
    optionTitle: rideOption.title,
    optionBody: rideOption.body,
    optionPriceLabel: rideOption.priceLabel,
    quantity: vehicleQty,
  });

  const artist = firstValue(sp, "artist") || firstValue(sp, "event");
  const pickup = firstValue(sp, "pickup");
  const dateRaw = firstValue(sp, "date");
  const dateLabel = dateRaw
    ? new Date(`${dateRaw}T12:00:00`).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const sourcePath = `/book/${venue}/private/${rideOption.slug}`;

  await postDccSatelliteEvent({
    eventType: "handoff_viewed",
    searchParams: sp,
    sourcePath,
    stage: "private_booking_form",
    booking: { venueSlug: venue, quantity: vehicleQty, productSlug: rideOption.slug },
  });

  await postWtaPartnerAcceptedIfNeeded({
    searchParams: sp,
    sourcePath,
  });

  const pricingInfo = getPrivateRidePricingForDate({ optionSlug: rideOption.slug, serviceDate: dateRaw });
  const otherSlug = rideOption.slug === "suv" ? "van" : "suv";
  const switchVehicleHref = buildBookingHref({
    target: "private-option",
    venue,
    option: otherSlug,
    searchParams: sp,
    overrides: { qty: vehicleQty },
  });
  const backToCompareHref = buildBookingHref({
    target: "private",
    venue,
    searchParams: sp,
  });

  return (
    <main className="min-h-screen bg-[#070b14] px-4 pb-16 pt-6 text-white sm:px-6 sm:pt-8 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="mx-auto flex max-w-[1240px] flex-col gap-6">
        {/* Step Progress Bar */}
        <nav aria-label="Booking progress" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0d1424] px-4 py-3 text-[11px] font-bold uppercase tracking-wider">
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <Link href="/red-rocks/concerts" className="text-white/65 no-underline hover:text-white">
              1. Event / Date
            </Link>
            <Link href={backToCompareHref} className="text-white/65 no-underline hover:text-white">
              2. {rideOption.slug === "suv" ? "Private Suburban" : "Private Van"}
            </Link>
            <span className="font-black text-[#ffb07c]">3. Confirm Pickup &amp; Book</span>
          </div>
          <Link href={switchVehicleHref} className="text-[#ffb07c] underline hover:text-white">
            {rideOption.slug === "suv"
              ? `Need up to 10 seats? Switch to Private Van (${VAN_PRICE_LABEL}) →`
              : `6 or fewer guests? Switch to Suburban (${SUBURBAN_PRICE_LABEL}) →`}
          </Link>
        </nav>

        <BookingVisualHero
          eyebrow={`${pricingInfo.roundTripLabel} · ${rideOption.slug === "suv" ? "Up to 6 Guests" : "Up to 10 Guests"}`}
          title={rideOption.slug === "suv" ? "Private Suburban Booking" : "Private Van Booking"}
          copy={rideOption.body}
          imageSrc={bookingVisuals.privateOptions[rideOption.slug]?.imageSrc || bookingVisuals.private.imageSrc}
          imageAlt={bookingVisuals.privateOptions[rideOption.slug]?.imageAlt || bookingVisuals.private.imageAlt}
        />

        <DccReturnBanner searchParams={sp} />

        {artist || dateLabel || pickup ? (
          <section className="rounded-2xl border border-emerald-400/35 bg-emerald-500/12 p-4 sm:p-5">
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-200">
              Selected Trip Summary
            </div>
            <p className="mt-1.5 text-sm text-white/90 sm:text-[15px]">
              Booking <strong className="text-white">{rideOption.slug === "suv" ? "Private Suburban" : "Private Van"}</strong>{" "}
              ({pricingInfo.roundTripLabel})
              {artist ? (
                <>
                  {" "}
                  for <strong className="text-white">{artist}</strong>
                </>
              ) : null}
              {dateLabel ? (
                <>
                  {" "}
                  on <strong className="text-white">{dateLabel}</strong>
                </>
              ) : null}
              {pickup ? (
                <>
                  {" "}
                  · Pickup area: <strong className="text-white">{pickup}</strong>
                </>
              ) : null}
              .
            </p>
          </section>
        ) : null}

        <section className="rounded-[30px] border border-white/10 bg-[#0d1424] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-8">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
                Confirm Pickup &amp; Lock Your Date
              </div>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">
                Complete Your {rideOption.slug === "suv" ? "Private Suburban" : "Private Van"} Reservation
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/80">
                Enter your exact hotel, Airbnb, or home pickup address inside checkout below. Your flat{" "}
                <strong className="text-white">{pricingInfo.roundTripLabel}</strong> includes Upper North Lot tailgating gear (chairs, cooler, speaker &amp; ice), a dedicated driver waiting through the concert, and your return ride home.
              </p>
              <p className="mt-1.5 text-xs text-white/60">{PARR_VALUE_PROPOSITION.exclusionsSummary}</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-bold text-emerald-200">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Tailgate Gear Included
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Driver Waits All Show
              </span>
            </div>
          </div>

          <div className="mt-6">
            {rideOption.slug === "suv" || rideOption.slug === "van" ? (
              <RezdyBookingEmbed
                page={sourcePath}
                surface="private_booking"
                title={`Reserve ${rideOption.slug === "suv" ? "Private Suburban" : "Private Van"} (${pricingInfo.priceLabel})`}
                subtitle="Select your concert date, enter your pickup address and rider contact details, and complete secure reservation checkout below."
                productId={REZDY_PRIVATE_PRODUCTS[rideOption.slug].productId}
                productName={REZDY_PRIVATE_PRODUCTS[rideOption.slug].productName}
                rezdyUrl={REZDY_PRIVATE_PRODUCTS[rideOption.slug].rezdyUrl}
                eventMeta={{
                  venue,
                  option: rideOption.slug,
                  ...(artist ? { artist } : {}),
                  ...(dateRaw ? { date: dateRaw } : {}),
                }}
              />
            ) : (
              <PrivateBookingForm
                venue={venue}
                option={rideOption}
                searchParams={sp}
                sourcePath={sourcePath}
                squareAppId={squareApplicationId()}
                squareLocationId={squareLocationId()}
                squareSdkUrl={squareWebSdkUrl()}
              />
            )}
          </div>
          <LegalInlineNotice className="mt-6" />
        </section>
      </section>
    </main>
  );
}
