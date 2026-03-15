import { permanentRedirect } from "next/navigation";
import { buildBookingHref } from "@/lib/parrHandoff";

function extractDate(parts: string[]): string | null {
  const s = parts.join("-");
  const m = s.match(/(20\d{2})-(\d{2})-(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

export default async function LegacyEventDetailsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const parts = slug ?? [];
  const date = extractDate(parts);

  if (date) {
    permanentRedirect(
      buildBookingHref({
        target: "book",
        venue: "red-rocks-amphitheatre",
        overrides: { date, qty: "2" },
      }),
    );
  }
  permanentRedirect(buildBookingHref({ target: "book", venue: "red-rocks-amphitheatre" }));
}
