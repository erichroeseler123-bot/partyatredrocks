"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getPrivateRidePricingForDate,
  PARR_VALUE_PROPOSITION,
  SUBURBAN_2027_USD,
  VAN_2027_USD,
} from "@/lib/pricing";
import {
  CalendarDays,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Music,
  Sparkles,
  Clock,
  ArrowRight,
  Users,
} from "lucide-react";
import { ReviewBlock } from "@/components/ReviewBlock";
import {
  ParrShowBookingSelector,
  type SelectedBookingContext,
} from "@/components/booking/ParrShowBookingSelector";
import type { CanonicalRedRocksBookingShow } from "@/lib/shows/redRocksBookingCatalog";
import { trackNetworkEvent } from "@/lib/networkEvents";

export type UpcomingRedRocksPreviewItem = {
  id: string;
  name: string;
  dateKey: string;
  dateLabel: string;
  supportLabel: string | null;
  sourceUrl: string | null;
  suvBookingHref: string;
  vanBookingHref: string;
};

type HomeSectionsProps = {
  heroSrc: string;
  privateVehicleSrc: string;
  privateVanSrc?: string;
  urgency:
    | {
        label: string;
        detail: string;
        imageSrc: string;
        imageAlt: string;
        bookingHref?: string;
      }
    | null;
  upcoming2027Preview?: UpcomingRedRocksPreviewItem[];
  verified2027Count?: number;
  bookingCatalog?: CanonicalRedRocksBookingShow[];
  todayDateKey?: string;
};

const PICKUP_AREAS = [
  "Downtown Denver / LoDo",
  "RiNo Arts District",
  "Union Station Hotel Zone",
  "Golden / West Metro",
  "Capitol Hill / Cherry Creek",
  "Boulder",
  "Custom Airbnb / Home Address",
] as const;

const YOUR_NIGHT_STEPS = [
  {
    step: "01",
    phase: "4:30 PM",
    title: "Door-to-Door Pickup",
    body: "Your driver pulls up to your hotel, Airbnb, or house—plus a quick stop for drinks or snacks if your crew wants one.",
    image: "/images/redesign/union-station-pickup.webp",
    alt: "Evening pickup at Denver Union Station before heading to Red Rocks",
  },
  {
    step: "02",
    phase: "Pre-Show",
    title: "Upper North Lot Tailgate",
    body: "Roll into Red Rocks' primary party lot near the top ramp. Chairs, cooler, fresh ice, and a Bluetooth speaker are ready in the back.",
    image: "/images/redesign/red-rocks-entrance-mobile.webp",
    alt: "Red Rocks Park sandstone entrance leading up to the Upper North Lot",
  },
  {
    step: "03",
    phase: "Showtime",
    title: "Walk Into the Amphitheatre",
    body: "Stroll into the rocks hands-free while coolers, chairs, and extra hoodies stay safely locked inside your vehicle.",
    image: "/images/redesign/red-rocks-sunset-crowd.webp",
    alt: "Crowd watching a live sunset concert inside Red Rocks Amphitheatre",
  },
  {
    step: "04",
    phase: "All Show",
    title: "Your Driver Waits On-Site",
    body: "Your vehicle never leaves the mountain and is never double-booked. Leave early, stay through the second encore—your call.",
    image: "/images/redesign/private-suburban-black-sm.webp",
    alt: "Representative full-size SUV staged and waiting for concert guests",
    representativeDisclosure: true,
  },
  {
    step: "05",
    phase: "Encore Exit",
    title: "Warm, Safe Ride Home",
    body: "Skip the mile-long rideshare hike and $200+ surge chaos. Step into a warm cabin with your whole crew and ride straight home.",
    image: "/images/redesign/red-rocks-sunset-sky.webp",
    alt: "Twilight glow over the Denver skyline from Red Rocks Amphitheatre",
  },
] as const;

