import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import venuesJson from "@/data/venues.json";
import { RecentBookingToast } from "@/components/RecentBookingToast";
import { PlanningLinks } from "@/components/booking/PlanningLinks";
import { rezdyListProducts } from "@/lib/rezdy";
import { buildBookingHref, type HandoffSearchParams } from "@/lib/parrHandoff";
import { TrustStrip } from "@/components/TrustStrip";

export const runtime = "nodejs";
export const revalidate = 300;

type VenueRow = {
  slug?: string;
  name?: string;
};

type RezdyProductRow = {
  productCode?: string;
  name?: string;
  description?: string;
  priceOptions?: Array<{ price?: number }>;
};

const SHARED_CATALOG_ID = "617787";
const SHARED_CATALOG_WIDGET_URL = "https://gosnotransportation58.rezdy.com/catalog/617787/shuttles?iframe=true";

function getVenue(slug: string): VenueRow | null {
  return (venuesJson as Record<string, VenueRow>)[slug] ?? null;
}

function priceLabel(product: RezdyProductRow) {
  const prices = (product.priceOptions || [])
    .map((row) => (typeof row?.price === "number" ? row.price : null))
    .filter((value): value is number => value !== null);
  if (!prices.length) return "Pricing in checkout";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `$${min.toFixed(0)}` : `$${min.toFixed(0)}-$${max.toFixed(0)}`;
}

export default async function SharedOptionsPage({
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

  const query = new URLSearchParams();
  query.set("catalogId", SHARED_CATALOG_ID);
  const products = (await rezdyListProducts(query).catch(() => [])) as RezdyProductRow[];

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <RecentBookingToast />
      <section className="mx-auto flex max-w-[1240px] flex-col gap-8">
        <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Step 3
          </div>
          <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem]">
            Shared Shuttle Options
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/74 sm:text-lg">
            Choose your shuttle seat, then move to the booking page.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/68 sm:text-[15px]">
            Round-trip service for the full concert night. Pickup details are sent before show night.
          </p>
          <div className="mt-6">
            <Link
              href={buildBookingHref({ target: "venue", venue, searchParams: sp })}
              className="text-sm font-bold text-[#ffb07c] hover:text-white"
            >
              ← Back to ride types
            </Link>
          </div>
          <PlanningLinks
            venue={venue}
            source={Array.isArray(sp.source) ? sp.source[0] : sp.source}
            className="mt-6"
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {products.map((product, index) => (
            <Link
              key={product.productCode}
              href={buildBookingHref({
                target: "shared-product",
                venue,
                productCode: product.productCode || "",
                searchParams: sp,
              })}
              className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
            >
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
                {priceLabel(product)}
              </div>
              {index === 0 ? (
                <div className="mt-2 inline-flex items-center rounded-full border border-[#ffb07c]/25 bg-[#ffb07c]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#ffb07c]">
                  Most Popular
                </div>
              ) : null}
              <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">
                {product.name || product.productCode}
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/70">
                {product.description || "Open the final page to review details and book online."}
              </p>
              <div className="mt-5 text-sm font-bold text-[#ffb07c]">Open product page →</div>
            </Link>
          ))}

          {products.length === 0 ? (
            <div className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 text-white/72 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
              No shared shuttle products are loading right now. Use the live shuttle checkout below instead.
              <div className="mt-5">
                <Link
                  href={buildBookingHref({ target: "book", venue, searchParams: sp })}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#3df3ff] px-5 text-xs font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff]"
                >
                  Open Shuttle Checkout
                </Link>
              </div>
            </div>
          ) : null}
        </section>

        <section className="overflow-visible rounded-[30px] border border-white/10 bg-[#0b1224] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-6">
          <Script src="https://gosnotransportation58.rezdy.com/pluginJs" strategy="afterInteractive" />
          <div className="mb-4 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Per-Person Shuttle
          </div>
          <p className="mb-4 max-w-3xl text-sm leading-6 text-white/70">
            This is the live per-person Red Rocks shuttle catalog. Choose the Denver or Golden departure inside the widget if you
            want to book directly from this page.
          </p>
          <iframe
            seamless
            width="100%"
            height="1000"
            frameBorder="0"
            className="rezdy w-full rounded-[20px] border-0 bg-white"
            src={SHARED_CATALOG_WIDGET_URL}
            title="Red Rocks shared shuttle catalog"
          />
        </section>

        <TrustStrip />
      </section>
    </main>
  );
}
