import Link from "next/link";

import { shows2026 } from "@/lib/shows-2026";

type Show = (typeof shows2026)[number];

export default function SeasonPreview() {

  const sorted = [...shows2026].sort(
    (a, b) =>
      new Date(a.date).getTime() -
      new Date(b.date).getTime()
  );

  return (
    <main className="max-w-4xl mx-auto px-6 py-24 bg-surface text-white">

      {/* ================= HEADER ================= */}

      <h1 className="text-5xl font-black mb-8 uppercase italic tracking-tighter leading-tight">
        2026 <span className="text-red-600">Season</span> Lineup Intelligence
      </h1>

      <p className="text-zinc-400 text-xl mb-12 leading-relaxed font-medium">
        The definitive Red Rocks transportation guide for 2026.
      </p>

      {/* ================= SHOW LIST ================= */}

      <div className="grid gap-6 mb-16">

        {sorted.map((show) => {

          const date = new Date(show.date);

          return (
            <Link
              key={show.slug}
              href={`/guide/events/${show.slug}`}
              className="p-8 bg-surface-strong/50 border border-white/10 rounded-[2.5rem] hover:border-red-600 transition-all group shadow-xl"
            >

              <span className="text-red-600 font-bold uppercase text-base tracking-widest font-mono">
                {date.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>

              <h3 className="text-2xl font-black mt-2 uppercase italic tracking-tight group-hover:text-red-500 transition-colors">
                {show.artist}
              </h3>

              <p className="text-zinc-500 text-base mt-3">
                {show.venue}
              </p>

            </Link>
          );
        })}

      </div>

      {/* ================= FOOTER ================= */}

      <div className="pt-10 border-t border-zinc-900 text-center">
        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">
          © 2026 Party at Red Rocks
        </p>
      </div>

    </main>
  );
}
