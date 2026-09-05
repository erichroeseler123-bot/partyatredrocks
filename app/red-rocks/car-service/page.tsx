import type { Metadata } from "next";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { PrivateOnlyAuthorityPage } from "@/components/redrocks/PrivateOnlyAuthorityPage";

export const metadata: Metadata = {
  title: "Red Rocks Car Service from Denver | Private SUV $399",
  description: "Book private car service to Red Rocks and back in a Suburban for up to six people. Door-to-door pickup, tailgating time, and a planned return ride for $399.",
  alternates: { canonical: "/red-rocks/car-service" },
};

export default async function Page({ searchParams }: { searchParams: Promise<HandoffSearchParams> }) {
  const sp = await searchParams;
  return (
    <PrivateOnlyAuthorityPage
      eyebrow="Red Rocks private car service"
      title="Private Car Service to Red Rocks and Back"
      intro="The $399 private Suburban is built for groups of up to six who want door-to-door pickup, one vehicle through the show, and a return plan arranged before concert night."
      searchParams={sp}
      points={[
        { title: "Up to 6 people", body: "Keep your group together in one private Suburban rather than coordinating separate rides." },
        { title: "Door-to-door pickup", body: "Pickup is coordinated for your hotel, Airbnb, home, or agreed address before the show." },
        { title: "Round-trip plan", body: "The same vehicle waits through the show so the ride back is part of the booking." },
      ]}
    />
  );
}
