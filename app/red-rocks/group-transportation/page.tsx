import type { Metadata } from "next";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { PrivateOnlyAuthorityPage } from "@/components/redrocks/PrivateOnlyAuthorityPage";

export const metadata: Metadata = {
  title: "Red Rocks Group Transportation | Private SUV or Van",
  description: "Compare private Red Rocks transportation for groups: a $399 Suburban for up to six or a $599 private van for up to ten. No shared seats or party-bus substitution.",
  alternates: { canonical: "/red-rocks/group-transportation" },
};

export default async function Page({ searchParams }: { searchParams: Promise<HandoffSearchParams> }) {
  const sp = await searchParams;
  return (
    <PrivateOnlyAuthorityPage
      eyebrow="Red Rocks group transportation"
      title="Private Transportation for Red Rocks Groups"
      intro="Choose the vehicle that fits your group: a $399 private Suburban for up to six people or a $599 private van for up to ten. Party at Red Rocks does not currently offer a shared shuttle or traditional party bus."
      searchParams={sp}
      points={[
        { title: "Suburban — $399", body: "The main choice for private groups of up to six people." },
        { title: "Van — $599", body: "More room for groups of up to ten who want to stay together." },
        { title: "One return plan", body: "Your vehicle waits through the show, avoiding a second post-concert booking." },
      ]}
    />
  );
}
