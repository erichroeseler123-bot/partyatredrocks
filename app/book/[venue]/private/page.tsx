import Link from "next/link";
import { notFound } from "next/navigation";
import venuesJson from "@/data/venues.json";
import { RecentBookingToast } from "@/components/RecentBookingToast";
import { TrustStrip } from "@/components/TrustStrip";

type VenueRow = {
  slug?: string;
  name?: string;
};

const privateOptions = [
  {
    slug: "suv",
    title: "Private SUV",
    eyebrow: "Up to 6 Guests",
    body: "Door-to-door private ride for smaller groups.",
  },
  {
    slug: "van",
    title: "Private Van",
    eyebrow: "10 to 14 Guests",
    body: "One vehicle, one pickup plan, one return timeline for the full crew.",
  },
  {
    slug: "party-bus",
    title: "Party Bus",
    eyebrow: "Large Group",
    body: "Best for celebration nights where the ride is part of the event.",
  },
] as const;

function getVenue(slug: string): VenueRow | null {
  return (venuesJson as Record<string, VenueRow>)[slug] ?? null;
}

export default async function PrivateOptionsPage({
  params,
}: {
  params: Promise<{ venue: string }>;
}) {
  const { venue } = await params;
  if (venue !== "red-rocks-amphitheatre") notFound();
  const row = getVenue(venue);
  if (!row?.name) notFound();

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <RecentBookingToast />
      <section className="mx-auto flex max-w-[1240px] flex-col gap-8">
        <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
            Step 3
          </div>
          <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem]">
            Private Ride Options
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/74 sm:text-lg">
            Pick the private vehicle that fits your group, then move to the booking page.
          </p>
          <div className="mt-6">
            <Link href={`/book/${venue}`} className="text-sm font-bold text-[#ffb07c] hover:text-white">
              ← Back to ride types
            </Link>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {privateOptions.map((option) => (
            <Link
              key={option.slug}
              href={`/book/${venue}/private/${option.slug}`}
              className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
            >
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
                {option.eyebrow}
              </div>
              <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">
                {option.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/70">{option.body}</p>
              <div className="mt-5 text-sm font-bold text-[#ffb07c]">Open option →</div>
            </Link>
          ))}
        </section>

        <TrustStrip />
      </section>
    </main>
  );
}
