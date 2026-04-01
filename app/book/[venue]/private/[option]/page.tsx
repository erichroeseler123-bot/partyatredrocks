import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildBookingHref, type HandoffSearchParams } from "@/lib/parrHandoff";
import {
  buildDccPrivateCheckoutHref,
  getPrivateRideOption,
  type PrivateRideSlug,
} from "@/lib/rideCatalog";
import { buildPrivateOptionJsonLd, buildPrivateOptionMetadata } from "../../bookingSeo";

function firstValue(searchParams: HandoffSearchParams, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ venue: string; option: PrivateRideSlug }>;
}): Promise<Metadata> {
  const { venue, option } = await params;
  if (venue !== "red-rocks-amphitheatre") return {};

  const rideOption = getPrivateRideOption(option);
  if (!rideOption) return {};

  return buildPrivateOptionMetadata({
    venue,
    optionSlug: rideOption.slug,
    optionTitle: rideOption.title,
    optionBody: rideOption.body,
    optionPriceLabel: rideOption.priceLabel,
  });
}

export default async function PrivateOptionPage({
  params,
  searchParams,
}: {
  params: Promise<{ venue: string; option: PrivateRideSlug }>;
  searchParams: Promise<HandoffSearchParams>;
}) {
  const { venue, option } = await params;
  const sp = await searchParams;

  if (venue !== "red-rocks-amphitheatre") notFound();

  const rideOption = getPrivateRideOption(option);
  if (!rideOption) notFound();

  const qtyValue = firstValue(sp, "qty");
  const vehicleQty = qtyValue ? Math.max(1, Number(qtyValue) || 1) : 1;
  const checkoutHref = buildDccPrivateCheckoutHref(rideOption.slug, vehicleQty);
  const jsonLd = buildPrivateOptionJsonLd({
    venue,
    optionSlug: rideOption.slug,
    optionTitle: rideOption.title,
    optionBody: rideOption.body,
    optionPriceLabel: rideOption.priceLabel,
    quantity: vehicleQty,
  });

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="mx-auto max-w-[1120px] rounded-[30px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.4)] sm:p-8">
        <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">Private checkout</div>
        <h1 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">
          {rideOption.title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/76 sm:text-base">
          Stay on Party at Red Rocks while you complete your private booking. If the embedded checkout does not load, use the fallback button below.
        </p>
        <div className="mt-3 text-sm text-white/72">
          {rideOption.priceLabel} starting price · Quantity {vehicleQty}
        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10 bg-white">
          <iframe title={`${rideOption.title} checkout`} src={checkoutHref} className="h-[980px] w-full border-0" />
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            href={checkoutHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#62f6ff] bg-[#62f6ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#05111a] shadow-[0_18px_40px_rgba(61,243,255,0.24)] transition hover:bg-[#8cf8ff]"
          >
            Open in new tab
          </a>
          <Link
            href={buildBookingHref({ target: "private", venue, searchParams: sp })}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/28 bg-[#152038] px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#1d2a46]"
          >
            Back to private options
          </Link>
        </div>
      </section>
    </main>
  );
}
