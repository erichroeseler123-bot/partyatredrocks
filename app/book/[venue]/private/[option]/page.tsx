import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { buildBookingHref, type HandoffSearchParams } from "@/lib/parrHandoff";
import { BookingVisualHero } from "@/components/booking/BookingVisualHero";
import { DccReturnBanner } from "@/components/booking/DccReturnBanner";
import { ParrShowBookingSelector } from "@/components/booking/ParrShowBookingSelector";
import { LegalInlineNotice } from "@/components/legal/LegalInlineNotice";
import { PrivateBookingForm } from "@/components/booking/PrivateBookingForm";
import { ParrNativeRezdyCheckout } from "@/components/booking/rezdy/ParrNativeRezdyCheckout";
import { RezdyBookingEmbed } from "@/components/booking/rezdy/RezdyBookingEmbed";
import {
  buildCanonicalRedRocksBookingCatalog,
  getCurrentDenverDateKey,
  resolveInitialRedRocksShow,
} from "@/lib/shows/redRocksBookingCatalog";
import {
  getSafeRezdyStripePublishableKey,
  isParrNativeRezdyCheckoutEnabled,
  PARR_PREVIEW_HIDDEN_PRODUCTS,
} from "@/lib/rezdy/parrNativeRezdyService";
import { bookingVisuals } from "@/lib/bookingVisuals";
import { postDccSatelliteEvent, postWtaPartnerAcceptedIfNeeded } from "@/lib/dccSatellite";
import {
  getPrivateRideOption,
  isPublicPrivateRideSlug,
  SITE,
  SUBURBAN_ALL_IN_TOTAL_LABEL,
  VAN_ALL_IN_TOTAL_LABEL,
  type PrivateRideSlug,
} from "@/lib/rideCatalog";
import {
  getPrivateRidePricingForDate,
  PARR_COMPLETE_TOTAL_DISCLOSURE,
  PARR_VALUE_PROPOSITION,
} from "@/lib/pricing";
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
  searchParams,
}: {
  params: Promise<{ venue: string; option: PrivateRideSlug }>;
  searchParams: Promise<HandoffSearchParams>;
}): Promise<Metadata> {
  const { venue, option } = await params;
  const sp = await searchParams;
  if (venue !== "red-rocks-amphitheatre") return {};

  const rideOption = getPrivateRideOption(option);
  if (!rideOption) return {};
  if (!isPublicPrivateRideSlug(option)) {
    return {
      title: `${rideOption.title} | Party at Red Rocks`,
      robots: { index: false, follow: false },
    };
  }

  const isNativeCheckout =
    (option === "suv" || option === "van") &&
    isParrNativeRezdyCheckoutEnabled({ previewQueryFlag: firstValue(sp, "checkout") });

  if (isNativeCheckout) {
    const cfg = PARR_PREVIEW_HIDDEN_PRODUCTS[option];
    const canonical = `${SITE}/book/${venue}/private/${option}`;
    const title = `${cfg.shortVehicleLabel} to Red Rocks | $${cfg.expectedTotalChargedUsd.toFixed(2)} Total Booking`;
    const description = `Book ${cfg.shortVehicleLabel} round-trip transportation to Red Rocks: $${cfg.expectedTotalChargedUsd.toFixed(2)} total charged today ($${cfg.basePriceUsd.toFixed(2)} vehicle + $${cfg.expectedBookingFeeUsd.toFixed(2)} Booking fee (4%)).`;
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        url: canonical,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
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

  const isNativeCheckout =
    (rideOption.slug === "suv" || rideOption.slug === "van") &&
    isParrNativeRezdyCheckoutEnabled({ previewQueryFlag: firstValue(sp, "checkout") });

  const nativeCfg =
    rideOption.slug === "suv" || rideOption.slug === "van"
      ? PARR_PREVIEW_HIDDEN_PRODUCTS[rideOption.slug]
      : null;

  const jsonLd =
    isNativeCheckout && nativeCfg
      ? {
          "@context": "https://schema.org",
          "@type": "Offer",
          priceCurrency: "USD",
          price: nativeCfg.expectedTotalChargedUsd.toFixed(2),
          url: `${SITE}/book/${venue}/private/${rideOption.slug}`,
          description: `${nativeCfg.shortVehicleLabel} round-trip Red Rocks transportation: $${nativeCfg.expectedTotalChargedUsd.toFixed(2)} total charged today ($${nativeCfg.basePriceUsd.toFixed(2)} vehicle + $${nativeCfg.expectedBookingFeeUsd.toFixed(2)} Booking fee (4%)).`,
          itemOffered: {
            "@type": "Service",
            name: `${nativeCfg.shortVehicleLabel} to Red Rocks`,
            description: rideOption.body,
            provider: {
              "@type": "Organization",
              "@id": `${SITE}/#organization`,
              name: "Party at Red Rocks",
              url: SITE,
              logo: `${SITE}/brand/red-rocks-shuttle.png`,
              telephone: "+1-720-369-6292",
            },
            areaServed: ["Denver, CO", "Golden, CO", "Morrison, CO"],
            serviceType: "Private concert transportation",
          },
          potentialAction: {
            "@type": "ReserveAction",
            target: `${SITE}/book/${venue}/private/${rideOption.slug}?qty=1`,
          },
        }
      : buildPrivateOptionJsonLd({
          venue,
          optionSlug: rideOption.slug,
          optionTitle: rideOption.title,
          optionBody: rideOption.body,
          optionPriceLabel: rideOption.priceLabel,
          quantity: vehicleQty,
        });

  const showIdParam = firstValue(sp, "show");
  const artist = firstValue(sp, "artist") || firstValue(sp, "event");
  const partySizeParam = Number(firstValue(sp, "partySize")) || null;
  const pickup = firstValue(sp, "pickup");
  const dateRaw = firstValue(sp, "date");
  const todayDateKey = getCurrentDenverDateKey();
  const bookingCatalog = buildCanonicalRedRocksBookingCatalog(todayDateKey);
  const initialResolution = resolveInitialRedRocksShow(
    { showId: showIdParam, dateKey: dateRaw, artist },
    bookingCatalog,
    todayDateKey
  );
  const isPastShowRequest =
    initialResolution.kind === "past_show" || initialResolution.kind === "past_unlisted_date";
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

  const heroEyebrow = nativeCfg
    ? `$${nativeCfg.expectedTotalChargedUsd.toFixed(2)} Total (${nativeCfg.shortVehicleLabel}: $${nativeCfg.basePriceUsd.toFixed(2)} + $${nativeCfg.expectedBookingFeeUsd.toFixed(2)} Booking fee (4%)) • Up to ${nativeCfg.maxPartySize} Guests`
    : `${pricingInfo.roundTripLabel} · ${rideOption.slug === "suv" ? "Up to 6 Guests" : "Up to 10 Guests"}`;

  return (
    <main className="min-h-screen bg-[#070b14] px-4 pb-16 pt-6 text-white sm:px-6 sm:pt-8 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="mx-auto flex max-w-[1240px] flex-col gap-6">
        <nav
          aria-label="Booking progress"
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0d1424] px-4 py-3 text-[11px] font-bold uppercase tracking-wider"
        >
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
              ? `Need up to 10 seats? Switch to Private Van (${VAN_ALL_IN_TOTAL_LABEL} total) →`
              : `6 or fewer guests? Switch to Suburban (${SUBURBAN_ALL_IN_TOTAL_LABEL} total) →`}
          </Link>
        </nav>

        <BookingVisualHero
          eyebrow={heroEyebrow}
          title={rideOption.slug === "suv" ? "Private Suburban Booking" : "Private Van Booking"}
          copy={rideOption.body}
          imageSrc={bookingVisuals.privateOptions[rideOption.slug]?.imageSrc || bookingVisuals.private.imageSrc}
          imageAlt={bookingVisuals.privateOptions[rideOption.slug]?.imageAlt || bookingVisuals.private.imageAlt}
          imageNote="Representative vehicle; exact vehicle may vary."
        />

        <DccReturnBanner searchParams={sp} />

        {!isPastShowRequest && (artist || dateLabel || pickup) ? (
          <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-400/35 bg-emerald-500/12 p-4 sm:p-5">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-200">
                Selected Trip Summary
              </div>
              <p className="mt-1.5 text-sm text-white/90 sm:text-[15px]">
                Booking{" "}
                <strong className="text-white">
                  {rideOption.slug === "suv" ? "Private Suburban" : "Private Van"}
                </strong>{" "}
                ({isNativeCheckout && nativeCfg ? `$${nativeCfg.expectedTotalChargedUsd.toFixed(2)} total` : pricingInfo.roundTripLabel})
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
            </div>
            <Link
              href={`/book/${venue}/private`}
              className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold text-white no-underline transition hover:border-[#ffb07c] hover:bg-white/18"
            >
              Change show
            </Link>
          </section>
        ) : null}

        {isPastShowRequest ? (
          <section className="rounded-[30px] border border-white/10 bg-[#0d1424] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-8">
            <ParrShowBookingSelector
              catalog={bookingCatalog}
              todayDateKey={todayDateKey}
              entrySurface="checkout"
              mode="navigate"
              initialShowId={showIdParam}
              initialDateKey={dateRaw}
              initialArtist={artist}
              initialPartySize={partySizeParam}
              initialVehicleSlug={rideOption.slug === "van" ? "van" : "suv"}
            />
          </section>
        ) : (
        <section className="rounded-[30px] border border-white/10 bg-[#0d1424] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-8">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
                Confirm Pickup &amp; Lock Your Date
              </div>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">
                Complete Your {rideOption.slug === "suv" ? "Private Suburban" : "Private Van"} Reservation
              </h2>
              {nativeCfg ? (
                <>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-white/82">
                    Enter your exact hotel, Airbnb, or home pickup address below. Includes Upper North Lot tailgating gear (chairs, cooler, speaker &amp; ice), a dedicated driver waiting through the concert, and your return ride home. {PARR_COMPLETE_TOTAL_DISCLOSURE}
                  </p>
                  <p className="mt-2 max-w-3xl text-base font-black text-white">
                    Total charged today: ${nativeCfg.expectedTotalChargedUsd.toFixed(2)}{" "}
                    <span className="text-xs font-medium text-white/75">
                      (${nativeCfg.basePriceUsd.toFixed(2)} {nativeCfg.shortVehicleLabel} + ${nativeCfg.expectedBookingFeeUsd.toFixed(2)} Booking fee (4%) · {PARR_VALUE_PROPOSITION.exclusionsSummary})
                    </span>
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-white/80">
                    Enter your exact hotel, Airbnb, or home pickup address inside checkout below. Includes Upper North Lot tailgating gear (chairs, cooler, speaker &amp; ice), a dedicated driver waiting through the concert, and your return ride home.
                  </p>
                  <p className="mt-1.5 text-xs text-white/60">{PARR_VALUE_PROPOSITION.exclusionsSummary}</p>
                </>
              )}
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
              isNativeCheckout && nativeCfg ? (
                <ParrNativeRezdyCheckout
                  vehicleSlug={rideOption.slug}
                  shortVehicleLabel={nativeCfg.shortVehicleLabel}
                  basePriceUsd={nativeCfg.basePriceUsd}
                  expectedBookingFeeUsd={nativeCfg.expectedBookingFeeUsd}
                  expectedTotalChargedUsd={nativeCfg.expectedTotalChargedUsd}
                  maxPartySize={nativeCfg.maxPartySize}
                  initialDate={dateRaw}
                  initialArtist={artist}
                  initialPartySize={partySizeParam}
                  rezdyPublishableKey={getSafeRezdyStripePublishableKey()}
                  fallbackEmbedProps={{
                    page: sourcePath,
                    surface: "private_booking",
                    title: `Reserve ${rideOption.slug === "suv" ? "Private Suburban" : "Private Van"}`,
                    subtitle:
                      "Select your concert date, enter your pickup address and rider contact details, and complete secure reservation checkout below.",
                    productId: REZDY_PRIVATE_PRODUCTS[rideOption.slug].productId,
                    productName: REZDY_PRIVATE_PRODUCTS[rideOption.slug].productName,
                    rezdyUrl: REZDY_PRIVATE_PRODUCTS[rideOption.slug].rezdyUrl,
                    eventMeta: {
                      venue,
                      option: rideOption.slug,
                      ...(artist ? { artist } : {}),
                      ...(dateRaw ? { date: dateRaw } : {}),
                    },
                  }}
                />
              ) : (
                <RezdyBookingEmbed
                  page={sourcePath}
                  surface="private_booking"
                  title={`Reserve ${rideOption.slug === "suv" ? "Private Suburban" : "Private Van"} (${rideOption.slug === "suv" ? SUBURBAN_ALL_IN_TOTAL_LABEL : VAN_ALL_IN_TOTAL_LABEL} total)`}
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
              )
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
        )}
      </section>
    </main>
  );
}
