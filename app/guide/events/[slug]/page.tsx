import { notFound } from "next/navigation";
import Link from "next/link";
import { shows2026 } from "@/public/data/shows-2026";

type Show = {
  slug: string;
  artist: string;
  date: string;
  venue: string;
  description?: string;
};

type Props = {
  params: {
    slug: string;
  };
};

/* ================================
   PREBUILD ALL SHOW PAGES
================================ */

export function generateStaticParams() {
  return shows2026.map((show: Show) => ({
    slug: show.slug,
  }));
}

/* ================================
   PAGE
================================ */

export default function EventPage({ params }: Props) {
  const show = (shows2026 as Show[]).find(
    (s) => s.slug === params.slug
  );

  if (!show) {
    notFound();
  }

  const date = new Date(show.date);

  return (
    <main className="max-w-4xl mx-auto px-6 py-24 text-white">

      {/* HEADER */}

      <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tight mb-4">
        {show.artist}
      </h1>

      <p className="text-red-600 font-bold uppercase tracking-widest text-sm mb-6">
        {date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>

      <p className="text-zinc-400 text-lg mb-10">
        {show.venue}
      </p>

      {/* CONTENT */}

      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 mb-12">

        <h2 className="text-xl font-black uppercase mb-4 tracking-tight">
          Show Intelligence
        </h2>

        <p className="text-zinc-300 leading-relaxed">
          {show.description ||
            "This event is expected to draw strong demand. Book transportation early to avoid delays, parking issues, and surge pricing."}
        </p>

      </div>

      {/* CTA */}

      <div className="flex flex-col sm:flex-row gap-4">

        <Link
          href="/"
          className="px-6 py-3 bg-red-600 hover:bg-red-700 font-black uppercase text-sm tracking-widest rounded-full text-center"
        >
          Book Shuttle
        </Link>

        <Link
          href="/guide/events/2026-season-preview"
          className="px-6 py-3 border border-zinc-700 hover:border-zinc-500 font-black uppercase text-sm tracking-widest rounded-full text-center"
        >
          View Full Season
        </Link>

      </div>

    </main>
  );
}
