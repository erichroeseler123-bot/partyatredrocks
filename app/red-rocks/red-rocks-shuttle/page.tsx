import type { Metadata } from "next";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { PrivateOnlyAuthorityPage } from "@/components/redrocks/PrivateOnlyAuthorityPage";

export const metadata: Metadata = {
  title: "Red Rocks Shuttle Guide | Private Transportation",
  description: "Red Rocks shuttle search guide updated for Party at Red Rocks' current private-only transportation service: $399 Suburban or $599 van.",
  alternates: { canonical: "/red-rocks/red-rocks-shuttle" },
};

export default async function Page({ searchParams }: { searchParams: Promise<HandoffSearchParams> }) {
  const sp = await searchParams;
  return (
    <PrivateOnlyAuthorityPage
      eyebrow="Red Rocks transportation"
      title="Red Rocks Shuttle Guide"
      intro="Looking for a shuttle to Red Rocks? Party at Red Rocks no longer sells shared shuttle seats. The current service is private transportation for your group, with a private Suburban for $399 or a private van for $599."
      searchParams={sp}
      points={[
        { title: "Private, not shared", body: "Your group has the vehicle to itself; there are no per-seat shared shuttle bookings." },
        { title: "One plan for the night", body: "Pickup and return are handled as one transportation plan instead of arranging a separate ride after the show." },
        { title: "Vehicle waits", body: "The vehicle waits through the show so your return ride is already part of the booking." },
      ]}
    />
  );
}
