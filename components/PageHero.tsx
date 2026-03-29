import Link from "next/link";
import type { ReactNode } from "react";

type HeroAction = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

export default function PageHero({
  kicker,
  title,
  description,
  secondaryDescription,
  actions = [],
  footer,
}: {
  kicker: string;
  title: string;
  description: string;
  secondaryDescription?: string;
  actions?: HeroAction[];
  footer?: ReactNode;
}) {
  return (
    <section className="brand-panel overflow-hidden rounded-[32px] px-6 py-8 shadow-[0_28px_90px_rgba(0,0,0,0.34)] sm:px-8 sm:py-10 lg:px-10">
      <div className="brand-kicker text-[12px] sm:text-[13px] font-black uppercase tracking-[0.24em]">{kicker}</div>
      <h1 className="mt-4 max-w-[12ch] text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-[58rem] text-base leading-7 text-white/78 sm:text-lg">{description}</p>
      {secondaryDescription ? (
        <p className="mt-3 max-w-[54rem] text-sm leading-7 text-white/64 sm:text-base">{secondaryDescription}</p>
      ) : null}
      {actions.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {actions.map((action) => (
            <Link
              key={`${action.href}-${action.label}`}
              href={action.href}
              className={
                action.variant === "secondary"
                  ? "inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 py-3 text-[12px] font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5 hover:border-[var(--brand-border-strong)] hover:bg-white/10 hover:no-underline"
                  : "brand-button-primary brand-button-pulse inline-flex min-h-12 items-center justify-center px-6 py-3 text-[12px] font-black uppercase tracking-[0.2em]"
              }
            >
              {action.label}
            </Link>
          ))}
        </div>
      ) : null}
      {footer ? <div className="mt-6">{footer}</div> : null}
    </section>
  );
}
