import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import venuesJson from "@/data/venues.json";
import { DccReturnBanner } from "@/components/booking/DccReturnBanner";
import { ParrShowBookingSelector } from "@/components/booking/ParrShowBookingSelector";
import {
  buildCanonicalRedRocksBookingCatalog,
  getCurrentDenverDateKey,
} from "@/lib/shows/redRocksBookingCatalog";
import { postDccSatelliteEvent, postWtaPartnerAcceptedIfNeeded } from "@/lib/dccSatellite";
import { buildBookingHref, type HandoffSearchParams } from "@/lib/parrHandoff";
import { bookingVisuals } from "@/lib/bookingVisuals";
import { PARR_COMPLETE_TOTAL_DISCLOSURE, PARR_VALUE_PROPOSITION } from "@/lib/pricing";
import {
  PUBLIC_PRIVATE_RIDE_OPTIONS,
  SUBURBAN_ALL_IN_TOTAL_LABEL,
  SUBURBAN_APPROX_EACH_LABEL,
  SUBURBAN_ITEMIZED_LABEL,
  VAN_ALL_IN_TOTAL_LABEL,
  VAN_APPROX_EACH_LABEL,
  VAN_ITEMIZED_LABEL,
} from "@/lib/rideCatalog";
import { buildPrivateBookingJsonLd, buildPrivateBookingMetadata, buildPrivateFaqJsonLd } from "../bookingSeo";

type VenueRow = {
  slug?: string;
  name?: string;
};

const INCLUDED_SUV = [
  "Door-to-door Denver, Golden, or Boulder hotel/home pickup + optional drink stop",
  "Upper North Lot staging with chairs, cooler, Bluetooth speaker & fresh ice",
  "Driver & locked SUV stay at Red Rocks through the entire concert",
  "Direct return ride home after the encore—upfront all-in total, zero surge pricing",
];

const INCLUDED_VAN = [
  "Keep up to 10 guests together in one spacious passenger van",
  "One coordinated pickup address + optional beverage/grocery stop en route",
  "Upper North Lot tailgating setup included: chairs, cooler, Bluetooth speaker & ice",
  "Dedicated commercial driver & van wait on-site through the show until you head home",
];

function getVenue(slug: string): VenueRow | null {
  return (venuesJson as Record<string, VenueRow>)[slug] ?? null;
}

function firstValue(searchParams: HandoffSearchParams, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ params }: { params: Promise<{ venue: string }> }): Promise<Metadata> {
  const { venue } = await params;
  if (venue !== "red-rocks-amphitheatre") return {};
  return buildPrivateBookingMetadata(venue);
}

