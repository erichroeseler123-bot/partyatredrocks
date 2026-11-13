"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getPrivateRidePricingForDate,
  PARR_VALUE_PROPOSITION,
  SUBURBAN_2027_USD,
  VAN_2027_USD,
} from "@/lib/pricing";
import { CalendarDays, ShieldCheck, CloudSun, Car, Clock, CheckCircle2 } from "lucide-react";
import { ReviewBlock } from "@/components/ReviewBlock";
import {
  buildAttributedDccRedRocksUrl,
  getOrCreateJourneyId,
  trackNetworkEvent,
} from "@/lib/networkEvents";

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
};

function buildCustomBookingHref(
  optionSlug: "suv" | "van",
  customDate: string,
  customArtist: string
): string {
  const params = new URLSearchParams();
  if (/^\d{4}-\d{2}-\d{2}$/.test(customDate.trim())) {
    params.set("date", customDate.trim());
  }
  if (customArtist.trim()) {
    params.set("artist", customArtist.trim());
  }
  const query = params.toString();
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
      `We are planning private group transportation for a 2027 Red Rocks concert:`,
      `- Show / Presale Artist: ${customArtist.trim() || "(let us know once announced)"}`,
      `- Target Show Date: ${customDate.trim() || "(TBD / presale drop)"}`,
      `- Preferred Vehicle: $${SUBURBAN_2027_USD} Private Suburban (up to 6) or $${VAN_2027_USD} Private Van (up to 10) flat round-trip`,
      "",
      "Please share availability or notify us when this date opens.",
    ].join("\n")
  );
  return `mailto:hello@partyatredrocks.com?subject=${subject}&body=${body}`;
}

