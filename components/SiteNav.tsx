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

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070b14]/92 backdrop-blur-md">
      <div className="mx-auto max-w-[1440px] px-3 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex min-w-0 shrink-0 items-center no-underline">
            <BrandMark alt={brand} variant="nav" />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={[
                    "text-xs font-black uppercase tracking-[0.14em] no-underline transition",
                    active ? "text-[#ffb07c]" : "text-white/80 hover:text-white",
                  ].join(" ")}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href="sms:+17203696292"
              className="hidden rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white/85 no-underline transition hover:bg-white/12 sm:inline-flex"
            >
              Text 720-369-6292
            </a>
            <Link
              href="/book/red-rocks-amphitheatre/private"
              className="inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-full bg-[#ff7a4d] px-4 text-xs font-black uppercase tracking-[0.12em] text-[#140804] no-underline shadow-[0_8px_24px_rgba(255,122,77,0.3)] transition hover:bg-[#ff926b] sm:px-5"
            >
              <span className="sm:hidden">Book Ride</span>
              <span className="hidden sm:inline">{cta}</span>
            </Link>
          </div>
        </div>

        <nav
          aria-label="Mobile quick links"
          className="mt-2 flex gap-2 overflow-x-auto pb-1 lg:hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {NAV_LINKS.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={[
                  "shrink-0 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] no-underline transition",
                  active
                    ? "border-[#ffb07c]/50 bg-[#ffb07c]/15 text-[#ffb07c]"
                    : "border-white/10 bg-white/[0.04] text-white/80 hover:text-white",
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
