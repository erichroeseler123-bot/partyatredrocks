import Link from "next/link";
import { redirect } from "next/navigation";
import venuesJson from "@/data/venues.json";

export const metadata = {
  robots: { index: false, follow: true },
  title: "Book Shuttle | Pick Your Venue",
  description: "Start by picking your venue, then choose shared or private ride options.",
};

type SP = Record<string, string | string[] | undefined>;
type VenueRow = {
  slug?: string;
  name?: string;
  city?: string;
  state?: string;
  kind?: string;
  featured?: boolean;
};

function first(sp: SP, key: string) {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

function buildQs(sp: SP) {
  const qs = new URLSearchParams();
  const pickup = first(sp, "pickup");
  const date = first(sp, "date");
  const qty = first(sp, "qty");

  if (pickup) qs.set("pickup", pickup);
  if (date) qs.set("date", date);
  if (qty) qs.set("qty", qty);

  const query = qs.toString();
  return query ? `?${query}` : "";
}

function featuredVenues() {
  return Object.values(venuesJson as Record<string, VenueRow>)
    .filter((venue) => venue.slug && venue.name && venue.featured)
    .sort((a, b) => {
      if (a.slug === "red-rocks-amphitheatre") return -1;
      if (b.slug === "red-rocks-amphitheatre") return 1;
      return (a.name || "").localeCompare(b.name || "");
    });
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const venue = first(sp, "venue");
  const qs = buildQs(sp);

  if (venue) {
    redirect(`/book/${venue}${qs}`);
  }

  const venues = featuredVenues().slice(0, 8);

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1440px] flex-col gap-8">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,91,46,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(143,208,255,0.14),transparent_28%)]" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
              Booking Funnel
            </div>
            <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem] lg:text-[5rem]">
              Pick Your Venue
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/74 sm:text-lg">
              Start with the venue. Then choose shared or private options, land on the right product page, and book from there.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/venues"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff5b2e] px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#ff7148]"
              >
                Browse All Venues
              </Link>
              <Link
                href="/find"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                Open Ride Finder
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,26,0.96),rgba(6,9,18,0.96))] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Step 1
          </div>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
            Where are you headed?
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {venues.map((venue) => (
              <Link
                key={venue.slug}
                href={`/book/${venue.slug}${qs}`}
                className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
              >
                <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
                  {(venue.kind || "venue").replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
                </div>
                <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">
                  {venue.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  {[venue.city, venue.state].filter(Boolean).join(", ")}
                </p>
                <div className="mt-5 text-sm font-bold text-[#ffb07c]">Choose venue →</div>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
