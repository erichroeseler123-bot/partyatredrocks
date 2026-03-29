import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingVisualHero } from "@/components/booking/BookingVisualHero";
import SocialProofStrip from "@/components/social/SocialProofStrip";
import ShareActions from "@/components/shared/ShareActions";
import venuesJson from "@/data/venues.json";
import { PlanningLinks } from "@/components/booking/PlanningLinks";
import { PrivatePromoBanner } from "@/components/booking/PrivatePromoBanner";
import { DccReturnBanner } from "@/components/booking/DccReturnBanner";
import { postDccSatelliteEvent, postWtaPartnerAcceptedIfNeeded } from "@/lib/dccSatellite";
import { buildBookingHref, type HandoffSearchParams } from "@/lib/parrHandoff";
import { TrustStrip } from "@/components/TrustStrip";
import { bookingVisuals } from "@/lib/bookingVisuals";
import { getSameAs } from "@/lib/socials";
import { SITE_CONFIG } from "@/app/site-config";
import { BUSINESS_NAME, BUSINESS_PHONE, SERVICE_AREAS } from "@/lib/seo/siteTrust";
import { buildPrivateBookingJsonLd, buildPrivateBookingMetadata, buildPrivateFaqJsonLd } from "../bookingSeo";
import { buildDccPrivateCheckoutHref, PRIVATE_RIDE_BENEFITS, PRIVATE_RIDE_OPTIONS } from "@/lib/rideCatalog";

type VenueRow = {
  slug?: string;
  name?: string;
};

const SITE = "https://www.partyatredrocks.com";

function getVenue(slug: string): VenueRow | null {
  return (venuesJson as Record<string, VenueRow>)[slug] ?? null;
}

function firstValue(searchParams: HandoffSearchParams, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ venue: string }>;
}): Promise<Metadata> {
  const { venue } = await params;
  if (venue !== "red-rocks-amphitheatre") {
    return {};
  }

  return buildPrivateBookingMetadata(venue);
}

export default async function PrivateOptionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ venue: string }>;
  searchParams: Promise<HandoffSearchParams>;
}) {
  const brandKey = SITE_CONFIG.socialBrandKey;
  const { venue } = await params;
  const sp = await searchParams;
  if (venue !== "red-rocks-amphitheatre") notFound();
  const row = getVenue(venue);
  if (!row?.name) notFound();
  const qtyRaw = firstValue(sp, "qty");
  const vehicleQty = qtyRaw ? Math.max(1, Number(qtyRaw) || 1) : 1;
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

  await postDccSatelliteEvent({
    eventType: "handoff_viewed",
    searchParams: sp,
    sourcePath: `/book/${venue}/private`,
    stage: "private_options",
    booking: { venueSlug: venue },
  });

  await postWtaPartnerAcceptedIfNeeded({
    searchParams: sp,
    sourcePath: `/book/${venue}/private`,
  });

  const serviceJsonLd = buildPrivateBookingJsonLd({ venue, quantity: vehicleQty });
  const faqJsonLd = buildPrivateFaqJsonLd();

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <section className="mx-auto flex max-w-[1240px] flex-col gap-8">
        <BookingVisualHero
          eyebrow={bookingVisuals.private.eyebrow}
          title={bookingVisuals.private.title}
          copy={bookingVisuals.private.copy}
          imageSrc={bookingVisuals.private.imageSrc}
          imageAlt={bookingVisuals.private.imageAlt}
        />

        <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
            Step 3
          </div>
          <div className="mt-4 inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/12 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-200">
            2-Second Booking - Instant and Secure
          </div>
          <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem]">
            Private Red Rocks Shuttle: Book in 2 Seconds
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/74 sm:text-lg">
            Choose your vehicle below, then tap the booking button on that card to continue.
          </p>
          <ShareActions
            brandKey={brandKey}
            url={`${SITE}/book/${venue}/private`}
            title="Private Red Rocks shuttle from Denver"
            mode="feature"
            className="mt-5"
          />
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/68 sm:text-[15px]">
            Private rides mean one vehicle, one plan, guaranteed return, and a faster way to lock the night in.
          </p>
          <div className="mt-6">
            <Link
              href={buildBookingHref({ target: "venue", venue, searchParams: sp })}
              className="text-sm font-bold text-[#ffb07c] hover:text-white"
            >
              ← Back to ride types
            </Link>
          </div>
          <PlanningLinks
            venue={venue}
            source={Array.isArray(sp.source) ? sp.source[0] : sp.source}
            className="mt-6"
          />
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
            Why private
          </div>
          <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">
            Why choose private over public shuttles from Denver or Golden to Red Rocks
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-[#09101f] p-5">
              <h3 className="text-lg font-black uppercase tracking-[-0.02em] text-white">
                Shuttle from Denver to Red Rocks
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/74">
                Private rides work better when your group wants one pickup plan, limo-lane access, and a guaranteed return without waiting on other stops or another group&apos;s timing.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-[#09101f] p-5">
              <h3 className="text-lg font-black uppercase tracking-[-0.02em] text-white">
                Private transportation Golden to Red Rocks
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/74">
                This lane is also better when you want to tailgate, make a quick liquor stop, or keep the full night on one vehicle instead of splitting the plan across public seats and rideshare.
              </p>
            </div>
          </div>
        </section>

        <SocialProofStrip
          brandKey="partyatredrocks"
          title="Real private ride nights"
          body="Private groups usually want the same proof before they book: what the ride feels like, what the arrival looks like, and whether the night actually stays clean after the show."
          pageTitle="Private Red Rocks shuttle from Denver"
          pageUrl={`${SITE}/book/${venue}/private`}
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

        <PrivatePromoBanner />

        <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {PRIVATE_RIDE_OPTIONS.map((option) => {
            const optionHref = buildBookingHref({ target: "private-option", venue, option: option.slug, searchParams: sp });
            return (
            <Link
              key={option.slug}
              href={optionHref}
              className="group rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-[#3df3ff]/35 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
            >
              <div className="relative mb-5 h-40 overflow-hidden rounded-[20px] border border-white/10">
                <Image
                  src={bookingVisuals.privateOptions[option.slug].imageSrc}
                  alt={bookingVisuals.privateOptions[option.slug].imageAlt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 280px, (min-width: 1024px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,22,0.1),rgba(5,8,22,0.62)_100%)]" />
              </div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
                {option.eyebrow}
              </div>
              <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">
                {option.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/70">{option.body}</p>
              <div className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#3df3ff] px-5 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition group-hover:bg-[#62f6ff]">
                Book This Vehicle
              </div>
              <div className="mt-3 text-sm font-bold text-[#ffb07c]">Tap to continue →</div>
            </Link>
          );
          })}
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
            Private Ride Benefits
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {PRIVATE_RIDE_BENEFITS.map((item) => (
              <div key={item} className="rounded-[24px] border border-white/10 bg-[#09101f] p-5 text-sm font-bold leading-6 text-white">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/guide/tailgating"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
            >
              Tailgating Guide
            </Link>
            <Link
              href="/guide/tailgate-faq"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
            >
              Tailgate FAQ
            </Link>
          </div>
        </section>

        <TrustStrip />
      </section>
    </main>
  );
}
