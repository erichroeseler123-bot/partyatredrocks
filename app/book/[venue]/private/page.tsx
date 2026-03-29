import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import venuesJson from "@/data/venues.json";
import { postDccSatelliteEvent, postWtaPartnerAcceptedIfNeeded } from "@/lib/dccSatellite";
import { buildBookingHref, type HandoffSearchParams } from "@/lib/parrHandoff";
import { bookingVisuals } from "@/lib/bookingVisuals";
import { buildDccPrivateCheckoutHref, PRIVATE_RIDE_OPTIONS } from "@/lib/rideCatalog";
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
    title: "Van upgrade when needed",
    body: "If your group is bigger or wants more room, the van is the simple next step without changing the rest of the plan.",
  },
  {
    title: "Built for transportation",
    body: "This page is for getting your group to Red Rocks and back without splitting rides, waiting on strangers, or guessing after the encore.",
  },
];

const INCLUDED = [
  "Private Suburban-sized vehicle for your group",
  "Pickup planning before show night",
  "Guaranteed return ride after the show",
  "Optional upgrade to a van if you need more room",
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
  const featuredOption = PRIVATE_RIDE_OPTIONS.find((option) => option.slug === "suv");
  const upgradeOption = PRIVATE_RIDE_OPTIONS.find((option) => option.slug === "van");

  if (!featuredOption || !upgradeOption) notFound();

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="mx-auto flex max-w-[1120px] flex-col gap-8">
        <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
          <div className="absolute inset-0">
            <Image
              src={bookingVisuals.private.imageSrc}
              alt={bookingVisuals.private.imageAlt}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,22,0.18),rgba(5,8,22,0.78)_55%,rgba(5,8,22,0.95)_100%)]" />
          </div>

          <div className="relative p-8 sm:p-10 lg:p-12">
            <div className="inline-flex items-center rounded-full border border-[#ffb07c]/30 bg-[#ffb07c]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
              Private Ride
            </div>
            <h1 className="mt-5 max-w-4xl text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem]">
              Book a Private SUV for Red Rocks
            </h1>
            <p className="mt-5 max-w-3xl text-[15px] leading-7 text-white/80 sm:text-lg">
              Start with the Suburban-sized private ride. It is the cleanest way to get your group to Red Rocks and back. If you need more room, upgrade to the van below.
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
                <div key={item} className="rounded-[22px] border border-white/10 bg-black/28 px-4 py-4 text-sm font-semibold text-white/90">
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={buildDccPrivateCheckoutHref(featuredOption.slug, vehicleQty)}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#62f6ff] bg-[#62f6ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#05111a] shadow-[0_18px_40px_rgba(61,243,255,0.24)] transition hover:bg-[#8cf8ff]"
              >
                Book Private SUV
              </Link>
              <Link
                href={buildBookingHref({ target: "venue", venue, searchParams: sp })}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/28 bg-[#152038] px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#1d2a46]"
              >
                Back to Ride Types
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
          <div className="text-[22px] font-black uppercase tracking-[0.18em] text-[#ffb07c] sm:text-[24px]">Step 1</div>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">
            Start with the private SUV
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/74">
            For most groups, this is the right move. One Suburban-sized vehicle, one pickup plan, and one ride home after the show.
          </p>

          <div className="mt-6">
            <Link
              href={buildDccPrivateCheckoutHref(featuredOption.slug, vehicleQty)}
              className="group grid gap-6 rounded-[28px] border border-[#62f6ff]/24 bg-[#09101f] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-[#62f6ff]/48 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)] lg:grid-cols-[1.1fr_0.9fr]"
            >
              <div className="relative min-h-[240px] overflow-hidden rounded-[22px] border border-white/10">
                <Image
                  src={bookingVisuals.privateOptions[featuredOption.slug].imageSrc}
                  alt={bookingVisuals.privateOptions[featuredOption.slug].imageAlt}
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
                <p className="mt-4 text-base leading-7 text-white/76">{featuredOption.body}</p>
                <div className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#62f6ff] bg-[#62f6ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#05111a] shadow-[0_18px_40px_rgba(61,243,255,0.24)] transition group-hover:bg-[#8cf8ff] sm:w-auto">
                  Book Private SUV
                </div>
              </div>
            </Link>
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
          <div className="text-[22px] font-black uppercase tracking-[0.18em] text-[#ffb07c] sm:text-[24px]">Step 2</div>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">
            Need more room? Upgrade to the van
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/74">
            If your group is larger or wants extra room, take the van instead. That is the only upgrade path on this page.
          </p>

          <div className="mt-6">
            <Link
              href={buildDccPrivateCheckoutHref(upgradeOption.slug, vehicleQty)}
              className="group grid gap-6 rounded-[28px] border border-white/10 bg-[#09101f] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-[#62f6ff]/35 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)] lg:grid-cols-[0.95fr_1.05fr]"
            >
              <div className="relative min-h-[220px] overflow-hidden rounded-[22px] border border-white/10">
                <Image
                  src={bookingVisuals.privateOptions[upgradeOption.slug].imageSrc}
                  alt={bookingVisuals.privateOptions[upgradeOption.slug].imageAlt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,22,0.08),rgba(5,8,22,0.62)_100%)]" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
                  {upgradeOption.eyebrow}
                </div>
                <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">
                  {upgradeOption.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-white/76">{upgradeOption.body}</p>
                <div className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/22 bg-[#152038] px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition group-hover:bg-[#1d2a46] sm:w-auto">
                  Upgrade to Van
                </div>
              </div>
            </Link>
          </div>
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
