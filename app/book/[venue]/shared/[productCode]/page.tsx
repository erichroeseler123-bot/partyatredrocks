import { redirect } from "next/navigation";
import type { HandoffSearchParams } from "@/lib/parrHandoff";

export const runtime = "nodejs";
export const revalidate = 300;

function firstValue(searchParams: HandoffSearchParams, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

function rezdyPickupFromRoute(productCode: string, searchParams: HandoffSearchParams) {
  const pickupHint = [
    productCode,
    firstValue(searchParams, "pickupHub"),
    firstValue(searchParams, "pickup"),
    firstValue(searchParams, "city"),
    firstValue(searchParams, "requests"),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return pickupHint.includes("golden") || pickupHint.includes("westside") ? "golden" : "denver";
}

export default async function SharedProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ venue: string; productCode: string }>;
  searchParams: Promise<HandoffSearchParams>;
}) {
  const { venue, productCode } = await params;
  const sp = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(sp)) {
    if (Array.isArray(value)) {
      for (const entry of value) query.append(key, entry);
      continue;
    }
    if (typeof value === "string") query.set(key, value);
  }

  const search = query.toString();
  const pickup = rezdyPickupFromRoute(productCode, sp);
  redirect(search ? `/book/${venue}/custom/shared/${pickup}?${search}` : `/book/${venue}/custom/shared/${pickup}`);
}
