import Link from "next/link";
import Image from "next/image";
import { DISPLAY, SCENE_PILLS } from "@/lib/display";

export default function SceneTiles() {
  const tiles = SCENE_PILLS.map((s) => {
    const img = (DISPLAY.images.sceneTiles as any)[s.key] || DISPLAY.images.showFallback;
    return { ...s, img };
  });

  return (
    <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,26,0.96),rgba(6,9,18,0.96))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-8">
      <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
        Browse scenes
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link
            key={t.key}
            href={t.href}
            className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-[#0b1224] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
          >
            <div className="absolute inset-0">
              <Image
                src={t.img}
                alt={`${t.label} scene`}
                fill
                className="object-cover opacity-35 group-hover:opacity-45 transition"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,22,0.16),rgba(5,8,22,0.86)_100%)]" />
            </div>

            <div className="relative">
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
                {t.label}
              </div>
              <div className="mt-2 text-xl font-black text-white">
                {t.label}
              </div>
              <div className="mt-2 text-sm leading-6 text-white/72">
                Browse artists, venues, and upcoming shows connected to this scene.
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
