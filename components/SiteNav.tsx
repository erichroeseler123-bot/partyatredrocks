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
        <div className="brand-glass-bar flex items-center justify-between gap-3 rounded-[24px] px-4 py-3">
          <Link href="/" className="flex h-[88px] items-center no-underline sm:h-[96px]">
            <BrandMark
              alt={brand}
              frameClassName="h-16 w-[264px] sm:h-[72px] sm:w-[296px]"
              imageClassName="h-32 sm:h-36"
            />
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

          <div className="flex items-center gap-2">
            <Link
              href="/book/red-rocks-amphitheatre"
              className="brand-button-primary inline-flex min-h-[42px] items-center justify-center px-4 text-[12px] font-black uppercase tracking-[0.16em] no-underline"
            >
              {cta}
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
