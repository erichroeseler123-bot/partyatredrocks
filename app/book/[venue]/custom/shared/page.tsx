import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { SharedBookingPage } from "../../shared/SharedBookingPage";

export const runtime = "nodejs";
export const revalidate = 300;

export default async function SharedCustomOptionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ venue: string }>;
  searchParams: Promise<HandoffSearchParams>;
}) {
  const { venue } = await params;
  const sp = await searchParams;

  return SharedBookingPage({
    venue,
    searchParams: sp,
    sourcePath: `/book/${venue}/custom/shared`,
    basePath: `/book/${venue}/custom/shared`,
    stage: "shared_catalog",
  });
}
