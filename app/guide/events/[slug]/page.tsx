import Link from "next/link";

type Show = {
  slug: string;
  artist: string;
  date: string;
  venue: string;
  img?: string;
};

async function getShows(): Promise<Show[]> {
  const res = await fetch(
    "https://www.partyatredrocks.com/data/shows-2026.js",
    { cache: "no-store" }
  );

  const text = await res.text();

  // Extract JSON from: window.RED_ROCKS_2026 = [...]
  const json = text.replace("window.RED_ROCKS_2026 = ", "").replace(/;$/, "");

  return JSON.parse(json);
}

export default async function ShowPage({
  params,
}: {
  params: { slug: string };
}) {
  const shows = await getShows();

  const show = shows.find((s) => s.slug === params.slug);

  if (!show) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-white text-center">
        <h1 className="text-3xl font-black mb-6">Show Not Found</h1>

        <Link
          href="/guide/events/2026-season-preview"
          className="text-red-500 underline"
        >
          ← Back to 2026 Season
        </Link>
      </div>
    );
  }

  const date = new Date(show.date);

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 text-white">

      {/* Back */}
      <Link
        href="/guide/events/2026-season-preview"
        className="text-zinc-500 text-sm hover:text-red-500"
      >
        ← Back to Season
      </Link>

      {/* Date */}
      <p className="mt-6 text-red-500 font-mono uppercase tracking-widest text-xs">
        {date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>

      {/* Artist */}
      <h1 className="text-5xl font-black italic uppercase mt-4">
        {show.artist}
      </h1>

      {/* Venue */}
      <p className="mt-4 text-zinc-400">
        {show.venue}
      </p>

      {/* CTA */}
      <div className="mt-12">

        <a
          href="/book"
          className="inline-block px-8 py-4 bg-red-600 text-black font-black rounded-full hover:bg-red-500 transition"
        >
          Book Shuttle
        </a>

      </div>

    </div>
  );
}
