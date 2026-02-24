import Link from "next/link";
import Image from "next/image";
import { DISPLAY, SCENE_PILLS } from "@/lib/display";

export default function SceneTiles() {
  const tiles = SCENE_PILLS.map((s) => {
    const img = (DISPLAY.images.sceneTiles as any)[s.key] || DISPLAY.images.showFallback;
    return { ...s, img };
  });

  return (
    <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">
        Explore the Denver Scene
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {tiles.map((t) => (
          <Link
            key={t.key}
            href={t.href}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 hover:bg-white/[0.06] transition"
          >
            <div className="absolute inset-0">
              <Image
                src={t.img}
                alt={`${t.label} scene`}
                fill
                className="object-cover opacity-35 group-hover:opacity-45 transition"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0" style={{ background: "var(--heroOverlay)" }} />
            </div>

            <div className="relative">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-white/70">
                {t.label}
              </div>
              <div className="mt-2 text-lg font-black text-white/95">
                Upcoming shows + intel →
              </div>
              <div className="mt-2 text-sm text-white/70">
                Tap in → find events → hit Ride Options → book.
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