const INCLUDED_ITEMS = [
  {
    title: "Door-to-Door Pickup",
    detail: "One pickup at your Denver, Golden, or Boulder hotel, rental, or home—plus an optional quick beverage stop.",
  },
  {
    title: "Upper North Lot Staging",
    detail: "Tailgate in Red Rocks' primary party lot near the upper entrance instead of climbing 380 stairs from Lower South.",
  },
  {
    title: "Chairs, Cooler, Speaker & Ice",
    detail: "No hauling tailgate gear through an airport or hotel lobby—your setup is stocked and waiting in the trunk.",
  },
  {
    title: "Locked Gear Storage",
    detail: "Keep tailgate coolers and extra cold-weather layers safely locked in your private vehicle during the show.",
  },
  {
    title: "Dedicated Waiting Driver",
    detail: "One commercial driver and one vehicle assigned solely to your group from departure through final drop-off.",
  },
  {
    title: "Flat Round-Trip Rate",
    detail: "Published vehicle price locked at booking—zero surge multipliers when 9,500 fans exit at midnight.",
  },
] as const;

function buildBookingFlowHref(
  optionSlug: "suv" | "van" | "compare",
  dateValue: string,
  artistValue: string,
  pickupValue: string
): string {
  const params = new URLSearchParams();
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue.trim())) {
    params.set("date", dateValue.trim());
  }
  if (artistValue.trim()) {
    params.set("artist", artistValue.trim());
  }
  if (pickupValue.trim()) {
    params.set("pickup", pickupValue.trim());
  }
  const query = params.toString();
  if (optionSlug === "compare") {
    return `/book/red-rocks-amphitheatre/private${query ? `?${query}` : ""}`;
  }
  return `/book/red-rocks-amphitheatre/private/${optionSlug}${query ? `?${query}` : ""}`;
}

function buildPresaleMailto(customDate: string, customArtist: string): string {
  const subjectParts = ["2027 Red Rocks Private Ride Planning"];
  if (customArtist.trim()) subjectParts.push(customArtist.trim());
  if (customDate.trim()) subjectParts.push(customDate.trim());
  const subject = encodeURIComponent(subjectParts.join(" - "));
  const body = encodeURIComponent(
    [
      "Hi Party at Red Rocks team,",
      "",
      "We are planning private group transportation for a 2027 Red Rocks concert:",
      `- Show / Artist: ${customArtist.trim() || "(TBD / presale)"}`,
      `- Target Date: ${customDate.trim() || "(TBD)"}`,
      `- Vehicle: $${SUBURBAN_2027_USD} Private Suburban (up to 6) or $${VAN_2027_USD} Private Van (up to 10)`,
    ].join("\n")
  );
  return `mailto:hello@partyatredrocks.com?subject=${subject}&body=${body}`;
}

