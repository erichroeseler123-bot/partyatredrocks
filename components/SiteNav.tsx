"use client";

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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0F1A]/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="text-[12px] font-black tracking-[0.22em] uppercase text-white/80">
            {brand}
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={[
                  "rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] border transition",
                  active
                    ? "border-white/20 bg-white/5 text-white"
                    : "border-white/10 bg-transparent text-white/70 hover:text-white hover:bg-white/5 hover:border-white/20",
                ].join(" ")}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/book" className="btn-primary">
            {cta}
          </Link>
        </div>
      </div>
    </header>
  );
}
