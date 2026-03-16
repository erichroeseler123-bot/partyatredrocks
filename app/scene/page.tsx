import Link from "next/link";
import SceneTiles from "@/components/SceneTiles";
import { SCENES } from "@/data/scenes";

export const revalidate = 3600;

export default function SceneIndex() {
  return (
    <main className="bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1440px] flex-col gap-8">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,15,31,0.96),rgba(7,11,25,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,91,46,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(143,208,255,0.14),transparent_28%)]" />
          <div className="relative max-w-4xl">
            <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
              Browse scenes
            </div>
            <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem] lg:text-[5rem]">
              Music Scenes Around Red Rocks
            </h1>
            <p className="mt-5 max-w-3xl text-[15px] leading-7 text-white/74 sm:text-lg">
              Browse artists, venues, and upcoming shows connected to the scenes moving through Red Rocks, Denver,
              Boulder, and the Front Range.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/week"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#3df3ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff]"
              >
                Browse Shows
              </Link>
              <Link
                href="/venues"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                Browse Venues
              </Link>
            </div>
          </div>
        </section>

        <SceneTiles />

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,26,0.96),rgba(6,9,18,0.96))] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Scene Directory
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {SCENES.map((s) => (
              <Link
                key={s.slug}
                href={`/scene/${s.slug}`}
                className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/6 px-4 text-xs font-black uppercase tracking-[0.16em] text-white/88 transition hover:bg-white/10"
              >
                {s.emoji ? `${s.emoji} ` : ""}
                {s.title}
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
