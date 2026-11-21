import type { Metadata } from "next";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { PrivateOnlyAuthorityPage } from "@/components/redrocks/PrivateOnlyAuthorityPage";
import { PARR_COMPLETE_TOTAL_DISCLOSURE } from "@/lib/pricing";
import {
  SUBURBAN_ALL_IN_TOTAL_LABEL,
  SUBURBAN_ITEMIZED_LABEL,
  VAN_ALL_IN_TOTAL_LABEL,
  VAN_ITEMIZED_LABEL,
} from "@/lib/rideCatalog";

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
      intro={`Party at Red Rocks no longer offers shared shuttle seats, so the practical comparison today is rideshare versus pre-booked private transportation. The private option is ${SUBURBAN_ALL_IN_TOTAL_LABEL} Suburban total (${SUBURBAN_ITEMIZED_LABEL}) or ${VAN_ALL_IN_TOTAL_LABEL} van total (${VAN_ITEMIZED_LABEL}). ${PARR_COMPLETE_TOTAL_DISCLOSURE}`}
      searchParams={sp}
      points={[
        { title: "Rideshare", body: "Flexible and on-demand, with availability and pricing that can change with demand." },
        { title: "Private transportation", body: "A fixed private vehicle and one plan for your group, including the return ride after the show." },
        { title: "Shared shuttle", body: "Not currently offered by Party at Red Rocks; this URL remains to answer the search question accurately." },
      ]}
    />
  );
}