export default function HomeSections({
  heroSrc,
  privateVehicleSrc,
  privateVanSrc = "/venues/rrsite_thumb.webp",
  urgency,
  upcoming2027Preview = [],
  verified2027Count = 0,
}: HomeSectionsProps) {
  const [customDate, setCustomDate] = useState("");
  const [customArtist, setCustomArtist] = useState("");
  const [partySize, setPartySize] = useState<number>(4);
  const [pickupArea, setPickupArea] = useState<string>("Denver Metro");
  const [journeyId, setJourneyId] = useState<string>("");
  const [showStickyMobileCta, setShowStickyMobileCta] = useState(false);

  useEffect(() => {
    setJourneyId(getOrCreateJourneyId());
    trackNetworkEvent({
      eventName: "service_page_view",
      entryPage: "/",
      travelIntent: "red-rocks-concert",
    });

    const onScroll = () => {
      setShowStickyMobileCta(window.scrollY > 360);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const recommendedOption = partySize > 6 ? "van" : "suv";
  const heroBookingHref = buildCustomBookingHref(recommendedOption, customDate, customArtist);
  const dccConcertPlanUrl = buildAttributedDccRedRocksUrl({
    date: customDate || undefined,
    partySize,
    origin: pickupArea,
    entryPage: "/",
    journeyId: journeyId || undefined,
  });

  const suvPricing = getPrivateRidePricingForDate({ optionSlug: "suv", serviceDate: customDate });
  const vanPricing = getPrivateRidePricingForDate({ optionSlug: "van", serviceDate: customDate });

  const rideCards = [
    {
      title: "Private Suburban",
      subtitle: `${suvPricing.priceLabel} Private Suburban`,
      copy: "Up to 6 passengers • Flat round-trip",
      bullets: [
        "Upper North Lot tailgating setup (chairs, cooler, ice & speaker) + vehicle waits through the show",
        "Denver-area hotel or home pickup with optional grocery/liquor stop & same vehicle home",
      ],
      href: "/book/red-rocks-amphitheatre/private/suv",
      cta: `Book Private Suburban - ${suvPricing.priceLabel}`,
      image: privateVehicleSrc,
      alt: "Downtown Denver Union Station pickup corridor for private Suburban Red Rocks rides",
      accent: "orange" as const,
    },
    {
      title: "Private Van Upgrade",
      subtitle: `${vanPricing.priceLabel} Private Van`,
      copy: "Up to 10 passengers • Flat round-trip",
      bullets: [
        "Upper North Lot tailgating setup + one pickup plan",
        "Driver & vehicle wait on-site through the show",
      ],
      href: "/book/red-rocks-amphitheatre/private/van",
      cta: `Book Private Van - ${vanPricing.priceLabel}`,
      image: privateVanSrc,
      alt: "Red Rocks Amphitheatre sandstone seating bowl for private 10-passenger van groups",
      accent: "cyan" as const,
    },
  ];

  const customSuvHref = buildCustomBookingHref("suv", customDate, customArtist);
  const customVanHref = buildCustomBookingHref("van", customDate, customArtist);
  const presaleMailtoHref = buildPresaleMailto(customDate, customArtist);

  return (
    <main className="brand-page bg-[radial-gradient(circle_at_top,rgba(255,91,46,0.15),transparent_26%),radial-gradient(circle_at_18%_10%,rgba(59,130,246,0.14),transparent_18%),linear-gradient(180deg,#0b0b0f_0%,#0b0b0f_100%)]">
      <section className="mx-auto flex w-full max-w-[1500px] flex-col gap-8 px-4 pb-24 pt-3 sm:px-6 sm:pt-4 lg:px-8">
        <section className="relative overflow-hidden rounded-[32px] border border-[var(--brand-orange)]/20 bg-[var(--brand-bg-dark)] shadow-[0_40px_120px_rgba(0,0,0,0.58)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[230px] sm:h-[300px] lg:inset-0 lg:h-full">
            <img
              src={heroSrc}
              alt="Illuminated Red Rocks Amphitheatre show night vista above Morrison"
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,18,0.18)_0%,rgba(7,10,18,0.54)_42%,rgba(7,10,18,0.84)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(10,18,56,0.46)_0%,rgba(10,18,56,0.2)_44%,rgba(9,9,9,0.42)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[var(--brand-bg-dark)] lg:hidden" />
          </div>

          <div className="relative px-5 py-5 sm:px-8 sm:py-6 lg:px-10 lg:py-7">
            <div className="mx-auto max-w-5xl text-center">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/75">Private Red Rocks Shuttle &amp; Group Transportation</p>
              <h1 className="mt-2 text-[2rem] font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-[2.9rem] lg:text-[3.35rem]">
                Private transportation for your 2027 Red Rocks show
              </h1>
              <p className="mx-auto mt-2.5 max-w-3xl text-sm leading-6 text-white/84 sm:text-base">
                Choose your show or date. Get Denver-area pickup, a private vehicle that waits through the concert and your return ride home.
              </p>

              {/* Show / Date + Party Size -> Vehicle & Price -> Check Live Availability */}
              <div className="mx-auto mt-4 max-w-4xl rounded-2xl border border-white/15 bg-black/60 p-3.5 text-left backdrop-blur-md sm:p-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[175px_minmax(0,1fr)_140px_auto] lg:items-end">
                  <label className="flex flex-col gap-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white/75">
                    <span>Show Date</span>
                    <input
                      type="date"
                      min="2026-01-01"
                      max="2028-12-31"
                      value={customDate}
                      onChange={(e) => {
                        setCustomDate(e.target.value);
                        if (e.target.value) {
                          trackNetworkEvent({
                            eventName: "date_selected",
                            entryPage: "/",
                            date: e.target.value,
                            travelIntent: "red-rocks-concert",
                          });
                        }
                      }}
                      className="min-h-11 rounded-xl border border-white/20 bg-[#0b101b] px-3 text-sm font-medium text-white focus:border-cyan-300 focus:outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white/75">
                    <span>Show / Artist (Optional)</span>
                    <input
                      type="text"
                      placeholder="e.g., Headliner or presale date"
                      value={customArtist}
                      onChange={(e) => setCustomArtist(e.target.value)}
                      className="min-h-11 rounded-xl border border-white/20 bg-[#0b101b] px-3 text-sm font-medium text-white placeholder:text-white/40 focus:border-cyan-300 focus:outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white/75">
                    <span>Party Size</span>
                    <select
                      value={partySize}
                      onChange={(e) => setPartySize(Number(e.target.value))}
                      className="min-h-11 rounded-xl border border-white/20 bg-[#0b101b] px-3 text-sm font-medium text-white focus:border-cyan-300 focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "guest" : "guests"}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Link
                    href={heroBookingHref}
                    onClick={() =>
                      trackNetworkEvent({
                        eventName: "availability_started",
                        entryPage: "/",
                        date: customDate || undefined,
                        travelIntent: "red-rocks-concert",
                      })
                    }
                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#ff6b3d] px-5 text-xs font-black uppercase tracking-[0.14em] text-[#1b0b05] no-underline transition hover:bg-[#ff845d]"
                  >
                    Check live availability →
                  </Link>
                </div>
                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-white/75">
                  <span>
                    Recommended for {partySize} {partySize === 1 ? "guest" : "guests"}:{" "}
                    <strong className="text-white">
                      {partySize > 6
                        ? `${vanPricing.priceLabel} Private Van (up to 10)`
                        : `${suvPricing.priceLabel} Private Suburban (up to 6)`}
                    </strong>{" "}
                    · Flat round-trip vehicle rate, never per-guest
                  </span>
                  <span className="text-emerald-300 font-semibold">Vehicle waits throughout the concert</span>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {rideCards.map((ride) => {
                const isVan = ride.accent === "cyan";
                return (
                  <Link
                    key={ride.title}
                    href={ride.href}
                    className={`group relative overflow-hidden rounded-[30px] border p-6 text-left no-underline shadow-[0_24px_80px_rgba(0,0,0,0.36)] transition hover:-translate-y-1 ${isVan ? "border-cyan-300/22 bg-[linear-gradient(180deg,rgba(8,20,34,0.98),rgba(5,12,22,0.98))] hover:border-cyan-200/44" : "border-[#ff8f5a]/26 bg-[linear-gradient(180deg,rgba(28,13,10,0.98),rgba(16,9,8,0.98))] hover:border-[#ff9d72]/52 lg:-mt-3 lg:mb-3 lg:p-7"}`}
                  >
                    <div className="absolute right-4 top-4 h-20 w-28 overflow-hidden rounded-[18px] border border-white/10 opacity-85 sm:h-24 sm:w-36">
                      <img src={ride.image} alt={ride.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                    </div>

                    <div className="pr-24 sm:pr-40">
                      {!isVan ? (
                        <div className="inline-flex rounded-full border border-[#ffb07c]/30 bg-[#ffb07c]/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#ffcfad]">{ride.copy}</div>
                      ) : null}
                      <h2 className="text-[1.8rem] font-black uppercase tracking-[-0.05em] text-white sm:text-[2.2rem]">{ride.title}</h2>
                      <div className="mt-3 text-[1.9rem] font-black tracking-[-0.04em] text-white sm:text-[2.6rem]">{ride.subtitle}</div>
                      {isVan ? (
                        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-white/68">{ride.copy}</p>
                      ) : (
                        <p className="mt-3 text-sm leading-6 text-white/76">Private transportation with your pickup and return plan coordinated before the show.</p>
                      )}
                    </div>

                    {isVan ? (
                      <div className="mt-6 flex flex-wrap gap-3">
                        {ride.bullets.map((bullet) => (
                          <span key={bullet} className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/14 bg-white/6 px-5 text-sm font-black uppercase tracking-[0.16em] text-white/86">{bullet}</span>
                        ))}
                      </div>
                    ) : (
                      <ul className="mt-6 space-y-2">
                        {ride.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-3 text-sm leading-6 text-white/82">
                            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#ffb07c]" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className={`mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-full px-6 text-sm font-black uppercase tracking-[0.16em] transition sm:w-auto ${isVan ? "bg-[#3df3ff] text-[#07111d] group-hover:bg-[#62f6ff]" : "bg-[#ff6b3d] text-[#1b0b05] group-hover:bg-[#ff845d]"}`}>
                      {ride.cta} →
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
              <Link href="/red-rocks/shuttle" className="brand-link font-bold no-underline">Red Rocks shuttle options</Link>
              <span className="text-white/30">•</span>
              <Link href="/red-rocks/car-service" className="brand-link font-bold no-underline">Private car service</Link>
              <span className="text-white/30">•</span>
              <Link href="/red-rocks/group-transportation" className="brand-link font-bold no-underline">Group transportation</Link>
            </div>
          </div>
        </section>

        {/* Section 2: Visual 7-Step Concert Night Experience & Flat-Price Value */}
        <section aria-label="How the private ride works" className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between mb-4">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ffb07c]">
                {PARR_VALUE_PROPOSITION.headline}
              </div>
              <p className="mt-1.5 max-w-4xl text-sm leading-6 text-white/82">
                {PARR_VALUE_PROPOSITION.summary} {PARR_VALUE_PROPOSITION.tailgatingSummary}
              </p>
            </div>
            <div className="text-xs text-white/60 lg:text-right shrink-0">
              {PARR_VALUE_PROPOSITION.exclusionsSummary}
            </div>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-7">
            {[
              { step: "1", label: "Pickup", sub: "Denver-area hotel or home" },
              { step: "2", label: "Optional Stop", sub: "Grocery or liquor stop" },
              { step: "3", label: "Upper North Lot", sub: "Red Rocks primary tailgate lot" },
              { step: "4", label: "Tailgate Setup", sub: "Chairs, cooler, ice & speaker" },
              { step: "5", label: "Tailgate", sub: "Time to tailgate pre-show" },
              { step: "6", label: "Concert", sub: "Driver & vehicle wait on-site" },
              { step: "7", label: "Same Vehicle Home", sub: "Flat rate, zero surge" },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-white/10 bg-black/40 p-3.5">
                <div className="text-[10px] font-black uppercase tracking-wider text-cyan-300">
                  Step {item.step}
                </div>
                <div className="mt-1 text-sm font-black text-white">{item.label}</div>
                <div className="mt-0.5 text-xs text-white/65">{item.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {urgency ? (
          <section className="brand-glass-bar overflow-hidden rounded-[24px] p-4 sm:p-5">
            <div className="grid gap-4 sm:grid-cols-[120px_minmax(0,1fr)_auto] sm:items-center">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] border border-white/10">
                <img src={urgency.imageSrc} alt={urgency.imageAlt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div>
                <div className="brand-kicker text-[12px] sm:text-[13px] font-black uppercase tracking-[0.24em]">{urgency.label}</div>
                <p className="mt-1 text-sm leading-6 text-white/82">{urgency.detail}</p>
              </div>
              <div className="flex flex-col items-stretch gap-2 sm:items-end">
                <Link
                  href={urgency.bookingHref || "/book/red-rocks-amphitheatre/private/suv"}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#ff6b3d] px-5 text-xs font-black uppercase tracking-[0.14em] text-[#1b0b05] no-underline transition hover:bg-[#ff845d]"
                >
                  Book {suvPricing.priceLabel} ride
                </Link>
                <Link href="/week/red-rocks" className="brand-link inline-flex items-center justify-center text-xs font-black uppercase tracking-[0.14em] no-underline sm:justify-end">View lineup</Link>
              </div>
            </div>
          </section>
        ) : null}

        {/* Truthful 2027 Red Rocks Season Ride Planning & Custom Show-Date / Presale Booking */}
        <section
          aria-labelledby="rr-2027-planning-heading"
          className="brand-panel relative overflow-hidden rounded-[30px] border border-cyan-300/20 bg-[radial-gradient(ellipse_at_top_right,rgba(61,243,255,0.12),transparent_52%),linear-gradient(180deg,rgba(12,18,28,0.97)_0%,rgba(9,12,20,0.99)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.4)] sm:p-8 lg:p-10"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-cyan-200">
                <CalendarDays className="h-3.5 w-3.5" />
                2027 Red Rocks Season • Verified Calendar + Early Ride Booking
              </div>
              <h2
                id="rr-2027-planning-heading"
                className="mt-4 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl lg:text-4xl"
              >
                Planning a 2027 Red Rocks concert night?
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/80 sm:text-base">
                Red Rocks Amphitheatre announces its 2027 concert calendar in waves from late fall through spring. We publish only officially announced Red Rocks dates verified directly against{" "}
                <a
                  href="https://www.redrocksonline.com/events/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-cyan-300 underline decoration-cyan-300/40 underline-offset-4 hover:text-white"
                >
                  redrocksonline.com
                </a>
                {" "}— never guessed or unconfirmed tour dates.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                href="/schedule"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/16 bg-white/6 px-5 text-xs font-black uppercase tracking-[0.16em] text-white no-underline transition hover:border-white/32 hover:bg-white/10"
              >
                {verified2027Count > 0 ? `Browse ${verified2027Count} Verified 2027 Dates` : "View Concert Schedule"}
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 text-xs font-black uppercase tracking-[0.16em] text-cyan-200 no-underline transition hover:bg-cyan-300/20"
              >
                Ask Dispatch About 2027
              </Link>
            </div>
          </div>

          {upcoming2027Preview.length > 0 ? (
            <div className="mt-8">
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60">
                First Officially Announced 2027 Red Rocks Concerts
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {upcoming2027Preview.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-[0.14em] text-cyan-200">
                        <span>{item.dateLabel}</span>
                        {item.sourceUrl ? (
                          <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-semibold text-white/55 underline decoration-white/25 hover:text-white"
                          >
                            Official listing
                          </a>
                        ) : null}
                      </div>
                      <div className="mt-1.5 text-base font-black text-white">{item.name}</div>
                      {item.supportLabel ? (
                        <div className="mt-1 text-xs text-white/62">with {item.supportLabel}</div>
                      ) : null}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={item.suvBookingHref}
                        className="inline-flex min-h-9 items-center justify-center rounded-full bg-[#ff6b3d] px-3.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#1b0b05] no-underline transition hover:bg-[#ff845d]"
                      >
                        ${SUBURBAN_2027_USD} Suburban
                      </Link>
                      <Link
                        href={item.vanBookingHref}
                        className="inline-flex min-h-9 items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-300/12 px-3.5 text-[11px] font-black uppercase tracking-[0.12em] text-cyan-200 no-underline transition hover:bg-cyan-300/22"
                      >
                        ${VAN_2027_USD} Private Van
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-white/78">
              Official 2027 Red Rocks concert dates have not yet been published in our current venue snapshot. If your artist presale just dropped or you already hold 2027 tickets, enter your exact show date below to reserve a private vehicle or request dispatch coordination.
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-white/12 bg-black/30 p-5 sm:p-6">
            <div className="max-w-3xl">
              <div className="text-xs font-black uppercase tracking-[0.18em] text-[#ffb07c]">
                Custom 2027 Show-Date Booking &amp; Artist Presale Ride Interest
              </div>
              <p className="mt-1.5 text-sm leading-6 text-white/76">
                Got artist presale tickets before our calendar syncs, or locking in a 2027 show night early? Enter your 2027 concert date to prefill online booking at live flat round-trip vehicle pricing (${SUBURBAN_2027_USD} Private Suburban up to 6 passengers, ${VAN_2027_USD} Private Van up to 10 passengers), or send our dispatch desk a presale coordination note.
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[220px_minmax(0,1fr)_auto] lg:items-end">
              <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                <span>2027 Show Date</span>
                <input
                  type="date"
                  min="2027-01-01"
                  max="2027-12-31"
                  value={customDate}
                  onChange={(event) => setCustomDate(event.target.value)}
                  className="min-h-11 rounded-xl border border-white/16 bg-[#0b101b] px-3.5 text-sm font-medium normal-case tracking-normal text-white focus:border-cyan-300 focus:outline-none"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                <span>Artist or Tour (Optional)</span>
                <input
                  type="text"
                  placeholder="e.g., Artist presale or headliner name"
                  value={customArtist}
                  onChange={(event) => setCustomArtist(event.target.value)}
                  className="min-h-11 rounded-xl border border-white/16 bg-[#0b101b] px-3.5 text-sm font-medium normal-case tracking-normal text-white placeholder:text-white/35 focus:border-cyan-300 focus:outline-none"
                />
              </label>

              <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-1">
                <Link
                  href={customSuvHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#ff6b3d] px-4 text-xs font-black uppercase tracking-[0.14em] text-[#1b0b05] no-underline transition hover:bg-[#ff845d]"
                >
                  Book {suvPricing.priceLabel} Suburban
                </Link>
                <Link
                  href={customVanHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#3df3ff] px-4 text-xs font-black uppercase tracking-[0.14em] text-[#07111d] no-underline transition hover:bg-[#62f6ff]"
                >
                  Book {vanPricing.priceLabel} Van
                </Link>
                <a
                  href={presaleMailtoHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/18 bg-white/6 px-4 text-xs font-black uppercase tracking-[0.14em] text-white no-underline transition hover:bg-white/12"
                >
                  Presale / Custom Inquiry
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: DCC-Powered Planning (Embedded Facts + Contextual Handoff) */}
        <section
          aria-labelledby="dcc-concert-plan-heading"
          className="brand-panel rounded-[30px] border border-cyan-300/20 bg-[linear-gradient(180deg,rgba(8,20,34,0.92),rgba(7,11,18,0.98))] p-6 sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-cyan-200">
                <CloudSun className="h-3.5 w-3.5" />
                Destination Command Center · Concert-Night Planning
              </div>
              <h2 id="dcc-concert-plan-heading" className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
                Plan the whole concert night
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/78 sm:text-base">
                Check weather, venue conditions, pickup timing, and your complete transportation plan without leaving your booking flow.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col shrink-0">
              <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wider text-white/65">
                <span>Pickup Area</span>
                <select
                  value={pickupArea}
                  onChange={(e) => setPickupArea(e.target.value)}
                  className="min-h-10 rounded-xl border border-white/15 bg-[#0b101b] px-3 text-xs font-semibold text-white"
                >
                  <option value="Denver Metro">Denver Metro / Downtown</option>
                  <option value="Union Station">Union Station / LoDo</option>
                  <option value="RiNo">RiNo</option>
                  <option value="Golden">Golden / West Metro</option>
                  <option value="Boulder">Boulder</option>
                  <option value="DIA">Denver Airport Area (DIA)</option>
                </select>
              </label>
              <a
                href={dccConcertPlanUrl}
                onClick={() => {
                  trackNetworkEvent({
                    eventName: "dcc_plan_opened",
                    destinationSite: "dcc",
                    entryPage: "/",
                    date: customDate || undefined,
                    travelIntent: "red-rocks-concert",
                  });
                  trackNetworkEvent({
                    eventName: "network_handoff",
                    destinationSite: "dcc",
                    entryPage: "/",
                    date: customDate || undefined,
                    travelIntent: "red-rocks-concert",
                  });
                }}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-cyan-300/35 bg-cyan-300/15 px-4 text-xs font-black uppercase tracking-[0.12em] text-cyan-100 no-underline transition hover:bg-cyan-300/25"
              >
                Open full DCC concert plan →
              </a>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3 text-xs leading-6">
            <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
              <div className="flex items-center gap-2 font-black uppercase tracking-wider text-cyan-300">
                <Clock className="h-4 w-4" /> Pickup &amp; Tailgate Timing
              </div>
              <p className="mt-1.5 text-white/75">
                Leave <strong>{pickupArea}</strong> ~2.5 hours before doors if tailgating, or ~90 minutes before showtime for direct arrival. Your private vehicle waits on-site through the encore.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
              <div className="flex items-center gap-2 font-black uppercase tracking-wider text-amber-300">
                <CloudSun className="h-4 w-4" /> Venue &amp; Weather Reality
              </div>
              <p className="mt-1.5 text-white/75">
                Red Rocks sits at 6,450 ft elevation — evening temperatures drop 15–20°F after sunset, and sudden Front Range wind/lightning holds happen even on warm Denver afternoons.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
              <div className="flex items-center gap-2 font-black uppercase tracking-wider text-emerald-300">
                <Car className="h-4 w-4" /> Post-Show Exit Plan
              </div>
              <p className="mt-1.5 text-white/75">
                Rideshare surge and wait times spike 60–90 minutes after encores. With a private Suburban or van, you walk straight to your waiting vehicle.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Trust, Licensing, Cancellation & Company Credibility */}
        <section className="brand-panel relative overflow-hidden rounded-[30px] border border-white/12 bg-[radial-gradient(ellipse_at_top,rgba(255,91,46,0.14),transparent_55%),linear-gradient(180deg,rgba(20,20,26,0.96)_0%,rgba(11,11,15,0.98)_100%)] p-6 sm:p-8 lg:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.36)]">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center rounded-full border border-[var(--brand-orange)]/30 bg-[var(--brand-orange)]/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-[var(--brand-orange)]">
              Licensed Colorado Private Fleet · Vehicle Waits Throughout the Concert
            </div>
            <p className="mt-4 text-lg font-bold leading-relaxed text-white sm:text-xl lg:text-[1.35rem]">
              The same Colorado transportation operation runs Party at Red Rocks during the summer concert season and{" "}
              <a
                href="https://gosno.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--brand-cyan)] underline decoration-[var(--brand-cyan)]/40 underline-offset-4 hover:text-white"
              >
                GoSno
              </a>{" "}
              during the winter ski season, with 24/7 scheduled service subject to live vehicle and schedule availability.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 pt-6 border-t border-white/10 sm:grid-cols-3 text-left">
              <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                <div className="flex items-center gap-2 text-sm font-black text-white">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Vehicle Waits On-Site
                </div>
                <div className="mt-1 text-xs leading-5 text-white/70">Your driver stays staged at Red Rocks throughout the entire show — never double-booked.</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                <div className="flex items-center gap-2 text-sm font-black text-[var(--brand-cyan)]">
                  <ShieldCheck className="h-4 w-4 text-cyan-300" /> Licensed &amp; Insured
                </div>
                <div className="mt-1 text-xs leading-5 text-white/70">PUC-compliant commercial passenger transportation with direct dispatch support at (720) 369-6292.</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                <div className="flex items-center gap-2 text-sm font-black text-[var(--brand-orange)]">
                  <CalendarDays className="h-4 w-4 text-orange-300" /> Clear Cancellation Policy
                </div>
                <div className="mt-1 text-xs leading-5 text-white/70">Full reschedule or refund flexibility ahead of show week; see booking terms for exact cutoff hours.</div>
              </div>
            </div>
          </div>
        </section>

        <ReviewBlock />
      </section>

      {showStickyMobileCta ? (
        <div className="md:hidden fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-white/15 bg-[#0b101b]/95 p-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.65)] backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 text-left">
              <div className="truncate text-[11px] font-black uppercase tracking-[0.12em] text-white">
                {partySize > 6 ? `${vanPricing.priceLabel} Private Van` : `${suvPricing.priceLabel} Private Suburban`}
              </div>
              <div className="truncate text-[11px] text-white/70">
                {partySize} {partySize === 1 ? "guest" : "guests"} · Vehicle waits on-site
              </div>
            </div>
            <Link
              href={heroBookingHref}
              onClick={() =>
                trackNetworkEvent({
                  eventName: "availability_started",
                  entryPage: "/",
                  date: customDate || undefined,
                  travelIntent: "red-rocks-concert",
                })
              }
              className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl bg-[#ff6b3d] px-4 text-[11px] font-black uppercase tracking-[0.12em] text-[#1b0b05] no-underline"
            >
              Check Live Availability →
            </Link>
          </div>
        </div>
      ) : null}
    </main>
  );
}
