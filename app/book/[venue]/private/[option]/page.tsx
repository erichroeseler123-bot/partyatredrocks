import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { type HandoffSearchParams } from "@/lib/parrHandoff";
import { BookingVisualHero } from "@/components/booking/BookingVisualHero";
import { DccReturnBanner } from "@/components/booking/DccReturnBanner";
import { LegalInlineNotice } from "@/components/legal/LegalInlineNotice";
import { PrivateBookingForm } from "@/components/booking/PrivateBookingForm";
import { ParrNativeRezdyCheckout } from "@/components/booking/rezdy/ParrNativeRezdyCheckout";
import { RezdyBookingEmbed } from "@/components/booking/rezdy/RezdyBookingEmbed";
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

  // When selling through the fee-bearing native checkout, Offer.price reflects the mandatory all-in amount paid.
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

  const artist = firstValue(sp, "artist") || firstValue(sp, "event");
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

  const heroEyebrow =
    isNativeCheckout && nativeCfg
      ? `$${nativeCfg.expectedTotalChargedUsd.toFixed(2)} Total Charged Today • Up to ${nativeCfg.maxPartySize} Guests`
      : rideOption.eyebrow;

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 sm:pt-28 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="mx-auto flex max-w-[1240px] flex-col gap-8">
        <BookingVisualHero
          eyebrow={heroEyebrow}
          title={`${isNativeCheckout && nativeCfg ? nativeCfg.shortVehicleLabel : rideOption.title} Booking`}
          copy={rideOption.body}
          imageSrc={bookingVisuals.privateOptions[rideOption.slug]?.imageSrc || bookingVisuals.private.imageSrc}
          imageAlt={bookingVisuals.privateOptions[rideOption.slug]?.imageAlt || bookingVisuals.private.imageAlt}
        />

        <DccReturnBanner searchParams={sp} />

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
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">Private Ride Checkout</div>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white">
            Book Your {isNativeCheckout && nativeCfg ? nativeCfg.shortVehicleLabel : rideOption.title}
          </h2>
          {isNativeCheckout && nativeCfg ? (
            <>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/82 sm:text-[15px]">
                Private Red Rocks round-trip transportation includes Denver-area pickup, coordinated arrival, Upper North Lot tailgating time and setup (chairs, cooler, ice, and speaker), a dedicated driver and vehicle remaining at Red Rocks throughout the show, and your return ride home.
              </p>
              <p className="mt-2 max-w-3xl text-base font-black text-white">
                Total charged today: ${nativeCfg.expectedTotalChargedUsd.toFixed(2)}{" "}
                <span className="text-xs font-medium text-white/70">
                  (${nativeCfg.basePriceUsd.toFixed(2)} {nativeCfg.shortVehicleLabel} + ${nativeCfg.expectedBookingFeeUsd.toFixed(2)} Booking fee (4%) · {PARR_VALUE_PROPOSITION.exclusionsSummary})
                </span>
              </p>
            </>
          ) : (
            <>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/78 sm:text-[15px]">
                {PARR_VALUE_PROPOSITION.summary} {PARR_VALUE_PROPOSITION.tailgatingSummary}
              </p>
              <p className="mt-2 max-w-3xl text-xs leading-5 text-white/60">
                Flat round-trip rate:{" "}
                <span className="font-bold text-white">
                  {getPrivateRidePricingForDate({ optionSlug: rideOption.slug, serviceDate: dateRaw }).roundTripLabel}
                </span>
                . {PARR_VALUE_PROPOSITION.exclusionsSummary}
              </p>
            </>
          )}
          <p className="mt-2 max-w-3xl text-sm leading-6 text-cyan-100/82 sm:text-[15px]">
            Private rides pick your group up at your own hotel, Airbnb, home, or exact Denver-area address.
          </p>
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
                  rezdyPublishableKey={getSafeRezdyStripePublishableKey()}
                  fallbackEmbedProps={{
                    page: sourcePath,
                    surface: "private_booking",
                    title: `Book ${rideOption.title}`,
                    subtitle:
                      "Complete this Red Rocks private ride booking through Rezdy. Pickup details, date, rider information, and payment are handled inside the widget.",
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
                  title={`Book ${rideOption.title}`}
                  subtitle="Complete this Red Rocks private ride booking through Rezdy. Pickup details, date, rider information, and payment are handled inside the widget."
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
      </section>
    </main>
  );
}
