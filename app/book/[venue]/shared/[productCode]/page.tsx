import { redirect } from "next/navigation";
import type { HandoffSearchParams } from "@/lib/parrHandoff";

export const runtime = "nodejs";
export const revalidate = 300;

export default async function SharedProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ venue: string; productCode: string }>;
  searchParams: Promise<HandoffSearchParams>;
}) {
  const { venue } = await params;
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
  redirect(search ? `/book/${venue}/private/suv?${search}` : `/book/${venue}/private/suv`);
}
