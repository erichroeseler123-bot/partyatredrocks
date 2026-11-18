import type { Metadata } from "next";
import Link from "next/link";
import { shows2026 } from "@/lib/shows-2026";
import { PARR_COMPLETE_TOTAL_DISCLOSURE } from "@/lib/pricing";
import {
  SUBURBAN_ALL_IN_TOTAL_LABEL,
  SUBURBAN_ITEMIZED_LABEL,
  VAN_ALL_IN_TOTAL_LABEL,
  VAN_ITEMIZED_LABEL,
} from "@/lib/rideCatalog";

const SITE = "https://www.partyatredrocks.com";

export const metadata: Metadata = {
  title: "2026 Red Rocks Season Lineup Archive | Event Guides",
  description:
    `Historical 2026 Red Rocks season preview and show-by-show guide archive. Planning a 2027 concert night? See the 2027 Red Rocks schedule and book private transportation (${SUBURBAN_ALL_IN_TOTAL_LABEL} Suburban total / ${VAN_ALL_IN_TOTAL_LABEL} Van total, including 4% Booking fee).`,
  alternates: { canonical: `${SITE}/guide/events/2026-season-preview` },
  openGraph: {
    title: "2026 Red Rocks Season Lineup Guide (Archive)",
    description:
      "Archived 2026 Red Rocks concert guide index, with direct links to 2027 concert dates and private group transportation.",
    url: `${SITE}/guide/events/2026-season-preview`,
    type: "article",
  },
};

export default function SeasonPreview() {
  const sorted = [...shows2026].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <main className="mx-auto max-w-4xl bg-surface px-6 py-24 text-white">
      <aside
        aria-label="2026 season archive notice"
        className="mb-8 rounded-2xl border border-[#ffb07c]/35 bg-[#ffb07c]/10 p-5 text-sm leading-6 text-white/90"
      >
        <span className="font-black uppercase tracking-[0.16em] text-[#ffb07c]">2026 Season Archive:</span>{" "}
        These show guides document the 2026 Red Rocks season. Existing 2026 bookings and quotes remain honored at their original prices. Looking for upcoming shows?{" "}
        <Link href="/red-rocks/concerts" className="font-bold text-[#ffb07c] underline">
          Explore the 2027 Red Rocks Concert Schedule
        </Link>{" "}
        or{" "}
        <Link href="/book/red-rocks-amphitheatre/private" className="font-bold text-[#ffb07c] underline">
          reserve a 2027 Private Suburban ({SUBURBAN_ALL_IN_TOTAL_LABEL} total: {SUBURBAN_ITEMIZED_LABEL}) or Private Van ({VAN_ALL_IN_TOTAL_LABEL} total: {VAN_ITEMIZED_LABEL})
        </Link>
        .
      </aside>

      <h1 className="mb-6 text-4xl font-black uppercase leading-tight tracking-tight sm:text-5xl">
        2026 <span className="text-[#ffb07c]">Season</span> Lineup Guide (Archive)
      </h1>

      <p className="mb-10 text-lg font-medium leading-relaxed text-muted">
        Historical Red Rocks artist and arrival guides from the 2026 concert season.
      </p>

      <h2 className="mb-6 text-xl font-black uppercase tracking-wider text-white/85">
        Archived 2026 Event Guides
      </h2>

      <div className="mb-16 grid gap-6">
        {sorted.map((show) => {
          const date = new Date(show.date);

          return (
            <Link
              key={show.slug}
              href={`/guide/events/${show.slug}`}
              className="group panel rounded-[2rem] p-7 shadow-xl transition-all hover:border-[#ffb07c]"
            >
              <span className="font-mono text-sm font-bold uppercase tracking-widest text-[#ffb07c]">
                {date.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>

              <h3 className="mt-2 text-2xl font-black uppercase tracking-tight transition-colors group-hover:text-[#ffb07c]">
                {show.artist}
              </h3>

              <p className="mt-2 text-base text-muted">{show.venue}</p>
            </Link>
          );
        })}
      </div>

      <div className="rounded-3xl border border-white/12 bg-surface-strong p-8 text-center">
        <h2 className="text-2xl font-black uppercase tracking-tight text-white">
          Planning a 2027 Red Rocks Night?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-muted">
          Book a Private Suburban ({SUBURBAN_ALL_IN_TOTAL_LABEL} total: {SUBURBAN_ITEMIZED_LABEL}, up to 6 guests) or Private Van ({VAN_ALL_IN_TOTAL_LABEL} total: {VAN_ITEMIZED_LABEL}, up to 10 guests) with Upper North Lot tailgating gear and a driver waiting through the show. {PARR_COMPLETE_TOTAL_DISCLOSURE}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link href="/red-rocks/concerts" className="btn-primary">
            2027 Concert Calendar
          </Link>
          <Link href="/book/red-rocks-amphitheatre/private" className="btn-ghost">
            Choose Private Vehicle
          </Link>
        </div>
      </div>
    </main>
  );
}
