import { NextResponse } from "next/server";
import { rezdyListProducts } from "@/lib/rezdy";

export const runtime = "nodejs";

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

function toLowerString(value: unknown): string {
  return typeof value === "string" ? value.toLowerCase() : "";
}

function parseAllowedCodes(raw: string | undefined): Set<string> {
  if (!raw) return new Set<string>();
  return new Set(
    raw
      .split(",")
      .map((v) => v.trim().toUpperCase())
      .filter(Boolean)
  );
}

function isRedRocksProduct(product: Record<string, unknown>, allowedCodes: Set<string>): boolean {
  const code = typeof product.productCode === "string" ? product.productCode.toUpperCase() : "";
  if (code && allowedCodes.has(code)) return true;

  const name = toLowerString(product.name);
  const description = toLowerString(product.description);
  const additionalInfo = toLowerString(product.additionalInformation);
  const seo = Array.isArray(product.productSeoTags) ? JSON.stringify(product.productSeoTags).toLowerCase() : "";

  return (
    name.includes("red rocks") ||
    description.includes("red rocks") ||
    additionalInfo.includes("red rocks") ||
    seo.includes("red-rocks") ||
    seo.includes("partyatredrocks")
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const catalogId = searchParams.get("catalogId") || process.env.REZDY_REDROCKS_CATALOG_ID || "";
  const allowedCodes = parseAllowedCodes(process.env.REZDY_REDROCKS_PRODUCT_CODES);

  try {
    const query = buildQuery(searchParams);
    if (catalogId) query.set("catalogId", catalogId);

    const products = await rezdyListProducts(query);
    const narrowed =
      catalogId && catalogId === "541037"
        ? products.filter((product) => isRedRocksProduct(product as Record<string, unknown>, allowedCodes))
        : products;
    const productRows = narrowed.length > 0 ? narrowed : products;

    const uiProducts: UiProduct[] = products
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

    const finalProducts =
      productRows === products
        ? uiProducts
        : uiProducts.filter((row) => productRows.some((product) => product.productCode === row.productCode));

    return NextResponse.json({
      products: finalProducts,
      catalogIdApplied: catalogId || null,
      catalogFilterFallback: catalogId === "541037" ? narrowed.length === 0 : false,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch Rezdy products";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
