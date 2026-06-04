import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import venuesJson from "@/data/venues.json";
import { postDccSatelliteEvent, postWtaPartnerAcceptedIfNeeded } from "@/lib/dccSatellite";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { bookingVisuals } from "@/lib/bookingVisuals";
import { curatedImages } from "@/lib/curatedImages";
import {
  buildParrPrivateCheckoutHref,
  getSuburbanDisplayPrice,
  PUBLIC_PRIVATE_RIDE_OPTIONS,
  SUBURBAN_PRICE_LABEL,
} from "@/lib/rideCatalog";
import { buildPrivateBookingJsonLd, buildPrivateBookingMetadata, buildPrivateFaqJsonLd } from "../bookingSeo";

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
    title: "Suburban by default",
    body: "Most groups just need one clean SUV, one pickup plan, and one guaranteed ride home after the show.",
  },
  {
    title: "Private pickup plan",
    body: "Your group gets one direct pickup plan instead of sorting out multiple stops or post-show rideshare timing.",
  },
  {
    title: "Built for transportation",
    body: "This page is for getting your group to Red Rocks and back without splitting rides, waiting on strangers, or guessing after the encore.",
  },
];

const INCLUDED = [
  "Tailgating + your car waits in the same spot during the show",
  "Door-to-door with liquor or grocery stop",
  "Limo-lane access and guaranteed return trip",
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

  const qtyValue = firstValue(sp, "qty");
  const vehicleQty = qtyValue ? Math.max(1, Number(qtyValue) || 1) : 1;

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
  const featuredOption = PUBLIC_PRIVATE_RIDE_OPTIONS.find((option) => option.slug === "suv");
  const featuredVisual = bookingVisuals.privateOptions.suv;

  if (!featuredOption || !featuredVisual) notFound();

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="mx-auto flex max-w-[1120px] flex-col gap-8">
        <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
          <div className="absolute inset-0">
            <Image
              src={curatedImages.homepageHero}
              alt="Red Rocks Amphitheatre at dusk"
              fill
              unoptimized
              priority
              className="object-cover object-center opacity-48"
              sizes="(min-width: 1024px) 1120px, 100vw"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(98,246,255,0.14),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(255,176,124,0.14),transparent_34%),linear-gradient(180deg,rgba(5,8,22,0.3),rgba(5,8,22,0.82)_55%,rgba(5,8,22,0.96)_100%)]" />
          </div>

          <div className="relative p-8 sm:p-10 lg:p-12">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <div className="inline-flex items-center rounded-full border border-[#ffb07c]/30 bg-[#ffb07c]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
                  Private Red Rocks Transportation
                </div>
                <h1 className="mt-5 max-w-4xl text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem]">
                  Private Transportation To Red Rocks. Start With The Suburban.
                </h1>
                <p className="mt-5 max-w-3xl text-[15px] leading-7 text-white/80 sm:text-lg">
                  Start here with the Suburban for most groups. Includes tailgating time in the limo lane and your vehicle waiting in the same spot until the show ends, so there is no scramble for rides afterward.
                </p>
                <p className="mt-3 max-w-3xl text-sm font-semibold uppercase tracking-[0.14em] text-white/72">
                  No waiting for Uber. No surge pricing. No chaos after the show.
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

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href={buildParrPrivateCheckoutHref(featuredOption.slug, vehicleQty)}
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#62f6ff] bg-[#62f6ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#05111a] shadow-[0_18px_40px_rgba(61,243,255,0.24)] transition hover:bg-[#8cf8ff]"
                  >
                  Book Private Suburban
                </Link>
                </div>
              </div>

              <div className="relative min-h-[280px] overflow-hidden rounded-[28px] border border-white/10 bg-black/20">
                <Image
                  src={featuredVisual.imageSrc}
                  alt={featuredVisual.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,22,0.08),rgba(5,8,22,0.74)_100%)]" />
              </div>
            </div>
          </div>
        </section>

        <section id="suv-booking" className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
          <div className="text-[22px] font-black uppercase tracking-[0.18em] text-[#ffb07c] sm:text-[24px]">Step 1</div>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">
            Private Suburban - Up To 6 People - {SUBURBAN_PRICE_LABEL}
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/74">
            Start here with the Suburban for most groups. Tailgating is built in, and the vehicle stays parked in the same spot waiting for your group until the show ends.
          </p>

          <div className="mt-6">
            <Link
              href={buildParrPrivateCheckoutHref(featuredOption.slug, vehicleQty)}
              className="group grid gap-6 rounded-[28px] border border-[#62f6ff]/24 bg-[#09101f] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-[#62f6ff]/48 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)] lg:grid-cols-[1.1fr_0.9fr]"
            >
              <div className="relative min-h-[240px] overflow-hidden rounded-[22px] border border-white/10">
                <Image
                  src={featuredVisual.imageSrc}
                  alt={featuredVisual.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,22,0.05),rgba(5,8,22,0.58)_100%)]" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
                  {featuredOption.eyebrow}
                </div>
                <h3 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">
                  {featuredOption.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {INCLUDED.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-6 text-white/82">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#62f6ff]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#62f6ff] bg-[#62f6ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#05111a] shadow-[0_18px_40px_rgba(61,243,255,0.24)] transition group-hover:bg-[#8cf8ff] sm:w-auto">
                  Book Private Suburban - {SUBURBAN_PRICE_LABEL}
                </div>
              </div>
            </Link>
          </div>
          <div className="mt-5 grid gap-2 text-sm font-bold text-white/76 sm:grid-cols-4">
            {[1, 2, 3, 4].map((vehicleNumber) => (
              <div key={vehicleNumber} className="rounded-2xl border border-white/10 bg-black/18 px-4 py-3">
                {vehicleNumber === 1 ? "1st" : vehicleNumber === 2 ? "2nd" : vehicleNumber === 3 ? "3rd" : "4th"} Suburban:{" "}
                <span className="text-white">{getSuburbanDisplayPrice(vehicleNumber)}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
            Actual SUV/van checkout is handled by Rezdy; update Rezdy product pricing to match public pricing.
          </p>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
          <div className="text-[12px] font-black uppercase tracking-[0.24em] text-[#ffb07c]">Why Private</div>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">
            Why groups book private transportation
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
      </section>
    </main>
  );
}
