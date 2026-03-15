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
        2026 <span className="text-[#4cc9f0]">Season</span> Lineup Guide
      </h1>

      <p className="text-muted text-xl mb-12 leading-relaxed font-medium">
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
              className="group p-8 panel rounded-[2.5rem] shadow-xl transition-all hover:border-[#4cc9f0]"
            >

              <span className="font-mono text-base font-bold uppercase tracking-widest text-[#ffb07c]">
                {date.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>

              <h3 className="mt-2 text-2xl font-black uppercase italic tracking-tight transition-colors group-hover:text-[#4cc9f0]">
                {show.artist}
              </h3>

              <p className="text-muted text-base mt-3">
                {show.venue}
              </p>

            </Link>
          );
        })}

      </div>

      {/* ================= FOOTER ================= */}

      <div className="pt-10 border-t border-zinc-900 text-center">
        <p className="text-faint text-[10px] font-black uppercase tracking-[0.4em]">
          © 2026 Party at Red Rocks
        </p>
      </div>

    </main>
  );
}
