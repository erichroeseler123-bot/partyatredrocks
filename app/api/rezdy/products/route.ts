import { NextResponse } from "next/server";
import { rezdyListProducts } from "@/lib/rezdy";

export const runtime = "nodejs";
const DEFAULT_REZDY_CATALOG_ID = process.env.REZDY_REDROCKS_CATALOG_ID ?? "617787";

type UiProduct = {
  productCode: string;
  name: string;
  description: string | null;
  minPrice: number | null;
  maxPrice: number | null;
};

function buildQuery(searchParams: URLSearchParams): URLSearchParams {
  const out = new URLSearchParams();
  const keys = ["productCode", "q", "limit", "offset", "startTimeLocal", "endTimeLocal", "catalogId"];
  for (const key of keys) {
    const value = searchParams.get(key);
    if (value) out.set(key, value);
  }
  return out;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const catalogId = searchParams.get("catalogId") || DEFAULT_REZDY_CATALOG_ID;

  try {
    const query = buildQuery(searchParams);
    if (catalogId) query.set("catalogId", catalogId);

    const products = await rezdyListProducts(query);
    const finalProducts: UiProduct[] = products
      .map((product) => {
        const code = typeof product.productCode === "string" ? product.productCode : "";
        const name = typeof product.name === "string" ? product.name : "";
        const description = typeof product.description === "string" ? product.description : null;

        const priceOptions = Array.isArray(product.priceOptions) ? product.priceOptions : [];
        const prices = priceOptions
          .map((row) => (typeof (row as { price?: unknown }).price === "number" ? (row as { price: number }).price : null))
          .filter((n): n is number => n !== null);
        const minPrice = prices.length ? Math.min(...prices) : null;
        const maxPrice = prices.length ? Math.max(...prices) : null;

        return {
          productCode: code,
          name,
          description,
          minPrice,
          maxPrice,
        };
      })
      .filter((row) => row.productCode && row.name);

    return NextResponse.json({
      products: finalProducts,
      catalogIdApplied: catalogId || null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch Rezdy products";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
