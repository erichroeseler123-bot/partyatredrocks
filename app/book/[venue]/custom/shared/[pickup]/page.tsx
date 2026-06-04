import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { HandoffSearchParams } from "@/lib/parrHandoff";

type PageProps = {
  params: Promise<{ venue: string; pickup: string }>;
  searchParams: Promise<HandoffSearchParams>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { venue } = await params;
  if (venue !== "red-rocks-amphitheatre") return {};

  return {
    title: "Private Red Rocks Transportation | Party at Red Rocks",
    description: "Party at Red Rocks public booking is private-vehicle-only. Book a Private Suburban or upgrade to a private van.",
    alternates: { canonical: `https://www.partyatredrocks.com/book/${venue}/private/suv` },
    robots: { index: false, follow: false },
  };
}

export default async function SharedRezdyPickupPage({ params }: PageProps) {
  const { venue } = await params;
  redirect(`/book/${venue}/private/suv`);
}
