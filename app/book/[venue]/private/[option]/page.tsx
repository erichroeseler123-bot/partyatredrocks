import Link from "next/link";
import { notFound } from "next/navigation";
import venuesJson from "@/data/venues.json";
import { PlanningLinks } from "@/components/booking/PlanningLinks";
import { PrivatePromoBanner } from "@/components/booking/PrivatePromoBanner";
import { DccReturnBanner } from "@/components/booking/DccReturnBanner";
import { postDccSatelliteEvent, postWtaPartnerAcceptedIfNeeded } from "@/lib/dccSatellite";
import { buildBookingHref, type HandoffSearchParams } from "@/lib/parrHandoff";
import { TrustStrip } from "@/components/TrustStrip";

type VenueRow = {
  slug?: string;
  name?: string;
};

const optionMeta = {
  suv: {
    title: "Private SUV",
    body: "Best for small groups that want Upper North limo-lane access, time to tailgate, and one vehicle for the full night.",
    price: "$499",
    dccProduct: "parr-suburban",
    ctaLabel: "Start SUV Checkout",
  },
  van: {
    title: "10 Passenger Van",
    body: "Best for groups that want limo-lane access, time to tailgate, and one van for the full night.",
    price: "$599",
    dccProduct: "parr-van-10",
    ctaLabel: "Start Van Checkout",
  },
  sprinter: {
    title: "14 Passenger Sprinter",
    body: "Best for larger groups that want more room, limo-lane access, and one vehicle for the full night.",
    price: "$799",
    dccProduct: "parr-sprinter-14",
    ctaLabel: "Start Sprinter Checkout",
  },
  "party-bus": {
    title: "24 Passenger Party Bus",
    body: "Best for bigger groups that want to tailgate, stay together, and make the ride part of the night.",
    price: "$1199",
    dccProduct: "parr-party-bus-24",
    ctaLabel: "Start Party Bus Checkout",
  },
} as const;

const privateBenefits = [
  "Upper North limo-lane access",
  "Better fit for groups who want to tailgate before the show",
  "One vehicle for the full night",
  "Pickup details sent before your ride",
  "Return ride handled after the show",
];

function getVenue(slug: string): VenueRow | null {
  return (venuesJson as Record<string, VenueRow>)[slug] ?? null;
}

function buildDccCheckoutHref(product: string, quantity = 1) {
  const qty = Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;
  return `https://www.destinationcommandcenter.com/book?route=parr-private&product=${product}&qty=${qty}`;
}

export default async function PrivateOptionPage({
  params,
  searchParams,
}: {
  params: Promise<{ venue: string; option: keyof typeof optionMeta }>;
  searchParams: Promise<HandoffSearchParams>;
}) {
  const { venue, option } = await params;
  const sp = await searchParams;
  if (venue !== "red-rocks-amphitheatre") notFound();
  const row = getVenue(venue);
  const meta = optionMeta[option];
  if (!row?.name || !meta) notFound();
  const qtyValue = Array.isArray(sp.qty) ? sp.qty[0] : sp.qty;
  const vehicleQty = qtyValue ? Math.max(1, Number(qtyValue) || 1) : 1;

  await postDccSatelliteEvent({
    eventType: "handoff_viewed",
    searchParams: sp,
    sourcePath: `/book/${venue}/private/${option}`,
    stage: "private_option_detail",
    booking: { venueSlug: venue, productSlug: option },
  });

  await postWtaPartnerAcceptedIfNeeded({
    searchParams: sp,
    sourcePath: `/book/${venue}/private/${option}`,
  });

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1240px] flex-col gap-8">
        <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
            Final Step
          </div>
          <h1 className="mt-5 text-[2.3rem] font-black uppercase leading-[0.96] tracking-[-0.04em] sm:text-[3.5rem]">
            {meta.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/74 sm:text-lg">
            {meta.body}
          </p>
          <div className="mt-4 text-sm font-bold text-[#ffb07c]">{meta.price}</div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/68 sm:text-[15px]">
            Pickup details are sent before your ride. Your group rides together for the full night.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {privateBenefits.map((item) => (
              <div key={item} className="rounded-[20px] border border-white/10 bg-[#0b1224] px-4 py-3 text-sm font-bold text-white/88">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={buildDccCheckoutHref(meta.dccProduct, vehicleQty)}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#3df3ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff]"
            >
              {meta.ctaLabel}
            </a>
            <Link
              href={buildBookingHref({ target: "private", venue, searchParams: sp })}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
            >
              Back to Private Options
            </Link>
            <Link
              href="/guide/tailgating"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
            >
              Tailgating Guide
            </Link>
          </div>
          <PlanningLinks
            venue={venue}
            source={Array.isArray(sp.source) ? sp.source[0] : sp.source}
            className="mt-6"
          />
        </section>

        <DccReturnBanner searchParams={sp} />

        <PrivatePromoBanner />

        <section className="overflow-visible rounded-[30px] border border-white/10 bg-[#0b1224] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-6">
          <div className="mb-4 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
            Custom checkout
          </div>
          <p className="max-w-3xl text-sm leading-6 text-white/74">
            This option now uses the custom DCC checkout flow instead of the hosted Rezdy widget. Pick your show date, enter your pickup address, and pay online without the external human-verification wall.
          </p>
          <TrustStrip className="mb-4 mt-5" />
          <a
            href={buildDccCheckoutHref(meta.dccProduct, vehicleQty)}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#3df3ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff]"
          >
            Continue to custom checkout
          </a>
        </section>
      </section>
    </main>
  );
}
