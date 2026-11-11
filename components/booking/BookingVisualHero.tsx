"use client";

import Image from "next/image";

type BookingVisualHeroProps = {
  eyebrow: string;
  title: string;
  copy: string;
  imageSrc: string;
  imageAlt: string;
};

export function BookingVisualHero({
  eyebrow,
  title,
  copy,
  imageSrc,
  imageAlt,
}: BookingVisualHeroProps) {
  return (
    <section className="brand-card relative overflow-hidden rounded-[32px] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[240px] sm:h-[320px] md:inset-0 md:h-full">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          unoptimized
          className="object-cover object-center"
          sizes="(min-width: 1280px) 1240px, 100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,22,0.58)_0%,rgba(5,8,22,0.34)_46%,rgba(5,8,22,0.48)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,138,61,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(61,243,255,0.08),transparent_28%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#0b1224] md:hidden" />
      </div>

      <div className="relative max-w-3xl px-6 py-8 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
        <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[var(--accentCool)]">
          {eyebrow}
        </div>
        <h1 className="mt-5 text-[2.2rem] font-black uppercase leading-[0.94] tracking-[-0.04em] text-white sm:text-[4rem]">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/80 sm:mt-5 sm:text-lg">
          {copy}
        </p>
      </div>
    </section>
  );
}
