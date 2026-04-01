"use client";

import BrandMark from "@/components/BrandMark";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DISPLAY, NAV_LINKS } from "@/lib/display";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function SiteNav() {
  const pathname = usePathname();
  const brand = DISPLAY.ui.brand;
  const cta = DISPLAY.ui.cta.primary;
  const mobileLinks = NAV_LINKS;

  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <div className="comic-wrap py-3">
        <div className="brand-glass-bar flex items-center justify-between gap-2 overflow-hidden rounded-[24px] px-3 py-3 sm:gap-3 sm:px-4">
          <Link href="/" className="flex min-w-0 flex-1 items-center no-underline">
            <BrandMark alt={brand} variant="nav" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={[
                    "text-[12px] font-black uppercase tracking-[0.16em] no-underline transition",
                    active ? "text-[var(--brand-text)]" : "text-[color:var(--brand-text-soft)] hover:text-[var(--brand-text)]",
                  ].join(" ")}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center justify-center">
            <Link
              href="/book/red-rocks-amphitheatre"
              className="brand-button-primary inline-flex min-h-[38px] max-w-full items-center justify-center whitespace-nowrap px-3 text-[10px] font-black uppercase tracking-[0.12em] no-underline sm:min-h-[42px] sm:px-4 sm:text-[12px] sm:tracking-[0.16em]"
            >
              <span className="sm:hidden">Book</span>
              <span className="hidden sm:inline">{cta}</span>
            </Link>
          </div>
        </div>

        <nav className="md:hidden mt-2 flex gap-4 overflow-x-auto px-2 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {mobileLinks.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={[
                  "shrink-0 text-[12px] font-black uppercase tracking-[0.16em] no-underline transition",
                  active ? "text-[var(--brand-text)]" : "text-[color:var(--brand-text-soft)] hover:text-[var(--brand-text)]",
                ].join(" ")}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
