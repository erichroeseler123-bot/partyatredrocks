import { permanentRedirect } from "next/navigation";
import { appendSearchParams, type HandoffSearchParams } from "@/lib/parrHandoff";

export const metadata = {
  title: "Find Your Ride | Party at Red Rocks",
  description: "Redirecting to private Red Rocks vehicle options.",
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
  const cleaned: HandoffSearchParams = { ...sp };
  const rawVenue = Array.isArray(cleaned.venue) ? cleaned.venue[0] : cleaned.venue;
  if (
    rawVenue &&
    ["redrocks", "red-rocks", "red-rocks-amphitheater", "red-rocks-amphitheatre"].includes(
      rawVenue.trim().toLowerCase()
    )
  ) {
    delete cleaned.venue;
  }

  permanentRedirect(appendSearchParams("/book/red-rocks-amphitheatre/private", cleaned));
}
