import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, CheckCircle2, ExternalLink } from "lucide-react";
import {
  getDenverDateKey,
  getUpcomingEventsCatalog,
} from "@/lib/events/getCatalog";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";
import { PARR_VALUE_PROPOSITION, SUBURBAN_2027_USD, VAN_2027_USD } from "@/lib/pricing";

const SITE = "https://www.partyatredrocks.com";
const DEFAULT_OG_IMAGE = `${SITE}/hero/hero_red_rocks.webp`;
export const revalidate = 1800;

export const metadata: Metadata = {
  title: `2027 Red Rocks Concert Schedule | Verified Lineup & Private Rides ($${SUBURBAN_2027_USD}/$${VAN_2027_USD})`,
  description:
    `Official 2027 Red Rocks Amphitheatre concert schedule by month. Pick your show, then book a Private Suburban ($${SUBURBAN_2027_USD}, up to 6) or Private Van ($${VAN_2027_USD}, up to 10) with Upper North Lot tailgating.`,
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: `${SITE}/red-rocks/concerts` },
  openGraph: {
    title: "2027 Red Rocks Concert Schedule & Private Group Rides",
    description:
      `Browse all verified 2027 Red Rocks concerts and reserve one flat-rate private vehicle ($${SUBURBAN_2027_USD} Suburban / $${VAN_2027_USD} Van) with tailgating and a waiting driver.`,
    url: `${SITE}/red-rocks/concerts`,
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        alt: "2027 Red Rocks concert schedule and private transportation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "2027 Red Rocks Concert Schedule & Private Rides",
    description:
      `Find your 2027 Red Rocks show and book a $${SUBURBAN_2027_USD} Private Suburban or $${VAN_2027_USD} Private Van.`,
    images: [DEFAULT_OG_IMAGE],
  },
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatMonthHeading(dateKey: string): string {
  const dt = new Date(`${dateKey}T12:00:00`);
  if (!Number.isFinite(dt.getTime())) return dateKey.slice(0, 7);
  return dt.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function formatShowDate(dateKey: string): string {
  const dt = new Date(`${dateKey}T12:00:00`);
  if (!Number.isFinite(dt.getTime())) return dateKey;
  return dt.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatShortMonth(dateKey: string): string {
  const dt = new Date(`${dateKey}T12:00:00`);
  if (!Number.isFinite(dt.getTime())) return dateKey.slice(0, 7);
  return dt.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

const SUMMER_MONTH_GUIDES = [
  { label: "June Guide", href: "/red-rocks/concerts/june" },
  { label: "July Guide", href: "/red-rocks/concerts/july" },
  { label: "August Guide", href: "/red-rocks/concerts/august" },
] as const;

export default async function RedRocksConcertsPage({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;
  const denverToday = getDenverDateKey();
  const currentYear = Number(denverToday.slice(0, 4));
  const years = Array.from(new Set([currentYear, currentYear + 1, 2027])).sort((a, b) => a - b);

  const upcoming = await getUpcomingEventsCatalog({
    scopes: ["redrocks"],
    fromDateKey: denverToday,
    years,
    venueId: "red-rocks-amphitheatre",
    limit: 200,
  });

  const groupedByMonth = upcoming.reduce<
    Array<{ monthLabel: string; shortLabel: string; anchorId: string; shows: typeof upcoming }>
  >((acc, show) => {
    const monthLabel = formatMonthHeading(show.dateKey);
    const shortLabel = formatShortMonth(show.dateKey);
    const anchorId = `month-${show.dateKey.slice(0, 7)}`;
    const last = acc[acc.length - 1];
    if (last && last.monthLabel === monthLabel) {
      last.shows.push(show);
    } else {
      acc.push({ monthLabel, shortLabel, anchorId, shows: [show] });
    }
    return acc;
  }, []);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
      { "@type": "ListItem", position: 3, name: "2027 Concert Schedule", item: `${SITE}/red-rocks/concerts` },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "2027 Red Rocks Amphitheatre Concert Schedule",
    description:
      "Verified upcoming Red Rocks Amphitheatre concerts with official source provenance and private group transportation booking.",
    url: `${SITE}/red-rocks/concerts`,
    about: {
      "@type": "MusicVenue",
      name: "Red Rocks Amphitheatre",
      url: `${SITE}/venues/red-rocks-amphitheatre`,
    },
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Upcoming 2027 Red Rocks Concerts",
    numberOfItems: upcoming.length,
    itemListElement: upcoming.map((event, index) => {
      const verifiedPerformers = event.artistNames
        .map((n) => n.trim())
        .filter((n) => n.length > 0)
        .map((name) => ({ "@type": "MusicGroup", name }));

      return {
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE}/shows/${encodeURIComponent(event.id)}`,
        name: event.name,
        item: {
          "@type": "MusicEvent",
          name: event.name,
          startDate: event.startLocal || event.startAt || event.dateKey,
          url: `${SITE}/shows/${encodeURIComponent(event.id)}`,
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          ...(verifiedPerformers.length > 0 ? { performer: verifiedPerformers } : {}),
          location: {
            "@type": "MusicVenue",
            name: "Red Rocks Amphitheatre",
            url: `${SITE}/venues/red-rocks-amphitheatre`,
            address: {
              "@type": "PostalAddress",
              streetAddress: "18300 W Alameda Pkwy",
              addressLocality: "Morrison",
              addressRegion: "CO",
              postalCode: "80465",
              addressCountry: "US",
            },
          },
        },
      };
    }),
  };

  const generalPrivateHref = buildBookingHref({
    target: "private",
    venue: "red-rocks-amphitheatre",
    searchParams: sp,
  });

  return (
    <main className="min-h-screen bg-[#070b14] px-3 pb-16 pt-2.5 text-white sm:px-6 sm:pb-20 sm:pt-6 lg:px-8">
      <div className="mx-auto max-w-[1280px]">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
        {upcoming.length > 0 ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
        ) : null}

        <section className="relative overflow-hidden rounded-[24px] border border-white/12 bg-[#0d1424] shadow-[0_24px_80px_rgba(0,0,0,0.5)] sm:rounded-[32px]">
          <div className="pointer-events-none absolute inset-0">
            <Image
              src="/images/redesign/red-rocks-sunset-crowd.webp"
              alt="Live Red Rocks concert crowd between sandstone monoliths at dusk"
              fill
              priority
              unoptimized
              className="object-cover object-center opacity-35"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,11,20,0.94)_0%,rgba(7,11,20,0.78)_55%,rgba(7,11,20,0.92)_100%)]" />
          </div>

          <div className="relative p-4 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ffb07c]/35 bg-[#ffb07c]/12 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-[#ffb07c] sm:px-3.5 sm:py-1.5 sm:text-[11px] sm:tracking-[0.18em]">
                <CalendarDays className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
                <span>2027 Lineup · {upcoming.length} Verified Shows</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-200/90 sm:rounded-full sm:border sm:border-emerald-400/30 sm:bg-emerald-500/10 sm:px-3 sm:py-1 sm:text-[11px]">
                <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-300" />
                <span>redrocksonline.com · Verified Nov 11, 2026</span>
              </span>
            </div>

            <h1 className="mt-2 max-w-4xl text-[1.52rem] font-black uppercase leading-[1.03] tracking-[-0.035em] sm:mt-4 sm:text-[3.4rem] sm:leading-[0.96] lg:text-[4rem]">
              2027 Red Rocks Concert Schedule
            </h1>
            <p className="mt-1.5 max-w-3xl text-[13px] leading-[1.42] text-white/82 sm:mt-3 sm:text-base sm:leading-7">
              Pick your concert date below to prefill one flat-rate private vehicle:{" "}
              <strong className="text-[#ffb07c]">${SUBURBAN_2027_USD} Suburban</strong> (up to 6) or{" "}
              <strong className="text-[#ffb07c]">${VAN_2027_USD} Van</strong> (up to 10) with Upper North Lot tailgating &amp; waiting driver.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-3">
              <Link
                href={generalPrivateHref}
                className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#ff7a4d] px-4 text-xs font-black uppercase tracking-[0.12em] text-[#140804] no-underline shadow-[0_12px_28px_rgba(255,122,77,0.3)] transition hover:bg-[#ff926b] sm:min-h-11 sm:px-6 sm:text-xs sm:tracking-[0.14em]"
              >
                Book Any Date (${SUBURBAN_2027_USD} / ${VAN_2027_USD})
              </Link>
              <div className="hidden flex-wrap gap-2 sm:flex">
                {SUMMER_MONTH_GUIDES.map((m) => (
                  <Link
                    key={m.href}
                    href={m.href}
                    className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/16 bg-white/8 px-4 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/14"
                  >
                    {m.label}
                  </Link>
                ))}
              </div>
            </div>

            {groupedByMonth.length > 0 ? (
              <div className="relative mt-3 border-t border-white/10 pt-2.5 sm:mt-5 sm:pt-4">
                <nav
                  aria-label="Jump to concert month"
                  className="-mx-1 flex items-center gap-1.5 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:gap-2 sm:overflow-visible sm:px-0 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {groupedByMonth.map((group) => (
                    <a
                      key={group.anchorId}
                      href={`#${group.anchorId}`}
                      className="shrink-0 rounded-full border border-white/16 bg-black/45 px-3 py-1 text-[11px] font-bold text-white/90 transition hover:border-[#ffb07c]/50 hover:text-[#ffb07c] sm:px-3.5 sm:py-1.5 sm:text-xs"
                    >
                      <span className="sm:hidden">
                        {group.shortLabel} ({group.shows.length})
                      </span>
                      <span className="hidden sm:inline">
                        {group.monthLabel} ({group.shows.length})
                      </span>
                    </a>
                  ))}
                </nav>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-0 w-9 bg-gradient-to-l from-[#0d1424] to-transparent sm:hidden"
                />
              </div>
            ) : null}
          </div>
        </section>

        <div className="mt-5 space-y-8 sm:mt-8 sm:space-y-10">
          {groupedByMonth.map((group) => (
            <section key={group.anchorId} id={group.anchorId} className="scroll-mt-20">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/12 pb-2 sm:pb-3">
                <h2 className="text-xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">
                  {group.monthLabel}
                </h2>
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#ffb07c] sm:text-xs">
                  {group.shows.length} {group.shows.length === 1 ? "Concert" : "Concerts"}
                </span>
              </div>

              <div className="mt-3.5 grid gap-3.5 sm:mt-5 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
                {group.shows.map((event) => {
                  const headliner = event.artistNames[0] || event.name;
                  const supportActs = event.artistNames.slice(1);
                  const bookShowHref = buildBookingHref({
                    target: "private",
                    venue: "red-rocks-amphitheatre",
                    searchParams: sp,
                    overrides: {
                      event: event.name,
                      date: event.dateKey,
                      artist: headliner,
                    },
                  });

                  return (
                    <article
                      key={event.id}
                      className="flex flex-col justify-between rounded-[20px] border border-white/10 bg-[#0d1424] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.3)] transition hover:border-[#ffb07c]/40 sm:rounded-[24px] sm:p-5"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#ffb07c]">
                            {formatShowDate(event.dateKey)}
                          </span>
                          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/65">
                            Red Rocks
                          </span>
                        </div>

                        <h3 className="mt-2 text-lg font-black leading-snug tracking-tight text-white sm:mt-2.5 sm:text-xl">
                          <Link href={`/shows/${encodeURIComponent(event.id)}`} className="hover:text-[#ffb07c]">
                            {event.name}
                          </Link>
                        </h3>

                        {supportActs.length > 0 ? (
                          <p className="mt-1.5 text-xs leading-5 text-white/70">
                            <span className="font-bold text-white/85">With:</span>{" "}
                            {supportActs.map((name, idx) => (
                              <span key={`${event.id}-${name}`}>
                                <Link
                                  href={`/artists/${encodeURIComponent(slugify(name))}`}
                                  className="underline decoration-white/30 hover:text-white"
                                >
                                  {name}
                                </Link>
                                {idx < supportActs.length - 1 ? ", " : ""}
                              </span>
                            ))}
                          </p>
                        ) : null}

                        <p className="mt-2 text-xs text-white/65 sm:mt-3">
                          Private Suburban <strong className="text-white">${SUBURBAN_2027_USD}</strong> (up to 6) · Private Van{" "}
                          <strong className="text-white">${VAN_2027_USD}</strong> (up to 10)
                        </p>
                      </div>

                      <div className="mt-3.5 flex flex-wrap gap-2 border-t border-white/10 pt-3 sm:mt-5 sm:pt-4">
                        <Link
                          href={bookShowHref}
                          className="inline-flex min-h-10 flex-1 items-center justify-center rounded-full bg-[#ff7a4d] px-4 text-xs font-black uppercase tracking-[0.13em] text-[#140804] no-underline transition hover:bg-[#ff926b]"
                        >
                          Book Private Ride
                        </Link>
                        <Link
                          href={`/shows/${encodeURIComponent(event.id)}`}
                          className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/14 bg-white/6 px-4 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white/12"
                        >
                          Show Info
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-10 grid gap-6 rounded-[24px] border border-white/10 bg-[#0d1424] p-5 sm:mt-12 sm:rounded-[28px] sm:p-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.2em] text-[#ffb07c]">
              Don&apos;t See Your Newly Announced Date Yet?
            </div>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
              Reserve Any 2027 Red Rocks Concert Night Directly
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/78 sm:text-base">
              {PARR_VALUE_PROPOSITION.summary} {PARR_VALUE_PROPOSITION.exclusionsSummary}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 sm:hidden">
              {SUMMER_MONTH_GUIDES.map((m) => (
                <Link
                  key={m.href}
                  href={m.href}
                  className="inline-flex min-h-9 items-center justify-center rounded-full border border-white/14 bg-white/6 px-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white/12"
                >
                  {m.label}
                </Link>
              ))}
            </div>
            <p className="mt-3 text-xs text-white/60">
              Lineup dates are cross-checked against{" "}
              <a
                href="https://www.redrocksonline.com/events/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-[#ffb07c] underline"
              >
                redrocksonline.com/events <ExternalLink className="h-3 w-3" />
              </a>{" "}
              (last snapshot verification: November 11, 2026). Looking for past dates? View the{" "}
              <Link href="/2026/red-rocks-concerts" className="text-white/80 underline">
                2026 Red Rocks Concert Archive
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href={generalPrivateHref}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff7a4d] px-6 text-sm font-black uppercase tracking-[0.13em] text-[#140804] no-underline transition hover:bg-[#ff926b]"
            >
              Book Suburban (${SUBURBAN_2027_USD}) or Van (${VAN_2027_USD})
            </Link>
            <Link
              href="/red-rocks/what-to-wear"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/12"
            >
              What to Wear by Month →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
