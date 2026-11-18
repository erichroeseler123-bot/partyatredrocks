"use client";

import Image from "next/image";

type BookingVisualHeroProps = {
  eyebrow: string;
  title: string;
  copy: string;
  imageSrc: string;
  imageAlt: string;
  imageNote?: string;
};

export function BookingVisualHero({
  eyebrow,
  title,
  copy,
  imageSrc,
  imageAlt,
  imageNote,
}: BookingVisualHeroProps) {
  return (
    <section className="brand-card relative overflow-hidden rounded-[26px] shadow-[0_32px_90px_rgba(0,0,0,0.45)] sm:rounded-[32px]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[210px] sm:h-[300px] md:inset-0 md:h-full">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          unoptimized
          className="object-cover object-center"
          sizes="(min-width: 1280px) 1240px, 100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,11,20,0.72)_0%,rgba(7,11,20,0.48)_48%,rgba(7,11,20,0.62)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#0d1424] md:hidden" />
      </div>

      <div className="relative max-w-3xl px-5 py-6 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="inline-flex items-center rounded-full border border-white/14 bg-black/45 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-[#ffb07c]">
          {eyebrow}
        </div>
        <h1 className="mt-3 text-[1.9rem] font-black uppercase leading-[0.98] tracking-[-0.035em] text-white sm:mt-4 sm:text-[3.5rem]">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/82 sm:mt-4 sm:text-lg">
          {copy}
        </p>
        {imageNote ? (
          <p className="mt-3 text-[11px] font-medium text-white/60">{imageNote}</p>
        ) : null}
      </div>
    </section>
  );
}
