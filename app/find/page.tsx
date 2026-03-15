import { redirect } from "next/navigation";
import {
  buildBookingHref,
  normalizeVenueSlug,
  type HandoffSearchParams,
} from "@/lib/parrHandoff";

export const metadata = {
  title: "Find Your Ride | Party at Red Rocks",
  description: "Redirecting to the current booking flow for Red Rocks ride options.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function FindPage({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;
  const rawVenue = Array.isArray(sp.venue) ? sp.venue[0] : sp.venue;
  const venue = normalizeVenueSlug(rawVenue) || "red-rocks-amphitheatre";

  redirect(buildBookingHref({ target: "book", venue, searchParams: sp }));
}
