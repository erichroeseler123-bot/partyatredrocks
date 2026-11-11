"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, ShieldCheck } from "lucide-react";
import { ReviewBlock } from "@/components/ReviewBlock";

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
      `- Preferred Vehicle: $399 Private Suburban (up to 6) or $599 Private Van (up to 10)`,
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

  const rideCards = [
    {
      title: "Private Suburban",
      subtitle: "$399 Private Suburban",
      copy: "Up to 6 passengers • Your group, your vehicle",
      bullets: [
        "Tailgating + your vehicle waits in the same spot during the show",
        "Denver-area hotel or home pickup with liquor/grocery stop",
      ],
      href: "/book/red-rocks-amphitheatre/private/suv",
      cta: "Book Private Suburban - $399",
      image: privateVehicleSrc,
      alt: "Downtown Denver Union Station pickup corridor for private Suburban Red Rocks rides",
      accent: "orange" as const,
    },
    {
      title: "Private Van Upgrade",
      subtitle: "$599 Private Van",
      copy: "Up to 10 passengers • More room for larger groups",
      bullets: ["One pickup plan", "Book online through Rezdy"],
      href: "/book/red-rocks-amphitheatre/private/van",
      cta: "Upgrade to Private Van",
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
      <section className="mx-auto flex w-full max-w-[1500px] flex-col gap-10 px-4 pb-24 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <section className="relative overflow-hidden rounded-[36px] border border-[var(--brand-orange)]/20 bg-[var(--brand-bg-dark)] shadow-[0_40px_120px_rgba(0,0,0,0.58)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[270px] sm:h-[360px] lg:inset-0 lg:h-full">
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

          <div className="relative px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
            <div className="mx-auto max-w-5xl text-center">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/72 sm:text-[12px]">Private Red Rocks Shuttle &amp; Group Transportation</p>
              <h1 className="mt-4 text-[2.7rem] font-black leading-[0.92] tracking-[-0.05em] text-white sm:text-[4.3rem] lg:text-[5.6rem]">
                Private Red Rocks shuttle service for your group
              </h1>
              <p className="mx-auto mt-5 max-w-4xl text-base leading-8 text-white/82 sm:text-lg">
                Dedicated private group transportation for your entire party. Your driver provides Denver-area hotel or home pickup, coordinated Red Rocks drop-off at designated venue areas, waits on-site during the show, and includes your return ride home together.
              </p>
              <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-white/72">
                Private group transportation only — not a shared bus or public transit. No shared seats or per-person fares. $399 Private Suburban (up to 6 passengers) or $599 Private Van (up to 10 passengers).
              </p>
              <p className="mx-auto mt-3 max-w-3xl text-sm font-semibold uppercase tracking-[0.14em] text-white/72 sm:text-[13px]">
                Private Group Transportation Only • Denver-Area Hotel &amp; Home Pickup • Coordinated Red Rocks Drop-Off • Vehicle Waits During The Show • Return Ride Included
              </p>
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
                  Book $399 ride
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
                        $399 Suburban
                      </Link>
                      <Link
                        href={item.vanBookingHref}
                        className="inline-flex min-h-9 items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-300/12 px-3.5 text-[11px] font-black uppercase tracking-[0.12em] text-cyan-200 no-underline transition hover:bg-cyan-300/22"
                      >
                        $599 Private Van
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
                Got artist presale tickets before our calendar syncs, or locking in a 2027 show night early? Enter your 2027 concert date to prefill online booking at live flat vehicle pricing ($399 Private Suburban up to 6 passengers, $599 Private Van up to 10 passengers), or send our dispatch desk a presale coordination note.
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
                  Book $399 Suburban
                </Link>
                <Link
                  href={customVanHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#3df3ff] px-4 text-xs font-black uppercase tracking-[0.14em] text-[#07111d] no-underline transition hover:bg-[#62f6ff]"
                >
                  Book $599 Van
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

        {/* Company Credibility Section */}
        <section className="brand-panel relative overflow-hidden rounded-[30px] border border-white/12 bg-[radial-gradient(ellipse_at_top,rgba(255,91,46,0.14),transparent_55%),linear-gradient(180deg,rgba(20,20,26,0.96)_0%,rgba(11,11,15,0.98)_100%)] p-6 sm:p-8 lg:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.36)]">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center rounded-full border border-[var(--brand-orange)]/30 bg-[var(--brand-orange)]/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-[var(--brand-orange)]">
              Colorado Seasonal Transportation Network
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
            <div className="mt-6 grid grid-cols-1 gap-4 pt-6 border-t border-white/10 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-center">
                <div className="text-2xl font-black text-white sm:text-3xl">Private Fleet</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/60">Suburbans &amp; Passenger Vans</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-center">
                <div className="text-2xl font-black text-[var(--brand-cyan)] sm:text-3xl">24/7 Service</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/60">Subject to Live Availability</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-center">
                <div className="text-2xl font-black text-[var(--brand-orange)] sm:text-3xl">Summer &amp; Winter</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/60">Party at Red Rocks &amp; GoSno</div>
              </div>
            </div>
          </div>
        </section>

        <ReviewBlock />
      </section>
    </main>
  );
}
