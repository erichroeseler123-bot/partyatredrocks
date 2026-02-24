import Link from "next/link";
import SceneTiles from "@/components/SceneTiles";
import { SCENES } from "@/data/scenes";

export const revalidate = 3600;

export default function SceneIndex() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <SceneTiles />
      <div className="rounded-[32px] border border-soft panel p-8">
        <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/70">
          Scene Directory
        </div>
        <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tight">
          Colorado Scene Hubs
        </h1>
        <p className="mt-4 max-w-3xl text-white/70">
          Pick a scene to see upcoming shows + ride options.
        </p>
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SCENES.map((s) => (
          <Link
            key={s.slug}
            href={`/scene/${s.slug}`}
            className="rounded-3xl border border-soft panel p-6 hover:bg-surface/40 transition"
          >
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">
              Scene Hub
            </div>
            <div className="mt-2 text-2xl font-black">
              {s.emoji ? <span className="mr-2">{s.emoji}</span> : null}
              {s.title}
            </div>
            <div className="mt-2 text-sm text-white/70">{s.tagline}</div>
          </Link>
        ))}
      </section>
    </main>
  );
}
