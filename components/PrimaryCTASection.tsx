import Link from "next/link";
import type { ReactNode } from "react";

type CTAAction = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

export default function PrimaryCTASection({
  kicker,
  title,
  body,
  secondaryBody,
  actions = [],
  children,
}: {
  kicker: string;
  title?: string;
  body: string;
  secondaryBody?: string;
  actions?: CTAAction[];
  children?: ReactNode;
}) {
  return (
    <section className="brand-card mt-6 rounded-[28px] p-6 sm:p-7">
      <div className="brand-kicker text-[12px] sm:text-[13px] font-black uppercase tracking-[0.22em]">{kicker}</div>
      {title ? <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white">{title}</h2> : null}
      <p className="mt-3 text-sm leading-7 text-white/72 sm:text-base">{body}</p>
      {secondaryBody ? <p className="mt-2 text-sm leading-7 text-white/72 sm:text-base">{secondaryBody}</p> : null}
      {children}
      {actions.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-3">
          {actions.map((action) => (
            <Link
              key={`${action.href}-${action.label}`}
              href={action.href}
              className={
                action.variant === "secondary"
                  ? "brand-button-secondary inline-flex min-h-11 items-center justify-center px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] hover:no-underline"
                  : "brand-button-primary inline-flex min-h-12 items-center justify-center px-5 py-3 text-[12px] font-black uppercase tracking-[0.18em]"
              }
            >
              {action.label}
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
