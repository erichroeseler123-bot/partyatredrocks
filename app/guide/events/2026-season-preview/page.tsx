"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";

type Show = {
  slug: string;
  artist: string;
  date: string;
  img?: string;
  venue: string;
};

declare global {
  interface Window {
    RED_ROCKS_2026?: Show[];
  }
}

export default function SeasonPreview() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Read data after script loads
  const loadShows = () => {
    if (window.RED_ROCKS_2026 && window.RED_ROCKS_2026.length) {
      setShows(window.RED_ROCKS_2026);
      setLoaded(true);
    }
  };

  useEffect(() => {
    loadShows();
  }, []);

  return (
    <>
      {/* Load generated data from /public */}
<Script
  src="/data/shows-2026.js"
  strategy="beforeInteractive"
/>

      <div className="max-w-4xl mx-auto px-6 py-20 bg-black text-white">

        {/* ================= HEADER ================= */}

        <h1 className="text-5xl font-black mb-8 uppercase italic tracking-tighter leading-tight">
          2026 <span className="text-red-600">Season</span> Lineup Intelligence
        </h1>

        <p className="text-zinc-400 text-xl mb-12 leading-relaxed font-medium">
          The 2026 Red Rocks season is heating up. From bass openers in March
          to sold-out finales in October, here is the definitive transport
          breakdown for the year’s biggest shows.
        </p>

        {/* ================= SHOW LIST ================= */}

        <div className="grid gap-6 mb-16">

          {!loaded && (
            <p className="text-zinc-500 text-center">
              Loading season data…
            </p>
          )}

          {loaded && shows.length === 0 && (
            <p className="text-zinc-500 text-center">
              No shows found.
            </p>
          )}

          {shows.map((show) => {
            const date = new Date(show.date);

            return (
              <Link
                key={show.slug}
                href={`/guide/events/${show.slug}`}
                className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] hover:border-red-600 transition-all group shadow-xl"
              >
                {/* Date */}
                <span className="text-red-600 font-bold uppercase text-xs tracking-widest font-mono">
                  {date.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>

                {/* Artist */}
                <h3 className="text-2xl font-black mt-2 uppercase italic tracking-tight text-white group-hover:text-red-500 transition-colors">
                  {show.artist}
                </h3>

                {/* Venue */}
                <p className="text-zinc-500 text-sm mt-3 leading-relaxed">
                  {show.venue}
                </p>
              </Link>
            );
          })}

        </div>

        {/* ================= GUIDES ================= */}

        <div className="grid md:grid-cols-2 gap-8 mb-16">

          <Link
            href="/guide/logistics/winter-survival"
            className="p-8 bg-zinc-950 border border-zinc-800 rounded-[2.5rem] hover:border-blue-500 transition-all"
          >
            <h4 className="text-blue-400 font-black uppercase tracking-tighter mb-2 italic">
              Winter Survival
            </h4>

            <p className="text-zinc-500 text-sm text-left font-medium">
              How to prep for freezing March and April shows without
              getting stranded.
            </p>
          </Link>

          <Link
            href="/guide/logistics/shuttle-vs-westracks-2026"
            className="p-8 bg-zinc-950 border border-zinc-800 rounded-[2.5rem] hover:border-yellow-600 transition-all"
          >
            <h4 className="text-yellow-600 font-black uppercase tracking-tighter mb-2 italic">
              vs. Public Shuttle
            </h4>

            <p className="text-zinc-500 text-sm text-left font-medium">
              Why we are the only reliable night service in 2026.
              No surge. No waits.
            </p>
          </Link>

        </div>

        {/* ================= FOOTER ================= */}

        <div className="pt-10 border-t border-zinc-900 text-center">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">
            © 2026 Party at Red Rocks | All Rights Reserved
          </p>
        </div>

      </div>
    </>
  );
}
