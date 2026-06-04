import Link from "next/link";
import { redirect } from "next/navigation";
import ServedVenueSections from "@/components/venues/ServedVenueSections";
import {
  buildBookingHref,
  normalizeVenueSlug,
  type HandoffSearchParams,
} from "@/lib/parrHandoff";

export const metadata = {
  robots: { index: false, follow: true },
  title: "Book Private Red Rocks Transportation | Party at Red Rocks",
  description: "Start with Private Suburban transportation to Red Rocks or upgrade to a private van.",
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;
  const venue = normalizeVenueSlug(
    Array.isArray(sp.venue) ? sp.venue[0] : sp.venue,
  );

  if (venue) {
    redirect(buildBookingHref({ target: "venue", venue, searchParams: sp }));
  }
  redirect("/book/red-rocks-amphitheatre/private/suv");

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
              Start with the venue you are headed to, then choose private Red Rocks transportation.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/venues"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#3df3ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff]"
              >
                Explore Venues
              </Link>
              <Link
                href={buildBookingHref({ target: "shuttles", searchParams: sp })}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                Ride Options
              </Link>
            </div>
          </div>
        </section>

        <ServedVenueSections mode="book" searchParams={sp} />
      </section>
    </main>
  );
}
