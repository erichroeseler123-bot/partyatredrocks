import type { Metadata } from "next";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { SharedBookingPage } from "../../shared/SharedBookingPage";
import { buildSharedBookingMetadata } from "../../shared/sharedBookingSeo";

export const runtime = "nodejs";
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ venue: string }>;
}): Promise<Metadata> {
  const { venue } = await params;
  if (venue !== "red-rocks-amphitheatre") return {};
  return buildSharedBookingMetadata(`/book/${venue}/custom/shared`);
}

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
    stage: "shared_booking_custom",
  });
}
