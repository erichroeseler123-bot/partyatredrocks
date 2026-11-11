import Image from "next/image";

type GuideVisualHeroProps = {
  eyebrow: string;
  title: string;
  copy: string;
  imageSrc: string;
  imageAlt: string;
  actions?: React.ReactNode;
};

export function GuideVisualHero({
  eyebrow,
  title,
  copy,
  imageSrc,
  imageAlt,
  actions,
}: GuideVisualHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-[var(--brand-orange)]/20 bg-[var(--brand-bg-dark)] shadow-[0_40px_120px_rgba(0,0,0,0.5)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[240px] sm:h-[320px] md:inset-0 md:h-full">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          unoptimized
          className="object-cover object-center"
          sizes="(min-width: 1280px) 960px, 100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(10,18,56,0.82)_0%,rgba(10,18,56,0.52)_44%,rgba(9,9,9,0.86)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,91,46,0.12),transparent_26%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[var(--brand-bg-dark)] md:hidden" />
      </div>

      <div className="relative px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
        <div className="text-[11px] font-black uppercase tracking-[0.25em] text-[var(--brand-orange)]">{eyebrow}</div>
        <h1 className="mt-3 max-w-4xl text-3xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/82 sm:mt-5 sm:text-lg">{copy}</p>
        {actions ? <div className="mt-7 flex flex-wrap gap-3 sm:mt-8">{actions}</div> : null}
      </div>
    </section>
  );
}
