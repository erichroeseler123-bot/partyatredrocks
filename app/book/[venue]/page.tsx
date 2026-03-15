import Link from "next/link";
import { notFound } from "next/navigation";
import venuesJson from "@/data/venues.json";
import { RecentBookingToast } from "@/components/RecentBookingToast";
import { TrustStrip } from "@/components/TrustStrip";

type VenueRow = {
  slug?: string;
  name?: string;
  city?: string;
  state?: string;
  kind?: string;
};

function getVenue(slug: string): VenueRow | null {
  return (venuesJson as Record<string, VenueRow>)[slug] ?? null;
}

export default async function VenueBookingPage({
  params,
}: {
  params: Promise<{ venue: string }>;
}) {
  const { venue } = await params;
  const row = getVenue(venue);
  if (!row?.slug || !row?.name) notFound();

  const isRedRocks = venue === "red-rocks-amphitheatre";

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <RecentBookingToast />
      <section className="mx-auto flex max-w-[1240px] flex-col gap-8">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,91,46,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(143,208,255,0.14),transparent_28%)]" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
              Step 2
            </div>
            <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem] lg:text-[5rem]">
              {row.name}
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/74 sm:text-lg">
              Choose the ride style that matches this venue, then move into the right booking page.
            </p>
            <div className="mt-6 text-sm font-bold text-white/68">
              {[row.city, row.state].filter(Boolean).join(", ")}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Link
            href={isRedRocks ? `/book/${venue}/shared` : "/find"}
            className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
          >
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
              Shared Shuttle
            </div>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">
              {isRedRocks ? "Per-Person Shuttle Seats" : "See Shared Ride Availability"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              {isRedRocks
                ? "Seat-based shuttle options with round-trip booking and a hosted online checkout."
                : "Open the ride finder for the current shared availability and venue-specific options."}
            </p>
            <div className="mt-5 text-sm font-bold text-[#ffb07c]">
              {isRedRocks ? "Choose shared shuttle →" : "Open ride finder →"}
            </div>
          </Link>

          <Link
            href={isRedRocks ? `/book/${venue}/private` : "/book-all-venue"}
            className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
          >
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
              Private Ride
            </div>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">
              {isRedRocks ? "SUV, Van, or Party Bus" : "Private Vehicle Service"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              {isRedRocks
                ? "Private vehicle options for couples, crews, and larger groups with hosted Rezdy booking pages."
                : "Private venue transport for Denver and Boulder nights where one vehicle for the whole group makes more sense."}
            </p>
            <div className="mt-5 text-sm font-bold text-[#ffb07c]">
              {isRedRocks ? "Choose private option →" : "Open private booking →"}
            </div>
          </Link>
        </section>

        <TrustStrip />
      </section>
    </main>
  );
}
