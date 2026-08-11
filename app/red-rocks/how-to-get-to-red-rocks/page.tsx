import type { Metadata } from "next";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { PrivateOnlyAuthorityPage } from "@/components/redrocks/PrivateOnlyAuthorityPage";

export const metadata: Metadata = {
  title: "How To Get To Red Rocks | Private Transportation Guide",
  description: "Plan a Red Rocks ride with Party at Red Rocks' current private-only service: $399 Suburban or $599 van, with the vehicle waiting through the show.",
  alternates: { canonical: "/red-rocks/how-to-get-to-red-rocks" },
};

export default async function Page({ searchParams }: { searchParams: Promise<HandoffSearchParams> }) {
  const sp = await searchParams;
  return (
    <PrivateOnlyAuthorityPage
      eyebrow="Getting to Red Rocks"
      title="How To Get To Red Rocks"
      intro="You can drive, use rideshare, or pre-book transportation. Party at Red Rocks currently offers private transportation only: a $399 Suburban or $599 van, with one pickup plan and the vehicle waiting through the show for the return ride."
      searchParams={sp}
      points={[
        { title: "Drive yourself", body: "Best if someone in your group wants to manage parking, the walk, and the post-show exit." },
        { title: "Use rideshare", body: "Flexible for one-way travel, but pickup availability and pricing vary with real-time demand." },
        { title: "Book private", body: "Best if your group wants one vehicle, one plan, and the return ride already arranged." },
      ]}
    />
  );
}
