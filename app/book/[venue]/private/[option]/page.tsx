import Link from "next/link";
import { notFound } from "next/navigation";
import venuesJson from "@/data/venues.json";
import { RecentBookingToast } from "@/components/RecentBookingToast";
import { PlanningLinks } from "@/components/booking/PlanningLinks";
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
    iframeUrl: "https://gosnotransportation58.rezdy.com/596193/suburban?iframe=true",
    ctaLabel: "Open SUV Booking",
  },
  van: {
    title: "10 Passenger Van",
    body: "Best for groups that want limo-lane access, time to tailgate, and one van for the full night.",
    price: "$599",
    iframeUrl: "https://gosnotransportation58.rezdy.com/630812/van-10-passenger?iframe=true",
    ctaLabel: "Open Van Booking",
  },
  sprinter: {
    title: "14 Passenger Sprinter",
    body: "Best for larger groups that want more room, limo-lane access, and one vehicle for the full night.",
    price: "$799",
    iframeUrl: "https://gosnotransportation58.rezdy.com/745684/sprinter-van-14-passenger?iframe=true",
    ctaLabel: "Open Sprinter Booking",
  },
  "party-bus": {
    title: "24 Passenger Party Bus",
    body: "Best for bigger groups that want to tailgate, stay together, and make the ride part of the night.",
    price: "$1199",
    iframeUrl: "https://gosnotransportation58.rezdy.com/689909/bus-24-passenger?iframe=true",
    ctaLabel: "Open Party Bus Booking",
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

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <RecentBookingToast />
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
              href={meta.iframeUrl.replace("?iframe=true", "")}
              target="_blank"
              rel="noopener noreferrer"
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
          <PlanningLinks venue={venue} className="mt-6" />
        </section>

        <section className="overflow-visible rounded-[30px] border border-white/10 bg-[#0b1224] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-6">
          <div className="mb-4 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
            Book Online
          </div>
          <TrustStrip className="mb-4" />
          <iframe
            src={meta.iframeUrl}
            width="100%"
            height="1560"
            frameBorder="0"
            className="w-full overflow-visible rounded-[20px] border-0 bg-white"
            style={{ minHeight: "1560px" }}
            title={`${meta.title} booking widget`}
          />
        </section>
      </section>
    </main>
  );
}
