import Link from "next/link";
import { notFound } from "next/navigation";
import venuesJson from "@/data/venues.json";
import { RecentBookingToast } from "@/components/RecentBookingToast";
import { rezdyListProducts } from "@/lib/rezdy";
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
}: {
  params: Promise<{ venue: string }>;
}) {
  const { venue } = await params;
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
            Pick the shuttle product that fits your night, then land on the final booking page with the hosted checkout widget.
          </p>
          <div className="mt-6">
            <Link href={`/book/${venue}`} className="text-sm font-bold text-[#ffb07c] hover:text-white">
              ← Back to ride types
            </Link>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {products.map((product) => (
            <Link
              key={product.productCode}
              href={`/book/${venue}/shared/${encodeURIComponent(product.productCode || "")}`}
              className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
            >
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
                {priceLabel(product)}
              </div>
              <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">
                {product.name || product.productCode}
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/70">
                {product.description || "Open the final booking page and complete checkout in the hosted shuttle widget."}
              </p>
              <div className="mt-5 text-sm font-bold text-[#ffb07c]">Open product page →</div>
            </Link>
          ))}

          {products.length === 0 ? (
            <div className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 text-white/72 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
              No shared shuttle products are loading right now. Use the live shuttle checkout below instead.
              <div className="mt-5">
                <Link
                  href="/find"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#ff5b2e] px-5 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#ff7148]"
                >
                  Open Shuttle Checkout
                </Link>
              </div>
            </div>
          ) : null}
        </section>

        <TrustStrip />
      </section>
    </main>
  );
}
