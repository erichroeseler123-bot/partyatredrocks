import Link from "next/link";
import { notFound } from "next/navigation";
import venuesJson from "@/data/venues.json";

type VenueRow = {
  slug?: string;
  name?: string;
};

const PRIVATE_CATALOG_WIDGET_URL = "https://gosnotransportation58.rezdy.com/catalog/541037?iframe=true";

const optionMeta = {
  suv: {
    title: "Private SUV",
    body: "Use the dedicated private SUV booking flow for the fastest checkout.",
    iframeUrl: "https://gosnotransportation58.rezdy.com/596193/suburban?iframe=true",
    ctaLabel: "Open SUV Booking",
  },
  van: {
    title: "Private Van",
    body: "Hosted private vehicle checkout. Choose the van-sized option inside the widget.",
    iframeUrl: PRIVATE_CATALOG_WIDGET_URL,
    ctaLabel: "Open Private Vehicle Checkout",
  },
  "party-bus": {
    title: "Party Bus",
    body: "Hosted private vehicle checkout. Choose the party bus option inside the widget.",
    iframeUrl: PRIVATE_CATALOG_WIDGET_URL,
    ctaLabel: "Open Private Vehicle Checkout",
  },
} as const;

function getVenue(slug: string): VenueRow | null {
  return (venuesJson as Record<string, VenueRow>)[slug] ?? null;
}

export default async function PrivateOptionPage({
  params,
}: {
  params: Promise<{ venue: string; option: keyof typeof optionMeta }>;
}) {
  const { venue, option } = await params;
  if (venue !== "red-rocks-amphitheatre") notFound();
  const row = getVenue(venue);
  const meta = optionMeta[option];
  if (!row?.name || !meta) notFound();

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
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={meta.iframeUrl.replace("?iframe=true", "")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff5b2e] px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#ff7148]"
            >
              {meta.ctaLabel}
            </a>
            <Link
              href={`/book/${venue}/private`}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
            >
              Back to Private Options
            </Link>
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-6">
          <div className="mb-4 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
            Hosted Booking Widget
          </div>
          <iframe
            src={meta.iframeUrl}
            width="100%"
            height="960"
            frameBorder="0"
            className="w-full rounded-[20px] bg-white"
            title={`${meta.title} booking widget`}
          />
        </section>
      </section>
    </main>
  );
}
