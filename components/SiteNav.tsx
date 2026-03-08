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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070A12]/82 backdrop-blur-xl">
      <div className="comic-wrap py-3">
        <div className="comic-panel !p-3 relative">
          <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_12%_10%,rgba(56,189,248,0.35),transparent_35%),radial-gradient(circle_at_86%_0%,rgba(168,85,247,0.22),transparent_30%)]" />
          <div className="relative flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2 no-underline">
              <div className="comic-kicker">
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
                      "comic-btn !min-h-[38px] !px-3 !text-[10px] !tracking-[0.16em] transition",
                      active
                        ? "comic-btn-primary"
                        : "comic-btn-secondary",
                    ].join(" ")}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden lg:block w-[120px]">
              <MusicWave bars={10} className="!h-[36px] !max-w-none !px-2 !py-1 !gap-[4px]" />
            </div>

            <div className="flex items-center gap-2">
              <Link href="/book" className="comic-btn comic-btn-primary">
                {cta}
              </Link>
            </div>
          </div>
        </div>

        <nav className="md:hidden mt-2 flex gap-2 overflow-x-auto pb-1">
          {mobileLinks.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={[
                  "comic-btn !min-h-[36px] !text-[10px] !tracking-[0.15em] shrink-0",
                  active ? "comic-btn-primary" : "comic-btn-secondary",
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
