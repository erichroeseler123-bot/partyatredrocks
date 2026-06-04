import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { type HandoffSearchParams } from "@/lib/parrHandoff";
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
  type PrivateRideSlug,
} from "@/lib/rideCatalog";
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
// Actual SUV/van checkout is handled by Rezdy; update Rezdy product pricing to match public pricing.

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
  const artist = firstValue(sp, "artist");
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

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 sm:pt-28 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="mx-auto flex max-w-[1240px] flex-col gap-8">
        <BookingVisualHero
          eyebrow={rideOption.eyebrow}
          title={`${rideOption.title} Booking`}
          copy={rideOption.body}
          imageSrc={bookingVisuals.private.imageSrc}
          imageAlt={bookingVisuals.private.imageAlt}
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
            Book Your {rideOption.title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70 sm:text-[15px]">
            Book this private Red Rocks vehicle online through Rezdy.
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-cyan-100/82 sm:text-[15px]">
            Private rides can pick your group up at your own hotel, Airbnb, home, or exact address.
          </p>
          <div className="mt-6">
            {rideOption.slug === "suv" || rideOption.slug === "van" ? (
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
