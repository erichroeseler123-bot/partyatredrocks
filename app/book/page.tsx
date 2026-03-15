import Link from "next/link";
import { redirect } from "next/navigation";
import ServedVenueSections from "@/components/venues/ServedVenueSections";

export const metadata = {
  robots: { index: false, follow: true },
  title: "Book Shuttle | Pick Your Venue",
  description: "Start by picking your venue, then choose shared or private ride options.",
};

type SP = Record<string, string | string[] | undefined>;
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

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1440px] flex-col gap-8">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,91,46,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(143,208,255,0.14),transparent_28%)]" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
              Book a ride
            </div>
            <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem] lg:text-[5rem]">
              Pick Your Venue
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/74 sm:text-lg">
              Start with the venue you are headed to, then choose shared or private ride options.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/venues"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff5b2e] px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#ff7148]"
              >
                Explore Venues
              </Link>
              <Link
                href="/find"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                Ride Finder
              </Link>
            </div>
          </div>
        </section>

        <ServedVenueSections mode="book" querySuffix={qs} />
      </section>
    </main>
  );
}
