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
  const mobileLinks = NAV_LINKS;

  return (
    <header className="sticky top-0 z-50 border-b border-[#f5c66c]/18 bg-[rgba(52,33,13,0.94)] backdrop-blur">
      <div className="comic-wrap py-3">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[#fff4de]">
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
                    "text-[12px] font-black uppercase tracking-[0.16em] no-underline transition",
                    active ? "text-[#fff4de]" : "text-[#fff4de]/82 hover:text-[#fff4de]",
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
              className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-[#ffd6a3]/28 bg-[linear-gradient(180deg,#a95f28_0%,#8d4f20_100%)] px-4 text-[12px] font-black uppercase tracking-[0.16em] text-[#fff4de] no-underline shadow-[0_12px_28px_rgba(141,79,32,0.24)] transition hover:bg-[linear-gradient(180deg,#b66c31_0%,#975321_100%)]"
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
                  "shrink-0 text-[12px] font-black uppercase tracking-[0.16em] no-underline transition",
                  active ? "text-[#fff4de]" : "text-[#fff4de]/82 hover:text-[#fff4de]",
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
