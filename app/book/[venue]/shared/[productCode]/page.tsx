import Link from "next/link";
import { notFound } from "next/navigation";
import venuesJson from "@/data/venues.json";
import { getBookingUrl, rezdyListProducts } from "@/lib/rezdy";
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
const SHARED_WIDGET_URL = "https://gosnotransportation58.rezdy.com/catalog/617787?iframe=true";

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

export default async function SharedProductPage({
  params,
}: {
  params: Promise<{ venue: string; productCode: string }>;
}) {
  const { venue, productCode } = await params;
  if (venue !== "red-rocks-amphitheatre") notFound();
  const row = getVenue(venue);
  if (!row?.name) notFound();

  const query = new URLSearchParams();
  query.set("catalogId", SHARED_CATALOG_ID);
  const products = (await rezdyListProducts(query).catch(() => [])) as RezdyProductRow[];
  const product = products.find((item) => item.productCode === productCode);
  if (!product) notFound();

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1240px] flex-col gap-8">
        <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Final Step
          </div>
          <h1 className="mt-5 text-[2.3rem] font-black uppercase leading-[0.96] tracking-[-0.04em] sm:text-[3.5rem]">
            {product.name || product.productCode}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/74 sm:text-lg">
            {product.description || "Hosted shuttle checkout for this Red Rocks shared product."}
          </p>
          <div className="mt-4 text-sm font-bold text-[#ffb07c]">{priceLabel(product)}</div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={getBookingUrl("shuttle")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff5b2e] px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#ff7148]"
            >
              Book Online Now
            </a>
            <Link
              href={`/book/${venue}/shared`}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
            >
              Back to Shuttle Options
            </Link>
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-6">
          <div className="mb-4 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Hosted Checkout Widget
          </div>
          <TrustStrip className="mb-4" />
          <p className="mb-4 text-sm leading-6 text-white/70">
            If the widget doesn&apos;t preselect this exact product, choose <span className="font-bold text-white">{product.name || product.productCode}</span> inside the checkout.
          </p>
          <iframe
            src={SHARED_WIDGET_URL}
            width="100%"
            height="960"
            frameBorder="0"
            className="w-full rounded-[20px] bg-white"
            title={`${product.name || product.productCode} checkout`}
          />
        </section>
      </section>
    </main>
  );
}
