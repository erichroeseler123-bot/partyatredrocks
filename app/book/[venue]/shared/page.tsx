import { redirect } from "next/navigation";
import type { HandoffSearchParams } from "@/lib/parrHandoff";

export const runtime = "nodejs";
export const revalidate = 300;

export default async function SharedOptionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ venue: string }>;
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
  redirect(search ? `/book/${venue}/custom/shared?${search}` : `/book/${venue}/custom/shared`);
}
