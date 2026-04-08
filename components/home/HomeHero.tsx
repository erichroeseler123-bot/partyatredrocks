import Link from "next/link";
import Image from "next/image";
import { pageVisuals } from "@/lib/pageVisuals";

const HERO_IMAGE = pageVisuals.layout.shareImage;

export default function HomeHero() {
  return (
    <section className="relative min-h-[78vh] flex items-end overflow-hidden">
      <Image
        src={HERO_IMAGE}
        alt="Party at Red Rocks Transportation"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <p className="text-[11px] font-black uppercase tracking-[0.32em] text-strong/70">
          Premium Red Rocks transportation
        </p>

        <h1 className="mt-3 text-5xl md:text-7xl font-black italic uppercase leading-none">
          Party at Red Rocks
        </h1>

        <p className="mt-6 max-w-3xl text-strong text-lg md:text-2xl font-medium leading-relaxed">
          Fixed pricing. Pro drivers. Reliable post-show return.
          <span className="text-strong/80"> Shuttle seats $59–$65/pp or Private Suburban $449.</span>
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link href="/book-shuttle" className="btn-primary">
            Book shuttle
          </Link>
          <Link href="/private-suburban" className="btn-ghost border-red-500/30 bg-red-500/10 text-red-100 hover:bg-red-500/15">
            Private Suburban — $449
          </Link>
        </div>
      </div>
    </section>
  );
}
