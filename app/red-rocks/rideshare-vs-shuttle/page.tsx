import type { Metadata } from "next";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { PrivateOnlyAuthorityPage } from "@/components/redrocks/PrivateOnlyAuthorityPage";

export const metadata: Metadata = {
  title: "Rideshare vs Shuttle at Red Rocks | Current Private Option",
  description: "Compare rideshare with Party at Red Rocks' current private-only transportation service. Shared shuttle seats are not currently offered.",
  alternates: { canonical: "/red-rocks/rideshare-vs-shuttle" },
};

export default async function Page({ searchParams }: { searchParams: Promise<HandoffSearchParams> }) {
  const sp = await searchParams;
  return (
    <PrivateOnlyAuthorityPage
      eyebrow="Transportation comparison"
      title="Rideshare vs Shuttle at Red Rocks"
      intro="Party at Red Rocks no longer offers shared shuttle seats, so the practical comparison today is rideshare versus pre-booked private transportation. The private option is a $399 Suburban or $599 van."
      searchParams={sp}
      points={[
        { title: "Rideshare", body: "Flexible and on-demand, with availability and pricing that can change with demand." },
        { title: "Private transportation", body: "A fixed private vehicle and one plan for your group, including the return ride after the show." },
        { title: "Shared shuttle", body: "Not currently offered by Party at Red Rocks; this URL remains to answer the search question accurately." },
      ]}
    />
  );
}
