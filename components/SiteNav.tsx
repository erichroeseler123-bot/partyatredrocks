"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MusicWave from "@/components/MusicWave";
import { DISPLAY, NAV_LINKS } from "@/lib/display";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function SiteNav() {
  const pathname = usePathname();
  const brand = DISPLAY.ui.brand;
  const cta = DISPLAY.ui.cta.primary;
  const mobileLinks = NAV_LINKS.filter((l) => l.href !== "/book").slice(0, 4);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070A12]/92 backdrop-blur">
      <div className="comic-wrap py-3">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white">
              {brand}
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={[
                    "text-[11px] font-black uppercase tracking-[0.18em] no-underline transition",
                    active ? "text-white" : "text-white/62 hover:text-white/88",
                  ].join(" ")}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:block w-[120px] opacity-70">
            <MusicWave bars={10} className="!h-[32px] !max-w-none !px-1 !py-1 !gap-[4px]" />
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/book"
              className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-white/14 px-4 text-[11px] font-black uppercase tracking-[0.18em] text-white no-underline transition hover:border-white/28 hover:bg-white/6"
            >
              {cta}
            </Link>
          </div>
        </div>

        <nav className="md:hidden mt-2 flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {mobileLinks.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={[
                  "shrink-0 text-[11px] font-black uppercase tracking-[0.18em] no-underline transition",
                  active ? "text-white" : "text-white/62 hover:text-white/88",
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
