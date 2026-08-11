import type { Metadata } from "next";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { PrivateOnlyAuthorityPage } from "@/components/redrocks/PrivateOnlyAuthorityPage";

export const metadata: Metadata = {
  title: "Red Rocks Shuttle Options | Current Private Service",
  description: "Current Party at Red Rocks transportation options: private Suburban $399 or private van $599. Shared shuttle seats are not currently offered.",
  alternates: { canonical: "/red-rocks/shuttle" },
};

export default async function Page({ searchParams }: { searchParams: Promise<HandoffSearchParams> }) {
  const sp = await searchParams;
  return (
    <PrivateOnlyAuthorityPage
      eyebrow="Red Rocks shuttle search"
      title="Red Rocks Shuttle Options"
      intro="If you found this page while searching for Red Rocks shuttle options, the current Party at Red Rocks product is private transportation only. Shared seats are retired; choose a private Suburban for $399 or a private van for $599."
      searchParams={sp}
      points={[
        { title: "Suburban — $399", body: "Private transportation for smaller groups that want one vehicle and one pickup plan." },
        { title: "Van — $599", body: "Private transportation for larger groups that want to stay together for the full night." },
        { title: "No shared seats", body: "Party at Red Rocks does not currently sell per-person shared shuttle seats." },
      ]}
    />
  );
}