export default async function PrivateOptionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ venue: string }>;
  searchParams: Promise<HandoffSearchParams>;
}) {
  const { venue } = await params;
  const sp = await searchParams;
  if (venue !== "red-rocks-amphitheatre") notFound();

  const row = getVenue(venue);
  if (!row?.name) notFound();

  const qtyValue = firstValue(sp, "qty");
  const vehicleQty = qtyValue ? Math.max(1, Number(qtyValue) || 1) : 1;
  const artist = firstValue(sp, "artist") || firstValue(sp, "event");
  const showIdParam = firstValue(sp, "show");
  const partySizeParam = Number(firstValue(sp, "partySize")) || null;
  const dateRaw = firstValue(sp, "date");
  const todayDateKey = getCurrentDenverDateKey();
  const bookingCatalog = buildCanonicalRedRocksBookingCatalog(todayDateKey);
  const preservedParams: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(sp)) {
    const first = Array.isArray(v) ? v[0] : v;
    if (first) preservedParams[k] = first;
  }

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

  const serviceJsonLd = buildPrivateBookingJsonLd({ venue, quantity: 1 });
  const faqJsonLd = buildPrivateFaqJsonLd();

  const suvOption = PUBLIC_PRIVATE_RIDE_OPTIONS.find((option) => option.slug === "suv");
  const vanOption = PUBLIC_PRIVATE_RIDE_OPTIONS.find((option) => option.slug === "van");
  const suvVisual = bookingVisuals.privateOptions.suv;
  const vanVisual = bookingVisuals.privateOptions.van;
  if (!suvOption || !vanOption || !suvVisual || !vanVisual) notFound();

  const suvHref = buildBookingHref({
    target: "private-option",
    venue,
    option: suvOption.slug,
    searchParams: sp,
    overrides: { qty: vehicleQty },
  });

  const vanHref = buildBookingHref({
    target: "private-option",
    venue,
    option: vanOption.slug,
    searchParams: sp,
    overrides: { qty: vehicleQty },
  });

  return (
    <main className="min-h-screen bg-[#070b14] px-3 pb-14 pt-3 text-white sm:px-6 sm:pb-16 sm:pt-8 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="mx-auto flex max-w-[1240px] flex-col gap-4 sm:gap-8">
        {/* Step Progress Bar */}
        <nav
          aria-label="Booking progress"
          className="grid grid-cols-2 gap-1.5 rounded-xl border border-white/10 bg-[#0d1424] p-2.5 text-[10px] font-bold uppercase tracking-wider sm:grid-cols-4 sm:gap-2 sm:rounded-2xl sm:p-3 sm:text-[11px]"
        >
          <Link href="/red-rocks/concerts" className="truncate text-white/65 no-underline hover:text-white">
            1. Event / Date
          </Link>
          <span className="truncate font-black text-[#ffb07c]">2. Choose Vehicle</span>
          <span className="truncate text-white/55">3. Confirm Pickup</span>
          <span className="truncate text-white/55">4. Book</span>
        </nav>

        {/* Hero */}
        <section className="relative z-20 rounded-[24px] border border-white/12 bg-[#0d1424] shadow-[0_24px_80px_rgba(0,0,0,0.5)] sm:rounded-[32px]">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
            <picture>
              <source media="(max-width: 640px)" srcSet="/images/redesign/hero-red-rocks-mobile.webp" />
              <img
                src="/images/redesign/red-rocks-sunset-crowd.webp"
                alt="Red Rocks concert crowd and sandstone monoliths at twilight"
                width={1120}
                height={630}
                fetchPriority="high"
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover object-center opacity-35"
              />
            </picture>
            <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,11,20,0.95)_0%,rgba(7,11,20,0.78)_55%,rgba(7,11,20,0.94)_100%)]" />
          </div>

          <div className="relative p-4 sm:p-10 lg:p-12">
            <div className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#ffb07c]/35 bg-[#ffb07c]/12 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.13em] text-[#ffb07c] sm:px-4 sm:py-1.5 sm:text-[11px] sm:tracking-[0.2em]">
              <Sparkles className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
              <span className="sm:hidden">2027 All-In Vehicle Pricing</span>
              <span className="hidden sm:inline">2027 Upfront All-In Pricing · Upper North Tailgate</span>
            </div>

            <h1 className="mt-2.5 max-w-4xl text-[1.58rem] font-black uppercase leading-[1.02] tracking-[-0.035em] sm:mt-4 sm:text-[3.5rem] sm:leading-[0.96]">
              Choose Your Private Red Rocks Vehicle
            </h1>

            <p className="mt-2 max-w-3xl text-[13px] leading-[1.45] text-white/84 sm:mt-4 sm:text-lg sm:leading-7">
              {PARR_VALUE_PROPOSITION.summary} {PARR_VALUE_PROPOSITION.tailgatingSummary}
            </p>

            {/* Calm Two-Way Show / Date Booking Entry Selector */}
            <div className="mt-4 sm:mt-6">
              <ParrShowBookingSelector
                catalog={bookingCatalog}
                todayDateKey={todayDateKey}
                entrySurface="/book/red-rocks-amphitheatre/private"
                mode="navigate"
                initialShowId={showIdParam}
                initialDateKey={dateRaw}
                initialArtist={artist}
                initialPartySize={partySizeParam}
                preservedQueryParams={preservedParams}
              />
            </div>

            <div className="mt-3.5 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
              <a
                href="#suv-booking"
                className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#ff7a4d] px-4 text-[11px] font-black uppercase tracking-[0.12em] text-[#140804] no-underline transition hover:bg-[#ff926b] sm:min-h-11 sm:px-6 sm:text-xs sm:tracking-[0.14em]"
              >
                Suburban ({SUBURBAN_ALL_IN_TOTAL_LABEL} total · Up to 6)
              </a>
              <a
                href="#van-upgrade"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 text-[11px] font-black uppercase tracking-[0.12em] text-white no-underline transition hover:bg-white/16 sm:min-h-11 sm:px-6 sm:text-xs sm:tracking-[0.14em]"
              >
                Van ({VAN_ALL_IN_TOTAL_LABEL} total · Up to 10)
              </a>
            </div>
          </div>
        </section>

        <DccReturnBanner searchParams={sp} />

        {/* Side-by-Side / Stacked Vehicle Cards with #suv-booking and #van-upgrade Anchors */}
        <div className="grid gap-5 sm:gap-6 lg:grid-cols-2">
          {/* Option 1: Private Suburban (#suv-booking) */}
          <section
            id="suv-booking"
            aria-labelledby="suv-card-heading"
            className="scroll-mt-20 flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#ffb07c]/35 bg-[#0d1424] shadow-[0_24px_70px_rgba(0,0,0,0.42)] sm:rounded-[30px]"
          >
            <div>
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                <img
                  src={suvVisual.imageSrc}
                  alt={suvVisual.imageAlt}
                  width={960}
                  height={600}
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-3 top-3 rounded-full border border-[#ffb07c]/50 bg-[#070b14]/85 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#ffb07c] backdrop-blur sm:left-4 sm:top-4 sm:px-3.5 sm:text-[11px]">
                  Most Popular · Up to 6 Guests
                </div>
                <span className="absolute bottom-2.5 right-2.5 rounded-full bg-black/75 px-2.5 py-0.5 text-[10px] font-medium text-white/75 backdrop-blur-sm">
                  Representative vehicle; exact vehicle may vary.
                </span>
              </div>

              <div className="p-5 sm:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#ffb07c] sm:text-xs">
                      Option 1 · Full-Size SUV
                    </div>
                    <h2 id="suv-card-heading" className="mt-1 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                      {suvOption.title}
                    </h2>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-[#ffb07c] sm:text-4xl">{SUBURBAN_ALL_IN_TOTAL_LABEL} total</div>
                    <div className="mt-0.5 text-xs font-semibold text-white/85">
                      {SUBURBAN_ITEMIZED_LABEL}
                    </div>
                    <div className="mt-0.5 text-[11px] font-medium text-white/65">
                      ({SUBURBAN_APPROX_EACH_LABEL})
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-white/80 sm:mt-4">
                  Ideal for couples, double dates, and groups up to 6 who want spacious SUV seating, easy curbside hotel or home pickup, Upper North Lot tailgating, and a dedicated vehicle waiting through the encore. {PARR_COMPLETE_TOTAL_DISCLOSURE}
                </p>

                <ul className="mt-4 space-y-2 sm:mt-5 sm:space-y-2.5">
                  {INCLUDED_SUV.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-white/88">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#ffb07c]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs leading-5 text-white/75 sm:mt-5">
                  <strong className="text-white">Single-Vehicle Checkout:</strong> Online booking reserves 1 Private Suburban ({SUBURBAN_ALL_IN_TOTAL_LABEL} total: {SUBURBAN_ITEMIZED_LABEL}). Need multiple SUVs?{" "}
                  <Link href="/red-rocks/group-transportation" className="font-bold text-[#ffb07c] underline">
                    Request Multi-Vehicle Group Transportation →
                  </Link>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-5 pt-4 sm:px-8 sm:pb-8 sm:pt-5">
              <Link
                href={suvHref}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#ff7a4d] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#140804] no-underline shadow-[0_12px_30px_rgba(255,122,77,0.3)] transition hover:bg-[#ff926b] sm:min-h-13 sm:px-6 sm:py-3.5 sm:text-sm sm:tracking-[0.14em]"
              >
                <span>Select Private Suburban — {SUBURBAN_ALL_IN_TOTAL_LABEL} Total</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
            </div>
          </section>

          {/* Option 2: Private Van (#van-upgrade) */}
          <section
            id="van-upgrade"
            aria-labelledby="van-card-heading"
            className="scroll-mt-20 flex flex-col justify-between overflow-hidden rounded-[24px] border border-sky-300/30 bg-[#0d1424] shadow-[0_24px_70px_rgba(0,0,0,0.42)] sm:rounded-[30px]"
          >
            <div>
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                <img
                  src={vanVisual.imageSrc}
                  alt={vanVisual.imageAlt}
                  width={960}
                  height={600}
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-3 top-3 rounded-full border border-sky-300/50 bg-[#070b14]/85 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-sky-200 backdrop-blur sm:left-4 sm:top-4 sm:px-3.5 sm:text-[11px]">
                  Full-Crew Van · Up to 10 Guests
                </div>
                <span className="absolute bottom-2.5 right-2.5 rounded-full bg-black/75 px-2.5 py-0.5 text-[10px] font-medium text-white/75 backdrop-blur-sm">
                  Representative vehicle; exact vehicle may vary.
                </span>
              </div>

              <div className="p-5 sm:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.16em] text-sky-300 sm:text-xs">
                      Option 2 · 10-Passenger Van
                    </div>
                    <h2 id="van-card-heading" className="mt-1 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                      Private Van
                    </h2>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-[#ffb07c] sm:text-4xl">{VAN_ALL_IN_TOTAL_LABEL} total</div>
                    <div className="mt-0.5 text-xs font-semibold text-white/85">
                      {VAN_ITEMIZED_LABEL}
                    </div>
                    <div className="mt-0.5 text-[11px] font-medium text-white/65">
                      ({VAN_APPROX_EACH_LABEL})
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-white/80 sm:mt-4">
                  Built for groups of 7 to 10 friends who want spacious seating, luggage/cooler room, one pickup timeline, Upper North Lot tailgating together, and one warm van waiting after the show. {PARR_COMPLETE_TOTAL_DISCLOSURE}
                </p>

                <ul className="mt-4 space-y-2 sm:mt-5 sm:space-y-2.5">
                  {INCLUDED_VAN.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-white/88">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs leading-5 text-white/75 sm:mt-5">
                  <strong className="text-white">Group over 10 guests?</strong> Coordinate a Private Van ({VAN_ALL_IN_TOTAL_LABEL} total) + Private Suburban ({SUBURBAN_ALL_IN_TOTAL_LABEL} total) for up to 16 guests, or{" "}
                  <Link href="/contact" className="font-bold text-[#ffb07c] underline">
                    text dispatch at 720-369-6292
                  </Link>{" "}
                  for multi-vehicle staging.
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-5 pt-4 sm:px-8 sm:pb-8 sm:pt-5">
              <Link
                href={vanHref}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#ff7a4d] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#140804] no-underline shadow-[0_12px_30px_rgba(255,122,77,0.3)] transition hover:bg-[#ff926b] sm:min-h-13 sm:px-6 sm:py-3.5 sm:text-sm sm:tracking-[0.14em]"
              >
                <span>Select Private Van — {VAN_ALL_IN_TOTAL_LABEL} Total</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
            </div>
          </section>
        </div>

        {/* Transparent Pricing & Seasonal Operator Credibility */}
        <section className="rounded-[30px] border border-white/10 bg-[#0d1424] p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#ffb07c]">
            <ShieldCheck className="h-4 w-4" />
            Everything Clear Before You Book
          </div>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
            Why Groups Book Private Instead of Rideshare
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
              <h3 className="text-base font-black uppercase text-white">Upper North Tailgate Ready</h3>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Arrive at Red Rocks&apos; primary party lot with chairs, cooler, speaker, and ice ready—then lock everything inside during the concert.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
              <h3 className="text-base font-black uppercase text-white">Driver Never Leaves</h3>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Your commercial driver stays staged on-site through weather delays or double encores so your group walks right out to a warm cabin.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
              <h3 className="text-base font-black uppercase text-white">Honest Exclusions</h3>
              <p className="mt-2 text-sm leading-6 text-white/75">
                {PARR_VALUE_PROPOSITION.exclusionsSummary} Existing 2026 reservations remain honored at their original booked prices.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-5 text-sm leading-6 text-white/78">
            <strong className="text-white">Year-Round Colorado Fleet Operation:</strong> 24/7 scheduled service subject to live vehicle and schedule availability. The same Colorado transportation operation runs Party at Red Rocks during the summer concert season and{" "}
            <a
              href="https://gosno.co"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#ffb07c] underline hover:text-white"
            >
              GoSno
            </a>{" "}
            during the winter ski season.
          </div>
        </section>
      </section>
    </main>
  );
}