export default function HomeSections({
  heroSrc,
  privateVehicleSrc,
  privateVanSrc = "/images/redesign/private-van-black.webp",
  upcoming2027Preview = [],
  verified2027Count = 0,
  bookingCatalog = [],
  todayDateKey = "2026-11-18",
}: HomeSectionsProps) {
  const [customDate, setCustomDate] = useState("");
  const [customArtist, setCustomArtist] = useState("");
  const [partySize, setPartySize] = useState<number>(4);
  const [pickupArea] = useState<string>(PICKUP_AREAS[0]);
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [showStickyMobileCta, setShowStickyMobileCta] = useState(false);

  function handleBookingContextChange(ctx: SelectedBookingContext) {
    setPartySize(ctx.partySize);
    if (ctx.show && !ctx.show.isPastShow) {
      setCustomDate(ctx.show.dateKey);
      setCustomArtist(ctx.show.title);
    } else {
      setCustomDate("");
      setCustomArtist("");
    }
  }

  useEffect(() => {
    trackNetworkEvent({
      eventName: "service_page_view",
      entryPage: "/",
      travelIntent: "red-rocks-concert",
    });

    const onScroll = () => {
      setShowStickyMobileCta(window.scrollY > 480);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const recommendedOption: "suv" | "van" = partySize > 6 ? "van" : "suv";
  const suvPricing = getPrivateRidePricingForDate({ optionSlug: "suv", serviceDate: customDate });
  const vanPricing = getPrivateRidePricingForDate({ optionSlug: "van", serviceDate: customDate });

  const primaryHeroHref = buildBookingFlowHref(recommendedOption, customDate, customArtist, pickupArea);
  const customSuvHref = buildBookingFlowHref("suv", customDate, customArtist, pickupArea);
  const customVanHref = buildBookingFlowHref("van", customDate, customArtist, pickupArea);
  const presaleMailtoHref = buildPresaleMailto(customDate, customArtist);
  void verified2027Count;

  const filteredShows = useMemo(() => {
    const filtered =
      monthFilter === "all"
        ? upcoming2027Preview
        : upcoming2027Preview.filter((item) => {
            const m = Number(item.dateKey.slice(5, 7));
            if (monthFilter === "spring") return m <= 4;
            if (monthFilter === "may") return m === 5;
            if (monthFilter === "summer") return m >= 6 && m <= 8;
            if (monthFilter === "fall") return m >= 9;
            return true;
          });
    return filtered.slice(0, 9);
  }, [monthFilter, upcoming2027Preview]);

  return (
    <main className="bg-[#070b14] text-white">
      {/* ================= HERO: EMOTIONAL PROMISE + ONE UNIFIED BOOKING ACTION ================= */}
      <section className="mx-auto max-w-[1440px] px-2.5 pt-2 sm:px-6 sm:pt-5 lg:px-8">
        <div className="relative overflow-hidden rounded-[24px] border border-white/12 bg-[#0d1424] shadow-[0_36px_110px_rgba(0,0,0,0.65)] sm:rounded-[36px]">
          <div className="pointer-events-none absolute inset-0">
            <picture>
              <source media="(max-width: 640px)" srcSet="/images/redesign/hero-red-rocks-mobile.webp" />
              <source media="(max-width: 1080px)" srcSet="/images/redesign/hero-red-rocks-tablet.webp" />
              <img
                src={heroSrc}
                alt="Live night concert crowd between the illuminated sandstone monoliths of Red Rocks Amphitheatre"
                width={1600}
                height={900}
                fetchPriority="high"
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover object-center"
              />
            </picture>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,20,0.48)_0%,rgba(7,11,20,0.74)_46%,rgba(7,11,20,0.96)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,140,88,0.22),transparent_42%)]" />
          </div>

          <div className="relative px-3.5 pb-4 pt-3.5 sm:px-8 sm:pb-10 sm:pt-11 lg:px-12 lg:pb-12 lg:pt-14">
            <div className="max-w-3xl">
              <div className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#ffb07c]/40 bg-black/50 px-2.5 py-1 text-[9.5px] font-black uppercase tracking-[0.12em] text-[#ffb07c] backdrop-blur-sm sm:px-3.5 sm:py-1.5 sm:text-[11px] sm:tracking-[0.16em]">
                <Sparkles className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
                <span className="sm:hidden">2027 Season · Tailgate Included</span>
                <span className="hidden sm:inline">2027 Season · Upper North Tailgate Included</span>
              </div>

              <h1 className="mt-2 text-[1.48rem] font-black leading-[1.08] tracking-[-0.03em] text-white sm:mt-4 sm:text-[3.25rem] sm:leading-[1.03] lg:text-[3.9rem]">
                Your Red Rocks night—pickup, tailgate, the show &amp; a safe private ride home.
              </h1>

              <p className="mt-2 max-w-2xl text-[13px] leading-[1.45] text-white/88 sm:mt-4 sm:text-lg sm:leading-relaxed">
                Skip the parking climb and rideshare chaos. Book a Private Suburban (
                <strong className="text-[#ffb07c]">${SUBURBAN_2027_USD}</strong>, up to 6) or Private Van (
                <strong className="text-[#ffb07c]">${VAN_2027_USD}</strong>, up to 10) with Upper North Lot tailgating—chairs, cooler, speaker &amp; ice—and a driver waiting all show.
              </p>
            </div>

            {/* Calm Unified Two-Way Show / Date Booking Entry Selector */}
            <div className="mt-3.5 sm:mt-7">
              <ParrShowBookingSelector
                catalog={bookingCatalog}
                todayDateKey={todayDateKey}
                entrySurface="/"
                mode="navigate"
                onSelectionChange={handleBookingContextChange}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-[1380px] flex-col gap-12 px-4 py-12 sm:gap-16 sm:px-6 sm:py-16 lg:px-8">
        {/* ================= SIDE-BY-SIDE VEHICLE COMPARISON ================= */}
        <section aria-labelledby="vehicle-comparison-heading">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.2em] text-[#ffb07c]">
                Private Fleet · No Shared Strangers · Zero Surge Pricing
              </div>
              <h2
                id="vehicle-comparison-heading"
                className="mt-2 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl"
              >
                Choose Your Group&apos;s Private Vehicle
              </h2>
            </div>
            <p className="max-w-md text-sm text-white/75">
              Both vehicles include your entire night—pickup, Upper North Lot tailgating setup, waiting driver, and return ride.
            </p>
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            {/* Suburban Card */}
            <article className="flex flex-col overflow-hidden rounded-[28px] border border-[#ffb07c]/30 bg-[#0d1424] shadow-[0_24px_70px_rgba(0,0,0,0.4)]">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                <img
                  src={privateVehicleSrc}
                  alt="Representative full-size SUV for private Red Rocks groups up to 6 guests"
                  width={960}
                  height={600}
                  loading="lazy"
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

              <div className="flex flex-1 flex-col justify-between p-5 sm:p-8">
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                      Private Suburban
                    </h3>
                    <div className="text-right">
                      <span className="text-3xl font-black text-[#ffb07c] sm:text-4xl">
                        {suvPricing.priceLabel}
                      </span>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-white/65">
                        Flat round-trip (~$83 each for 6)
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-white/80">
                    Full-size Chevrolet Suburban or equivalent SUV built for couples, double dates, and crews up to 6 who want spacious seating, Upper North Lot tailgating, and an effortless exit.
                  </p>

                  <ul className="mt-5 space-y-2.5 text-sm text-white/88">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#ffb07c]" />
                      <span>Door-to-door Denver, Golden, or Boulder pickup + optional drink stop</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#ffb07c]" />
                      <span>Upper North Lot tailgate gear included: chairs, cooler, Bluetooth speaker &amp; ice</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#ffb07c]" />
                      <span>Driver &amp; locked SUV stay on-site through the entire show</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 flex flex-col gap-2.5 sm:mt-7 sm:flex-row">
                  <Link
                    href={customSuvHref}
                    className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-[#ff7a4d] px-5 text-xs font-black uppercase tracking-[0.13em] text-[#140804] no-underline transition hover:bg-[#ff926b]"
                  >
                    Book Private Suburban — {suvPricing.priceLabel}
                  </Link>
                  <Link
                    href="/book/red-rocks-amphitheatre/private#suv-booking"
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/16 bg-white/6 px-5 text-xs font-bold uppercase tracking-[0.12em] text-white no-underline transition hover:bg-white/12"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </article>

            {/* Van Card */}
            <article className="flex flex-col overflow-hidden rounded-[28px] border border-white/14 bg-[#0d1424] shadow-[0_24px_70px_rgba(0,0,0,0.4)]">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                <img
                  src={privateVanSrc}
                  alt="Representative 10-passenger private van for Red Rocks concert groups"
                  width={960}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-3 top-3 rounded-full border border-sky-300/45 bg-[#070b14]/85 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-sky-200 backdrop-blur sm:left-4 sm:top-4 sm:px-3.5 sm:text-[11px]">
                  Best Group Split · Up to 10 Guests
                </div>
                <span className="absolute bottom-2.5 right-2.5 rounded-full bg-black/75 px-2.5 py-0.5 text-[10px] font-medium text-white/75 backdrop-blur-sm">
                  Representative vehicle; exact vehicle may vary.
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between p-5 sm:p-8">
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                      Private Van
                    </h3>
                    <div className="text-right">
                      <span className="text-3xl font-black text-[#ffb07c] sm:text-4xl">
                        {vanPricing.priceLabel}
                      </span>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-white/65">
                        Flat round-trip (~$70 each for 10)
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-white/80">
                    Spacious 10-passenger private van so birthday crews, bachelor/bachelorette groups, and visiting friends stay together on one timeline instead of splitting into 3 Ubers.
                  </p>

                  <ul className="mt-5 space-y-2.5 text-sm text-white/88">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
                      <span>All 7–10 friends ride, pregame, and arrive together from one address</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
                      <span>Full Upper North Lot tailgate setup: chairs, cooler, Bluetooth speaker &amp; ice</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
                      <span>Dedicated driver &amp; van wait at Red Rocks until the encore wraps</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
                  <Link
                    href={customVanHref}
                    className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-[#ff7a4d] px-6 text-xs font-black uppercase tracking-[0.14em] text-[#140804] no-underline transition hover:bg-[#ff926b]"
                  >
                    Book Private Van — {vanPricing.priceLabel}
                  </Link>
                  <Link
                    href="/book/red-rocks-amphitheatre/private#van-upgrade"
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/16 bg-white/6 px-5 text-xs font-bold uppercase tracking-[0.12em] text-white no-underline transition hover:bg-white/12"
                  >
                    Van Details
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ================= VISUAL "YOUR NIGHT" SEQUENCE ================= */}
        <section aria-labelledby="your-night-heading" className="rounded-[32px] border border-white/10 bg-[#0d1424] p-6 sm:p-10">
          <div className="max-w-3xl">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-[#ffb07c]">
              From Front Door to Final Encore
            </div>
            <h2 id="your-night-heading" className="mt-2 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
              How Your Red Rocks Night Plays Out
            </h2>
            <p className="mt-3 text-base leading-relaxed text-white/78">
              Red Rocks isn&apos;t just a two-hour concert—it&apos;s golden hour in the foothills, cold drinks with your friends in Upper North Lot, watching the rocks light up after dark, and never worrying about who&apos;s driving down the canyon.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {YOUR_NIGHT_STEPS.map((item) => (
              <article
                key={item.step}
                className="flex flex-col overflow-hidden rounded-[22px] border border-white/10 bg-[#080d18]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.alt}
                    width={560}
                    height={350}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(8,13,24,0.88)_100%)]" />
                  <span className="absolute bottom-2.5 left-3 rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#ffb07c]">
                    Step {item.step} · {item.phase}
                  </span>
                </div>
                <div className="flex-1 p-4">
                  <h3 className="text-base font-black uppercase tracking-tight text-white">{item.title}</h3>
                  <p className="mt-1.5 text-xs leading-5 text-white/75">{item.body}</p>
                  {"representativeDisclosure" in item && item.representativeDisclosure ? (
                    <p className="mt-2 text-[10px] text-white/55">Representative vehicle; exact vehicle may vary.</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ================= SIMPLE EXPLANATION OF EVERYTHING INCLUDED ================= */}
        <section aria-labelledby="everything-included-heading" className="rounded-[32px] border border-[#ffb07c]/25 bg-[linear-gradient(180deg,#13192b_0%,#0b101d_100%)] p-6 sm:p-10">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-[#ffb07c]">
                {PARR_VALUE_PROPOSITION.headline}
              </div>
              <h2 id="everything-included-heading" className="mt-2 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                Everything Included in Your Flat Vehicle Rate
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/80 sm:text-base">
                {PARR_VALUE_PROPOSITION.summary}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-xs text-white/70">
              {PARR_VALUE_PROPOSITION.exclusionsSummary}
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUDED_ITEMS.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#ffb07c]" />
                  <h3 className="text-base font-black text-white">{item.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-white/75">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= VERIFIED 2027 RED ROCKS LINEUP PREVIEW ================= */}
        <section
          aria-labelledby="rr-2027-planning-heading"
          className="rounded-[32px] border border-white/12 bg-[#0d1424] p-6 sm:p-10"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ffb07c]/35 bg-[#ffb07c]/10 px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[#ffb07c]">
                <CalendarDays className="h-3.5 w-3.5" />
                {verified2027Count} Verified 2027 Concerts · Official Red Rocks Calendar
              </div>
              <h2
                id="rr-2027-planning-heading"
                className="mt-3 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl"
              >
                Planning a 2027 Red Rocks concert night?
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/78 sm:text-base">
                We publish only officially announced Red Rocks dates verified directly against{" "}
                <a
                  href="https://www.redrocksonline.com/events/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#ffb07c] underline hover:text-white"
                >
                  redrocksonline.com
                </a>{" "}
                (freshness verified Nov 11, 2026) — never guessed or unconfirmed tour dates. Pick your show to prefill your vehicle booking.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/red-rocks/concerts"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#ff7a4d] px-5 text-xs font-black uppercase tracking-[0.14em] text-[#140804] no-underline transition hover:bg-[#ff926b]"
              >
                View All {verified2027Count} Concerts →
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/16 bg-white/6 px-5 text-xs font-bold uppercase tracking-[0.14em] text-white no-underline transition hover:bg-white/12"
              >
                Ask Dispatch About 2027
              </Link>
            </div>
          </div>

          {/* Month Filter Pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { id: "all", label: "Next Announced" },
              { id: "spring", label: "Mar – Apr" },
              { id: "may", label: "May" },
              { id: "summer", label: "Jun – Aug" },
              { id: "fall", label: "Sep – Oct" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMonthFilter(tab.id)}
                className={[
                  "rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] transition",
                  monthFilter === tab.id
                    ? "border-[#ffb07c] bg-[#ffb07c] text-[#140804]"
                    : "border-white/14 bg-white/5 text-white/80 hover:border-white/30 hover:text-white",
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filteredShows.length > 0 ? (
            <div className="mt-5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredShows.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#080d18] p-4 transition hover:border-[#ffb07c]/40"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#ffb07c]">
                      <span>{item.dateLabel}</span>
                      <Link
                        href={`/shows/${encodeURIComponent(item.id)}`}
                        className="text-[11px] text-white/65 underline hover:text-white"
                      >
                        Show page
                      </Link>
                    </div>
                    <h3 className="mt-1.5 text-base font-black text-white">{item.name}</h3>
                    {item.supportLabel ? (
                      <p className="mt-1 line-clamp-1 text-xs text-white/65">with {item.supportLabel}</p>
                    ) : null}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={item.suvBookingHref}
                      className="inline-flex min-h-9 flex-1 items-center justify-center rounded-full bg-[#ff7a4d] px-3 text-[11px] font-black uppercase tracking-[0.1em] text-[#140804] no-underline transition hover:bg-[#ff926b]"
                    >
                      ${SUBURBAN_2027_USD} Suburban
                    </Link>
                    <Link
                      href={item.vanBookingHref}
                      className="inline-flex min-h-9 flex-1 items-center justify-center rounded-full border border-white/16 bg-white/8 px-3 text-[11px] font-bold uppercase tracking-[0.1em] text-white no-underline transition hover:bg-white/14"
                    >
                      ${VAN_2027_USD} Van
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="text-xs leading-5 text-white/75 sm:text-sm">
              <strong className="text-[#ffb07c]">Custom 2027 Show-Date Booking:</strong> Hold artist presale tickets for a newly dropped date? Book any 2027 date directly in the selector above or email our dispatch desk.
            </div>
            <a
              href={presaleMailtoHref}
              className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-white/18 bg-white/8 px-4 text-xs font-bold uppercase tracking-[0.12em] text-white no-underline transition hover:bg-white/14"
            >
              Presale / Custom Date Note →
            </a>
          </div>
        </section>

        {/* ================= LOCAL PLANNING GUIDES (SEO DEPTH PRESERVED) ================= */}
        <section aria-labelledby="local-guides-heading">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.2em] text-[#ffb07c]">
                Local Morrison &amp; Denver Know-How
              </div>
              <h2 id="local-guides-heading" className="mt-1.5 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                Know Before You Head Up Bear Creek Canyon
              </h2>
            </div>
            <Link href="/guide" className="text-xs font-bold uppercase tracking-[0.14em] text-[#ffb07c] underline">
              Explore all Red Rocks guides →
            </Link>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                href: "/red-rocks/what-to-wear",
                icon: Clock,
                tag: "6,450 ft Weather",
                title: "What to Wear by Month",
                copy: "Why Red Rocks drops 15–20°F after sunset—and what layers you can stash in your vehicle.",
              },
              {
                href: "/guide/tailgating",
                icon: Users,
                tag: "Upper North Lot",
                title: "Tailgating Rules & Setup",
                copy: "No glass, no open flames, best arrival windows, and making the most of your included cooler & speaker.",
              },
              {
                href: "/guide/local/denver-pickups",
                icon: MapPin,
                tag: "Denver & Golden",
                title: "Pickup Zones & Timing",
                copy: "How door-to-door pickups work across LoDo, RiNo, Union Station, Golden, and Boulder.",
              },
              {
                href: "/red-rocks/post-concert-exit-guide",
                icon: Music,
                tag: "Encore Strategy",
                title: "Post-Show Exit Reality",
                copy: "How to dodge the Lower South stair climb and rideshare gridlock when the house lights come up.",
              },
            ].map((g) => {
              const Icon = g.icon;
              return (
                <Link
                  key={g.href}
                  href={g.href}
                  className="group rounded-[24px] border border-white/10 bg-[#0d1424] p-5 no-underline transition hover:-translate-y-0.5 hover:border-[#ffb07c]/40"
                >
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#ffb07c]">
                    <Icon className="h-3.5 w-3.5" />
                    <span>{g.tag}</span>
                  </div>
                  <h3 className="mt-2.5 text-lg font-black text-white group-hover:text-[#ffb07c]">{g.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-white/72">{g.copy}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ================= TRUST, SAFETY & SEASONAL FLEET CREDIBILITY (DOWN-PAGE) ================= */}
        <section
          aria-labelledby="trust-safety-heading"
          className="rounded-[32px] border border-white/12 bg-[#0d1424] p-6 sm:p-10"
        >
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center rounded-full border border-[#ffb07c]/30 bg-[#ffb07c]/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-[#ffb07c]">
              Colorado PUC LL-02649 · Commercial Insurance · Direct Dispatch
            </div>
            <h2 id="trust-safety-heading" className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Real Colorado Fleet—Never Brokered Out to Strangers
            </h2>
            <p className="mt-3 text-base leading-relaxed text-white/80">
              The same Colorado transportation operation runs Party at Red Rocks during the summer concert season and{" "}
              <a
                href="https://gosno.co"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#ffb07c] underline hover:text-white"
              >
                GoSno
              </a>{" "}
              during the winter ski season, with 24/7 scheduled service subject to live vehicle and schedule availability.
            </p>

            <div className="mt-7 grid gap-4 border-t border-white/10 pt-6 text-left sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-center gap-2 text-sm font-black text-white">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Never Double-Booked
                </div>
                <p className="mt-1.5 text-xs leading-5 text-white/72">
                  Your vehicle is dedicated to your group for the entire evening and stays parked at Red Rocks while you enjoy the show.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-center gap-2 text-sm font-black text-white">
                  <ShieldCheck className="h-4 w-4 text-[#ffb07c]" /> Vetted Mountain Drivers
                </div>
                <p className="mt-1.5 text-xs leading-5 text-white/72">
                  CBI background-checked commercial chauffeurs who drive I-70 and Morrison canyon corridors year-round.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-center gap-2 text-sm font-black text-white">
                  <CalendarDays className="h-4 w-4 text-sky-300" /> Human Support at 720-369-6292
                </div>
                <p className="mt-1.5 text-xs leading-5 text-white/72">
                  Text or call local dispatch directly before show day to coordinate pickup addresses, stop requests, or schedule changes.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-bold uppercase tracking-[0.14em] text-white/70">
              <Link href="/red-rocks/shuttle" className="text-[#ffb07c] no-underline hover:underline">
                Red Rocks Shuttle Info
              </Link>
              <span>•</span>
              <Link href="/red-rocks/car-service" className="text-[#ffb07c] no-underline hover:underline">
                Private Car Service
              </Link>
              <span>•</span>
              <Link href="/red-rocks/group-transportation" className="text-[#ffb07c] no-underline hover:underline">
                Group Transportation
              </Link>
            </div>
          </div>
        </section>

        <ReviewBlock />
      </div>

      {/* Sticky Mobile Booking Bar */}
      {showStickyMobileCta ? (
        <div className="fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-white/16 bg-[#090e1a]/95 p-3 shadow-[0_18px_44px_rgba(0,0,0,0.75)] backdrop-blur-md md:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-xs font-black uppercase tracking-wide text-white">
                {partySize > 6 ? `${vanPricing.priceLabel} Private Van` : `${suvPricing.priceLabel} Private Suburban`}
              </div>
              <div className="truncate text-[11px] text-white/75">
                Tailgate gear + waiting driver included
              </div>
            </div>
            <Link
              href={primaryHeroHref}
              className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl bg-[#ff7a4d] px-4 text-xs font-black uppercase tracking-[0.12em] text-[#140804] no-underline"
            >
              Book Ride →
            </Link>
          </div>
        </div>
      ) : null}
    </main>
  );
}
