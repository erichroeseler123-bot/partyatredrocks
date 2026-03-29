import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import venuesJson from "@/data/venues.json";
import { postDccSatelliteEvent, postWtaPartnerAcceptedIfNeeded } from "@/lib/dccSatellite";
import { buildBookingHref, type HandoffSearchParams } from "@/lib/parrHandoff";
import { bookingVisuals } from "@/lib/bookingVisuals";
import { buildPrivateBookingJsonLd, buildPrivateBookingMetadata, buildPrivateFaqJsonLd } from "../bookingSeo";
import { PRIVATE_RIDE_OPTIONS } from "@/lib/rideCatalog";

type VenueRow = {
  slug?: string;
  name?: string;
};

type ReasonCard = {
  title: string;
  body: string;
};

const REASONS: ReasonCard[] = [
  {
    title: "One vehicle, one plan",
    body: "Private rides work best when your group wants one pickup, one timeline, and one clean ride home after the show.",
  },
  {
    title: "Better for tailgates and stops",
    body: "This is the better fit when you want to tailgate, make a quick stop, or keep the full night on one vehicle instead of mixing shuttle seats and rideshare.",
  },
  {
    title: "Cleaner post-show exit",
    body: "Your group leaves together with a driver and return plan already set, instead of splitting up and guessing after the encore.",
  },
];

const INCLUDED = [
  "Private driver for your group",
  "Pickup planning before show night",
  "Return ride after the show",
  "Vehicle options from SUV to party bus",
];

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
  const { venue } = await params;
  const sp = await searchParams;
  if (venue !== "red-rocks-amphitheatre") notFound();

  const row = getVenue(venue);
  if (!row?.name) notFound();

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

  const serviceJsonLd = buildPrivateBookingJsonLd({ venue, quantity: 1 });
  const faqJsonLd = buildPrivateFaqJsonLd();

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="mx-auto flex max-w-[1240px] flex-col gap-8">
        <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
          <div className="absolute inset-0">
            <Image
              src={bookingVisuals.private.imageSrc}
              alt={bookingVisuals.private.imageAlt}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,22,0.12),rgba(5,8,22,0.72)_55%,rgba(5,8,22,0.94)_100%)]" />
          </div>

          <div className="relative p-8 sm:p-10 lg:p-12">
            <div className="inline-flex items-center rounded-full border border-[#ffb07c]/30 bg-[#ffb07c]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
              Private Ride
            </div>
            <h1 className="mt-5 max-w-4xl text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem]">
              Choose Your Private Vehicle
            </h1>
            <p className="mt-5 max-w-3xl text-[15px] leading-7 text-white/76 sm:text-lg">
              Private Red Rocks transportation for groups that want one vehicle, one pickup plan, and a cleaner night.
            </p>

            {artist || dateLabel ? (
              <div className="mt-6 inline-flex flex-wrap items-center gap-2 rounded-[22px] border border-emerald-400/28 bg-emerald-500/10 px-4 py-3 text-sm text-white/90">
                <span className="font-black uppercase tracking-[0.16em] text-emerald-200">Selected Night</span>
                <span>
                  {artist || "Your show"}
                  {dateLabel ? ` · ${dateLabel}` : ""}
                </span>
              </div>
            ) : null}

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {INCLUDED.map((item) => (
                <div key={item} className="rounded-[22px] border border-white/10 bg-black/22 px-4 py-4 text-sm font-semibold text-white/88">
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={buildBookingHref({ target: "venue", venue, searchParams: sp })}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/16 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                Back to Ride Types
              </Link>
              <Link
                href="/guide/transportation"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/14 px-6 text-sm font-black uppercase tracking-[0.16em] text-cyan-50 transition hover:border-cyan-200/45 hover:bg-cyan-300/20"
              >
                Transportation Guide
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
          <div className="text-[12px] font-black uppercase tracking-[0.24em] text-[#ffb07c]">Step 1</div>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">
            Pick the vehicle that fits your group
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/74">
            Every option below goes to the next booking page where you can continue with your pickup and show details.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {PRIVATE_RIDE_OPTIONS.map((option) => {
              const optionHref = buildBookingHref({ target: "private-option", venue, option: option.slug, searchParams: sp });
              return (
                <Link
                  key={option.slug}
                  href={optionHref}
                  className="group rounded-[26px] border border-white/10 bg-[#09101f] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-[#3df3ff]/35 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
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
                  <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">
                    {option.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/70">{option.body}</p>
                  <div className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#3df3ff] px-5 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition group-hover:bg-[#62f6ff]">
                    Book This Vehicle
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
          <div className="text-[12px] font-black uppercase tracking-[0.24em] text-[#ffb07c]">Why Private</div>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">
            Why groups book private rides
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {REASONS.map((item) => (
              <div key={item.title} className="rounded-[24px] border border-white/10 bg-[#09101f] p-5">
                <h3 className="text-lg font-black uppercase tracking-[-0.02em] text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/74">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
          <div className="text-[12px] font-black uppercase tracking-[0.24em] text-[#ffb07c]">Need Help?</div>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">
            Questions before you book?
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/74">
            If you want help picking the right vehicle, tailgate timing, or pickup strategy, use one of these before booking.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="sms:17203696292?&body=Hey%20-%20I%20have%20a%20question%20about%20a%20private%20ride%20for%20Red%20Rocks."
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#3df3ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff]"
            >
              Text Us
            </a>
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
      </section>
    </main>
  );
}
