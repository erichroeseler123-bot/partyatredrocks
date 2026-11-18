"use client";

import { useEffect, useState } from "react";
import BrandMark from "@/components/BrandMark";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { DISPLAY, NAV_LINKS } from "@/lib/display";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function SiteNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const brand = DISPLAY.ui.brand;
  const cta = DISPLAY.ui.cta.primary;

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070b14]/95 backdrop-blur-md">
      <div className="mx-auto max-w-[1440px] px-3 py-1.5 sm:px-6 sm:py-2 lg:px-8">
        <div className="flex items-center justify-between gap-2">
          <Link href="/" className="flex shrink-0 items-center no-underline">
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

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <a
              href="sms:+17203696292"
              className="hidden rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white/85 no-underline transition hover:bg-white/12 md:inline-flex"
            >
              Text 720-369-6292
            </a>
            <Link
              href="/book/red-rocks-amphitheatre/private"
              className="inline-flex min-h-9 items-center justify-center whitespace-nowrap rounded-full bg-[#ff7a4d] px-2.5 text-[10.5px] font-black uppercase tracking-[0.07em] text-[#140804] no-underline shadow-[0_6px_20px_rgba(255,122,77,0.28)] transition hover:bg-[#ff926b] min-[360px]:px-3 min-[360px]:text-[11px] sm:min-h-10 sm:px-5 sm:text-xs sm:tracking-[0.12em]"
            >
              <span className="sm:hidden">Book Ride</span>
              <span className="hidden sm:inline">{cta}</span>
            </Link>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-site-menu"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex min-h-9 items-center justify-center gap-1 rounded-full border border-white/16 bg-white/[0.06] px-2 text-[10.5px] font-bold uppercase tracking-[0.07em] text-white transition hover:bg-white/12 min-[360px]:px-2.5 min-[360px]:text-[11px] lg:hidden"
            >
              {menuOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
              <span>Menu</span>
            </button>
          </div>
        </div>

        {menuOpen ? (
          <nav
            id="mobile-site-menu"
            aria-label="Mobile navigation"
            className="mt-2 grid gap-1 border-t border-white/10 pb-2 pt-2.5 lg:hidden"
          >
            {NAV_LINKS.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className={[
                    "flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-black uppercase tracking-[0.12em] no-underline transition",
                    active
                      ? "bg-[#ffb07c]/15 text-[#ffb07c]"
                      : "text-white/85 hover:bg-white/[0.06] hover:text-white",
                  ].join(" ")}
                >
                  <span>{l.label}</span>
                  <span aria-hidden="true" className="text-white/40">
                    →
                  </span>
                </Link>
              );
            })}
            <a
              href="sms:+17203696292"
              className="mt-1 flex items-center justify-between rounded-xl border border-white/12 bg-white/[0.04] px-3 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-[#ffb07c] no-underline"
            >
              <span>Text Dispatch · 720-369-6292</span>
              <span aria-hidden="true">↗</span>
            </a>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
