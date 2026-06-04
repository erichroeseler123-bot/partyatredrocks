import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { HandoffSearchParams } from "@/lib/parrHandoff";

export const runtime = "nodejs";
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ venue: string }>;
}): Promise<Metadata> {
  const { venue } = await params;
  if (venue !== "red-rocks-amphitheatre") return {};
  return {
    title: "Private Red Rocks Transportation | Party at Red Rocks",
    robots: { index: false, follow: false },
    alternates: { canonical: "https://www.partyatredrocks.com/book/red-rocks-amphitheatre/private/suv" },
  };
}

export default async function SharedCustomOptionsPage({
  params,
}: {
  params: Promise<{ venue: string }>;
  searchParams: Promise<HandoffSearchParams>;
}) {
  const { venue } = await params;
  if (venue !== "red-rocks-amphitheatre") return null;
  redirect(`/book/${venue}/private/suv`);
}
