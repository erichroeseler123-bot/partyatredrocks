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
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          unoptimized
          className="object-cover object-center"
          sizes="(min-width: 1280px) 960px, 100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(10,18,56,0.88)_0%,rgba(10,18,56,0.56)_44%,rgba(9,9,9,0.9)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,91,46,0.12),transparent_26%)]" />
      </div>

      <div className="relative px-8 py-10 md:px-10 md:py-12">
        <div className="text-[11px] font-black uppercase tracking-[0.25em] text-[var(--brand-orange)]">{eyebrow}</div>
        <h1 className="mt-3 max-w-4xl text-5xl font-black tracking-tight text-white md:text-6xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/80">{copy}</p>
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}
