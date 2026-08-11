import { notFound, redirect } from "next/navigation";
import venuesJson from "@/data/venues.json";
import type { HandoffSearchParams } from "@/lib/parrHandoff";

type VenueRow = {
  slug?: string;
  name?: string;
};

type SharedBookingPageInput = {
  venue: string;
  searchParams: HandoffSearchParams;
  sourcePath: string;
  basePath: string;
  stage: string;
};

function getVenue(slug: string): VenueRow | null {
  return (venuesJson as Record<string, VenueRow>)[slug] ?? null;
}

function appendSearchParams(path: string, searchParams: HandoffSearchParams) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item) params.append(key, item);
      });
    } else if (value) {
      params.set(key, value);
    }
  }
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

export async function SharedBookingPage({ venue, searchParams }: SharedBookingPageInput) {
  if (venue !== "red-rocks-amphitheatre") notFound();
  const row = getVenue(venue);
  if (!row?.name) notFound();

  redirect(appendSearchParams(`/book/${venue}/private`, searchParams));
}
