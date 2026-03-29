import { redirect } from "next/navigation";
import { buildBookingHref, type HandoffSearchParams } from "@/lib/parrHandoff";
import type { PrivateRideSlug } from "@/lib/rideCatalog";

export default async function PrivateOptionPage({
  params,
  searchParams,
}: {
  params: Promise<{ venue: string; option: PrivateRideSlug }>;
  searchParams: Promise<HandoffSearchParams>;
}) {
  const { venue } = await params;
  const sp = await searchParams;

  redirect(buildBookingHref({ target: "private", venue, searchParams: sp }));
}
