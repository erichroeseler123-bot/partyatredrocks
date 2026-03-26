"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DISPLAY } from "@/lib/display";

export default function FloatingBook() {
  const pathname = usePathname();
  const showPriorityBar = pathname === "/" || pathname === "/venues/red-rocks-amphitheatre";

  if (showPriorityBar) {
    const bookHref = "/book/red-rocks-amphitheatre";
    return (
      <div className="fixed bottom-4 left-0 right-0 z-[60] px-4 md:hidden">
        <div className="brand-glass-bar rounded-[24px] px-3 py-3">
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Link
              href={bookHref}
              className="brand-button-primary brand-button-pulse flex min-h-[52px] items-center justify-center px-4 text-[11px] font-black uppercase tracking-[0.2em] active:scale-[0.99]"
            >
              {pathname === "/" ? "Book Red Rocks" : "Book This Venue"}
            </Link>
            <Link
              href="/week/red-rocks"
              className="flex min-h-[52px] items-center justify-center rounded-full border border-white/14 bg-white/6 px-4 text-[11px] font-black uppercase tracking-[0.18em] text-white/88 no-underline active:scale-[0.99]"
            >
              Schedule
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 -bottom-4 h-10 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-0 right-0 z-[60] px-4 md:hidden">
      <Link
        href="/book"
        className="brand-button-primary brand-button-pulse flex w-full items-center justify-center px-6 py-4 text-[12px] font-black uppercase tracking-[0.22em] active:scale-[0.99]"
      >
        {DISPLAY.ui.cta.primary}
      </Link>
      <div className="pointer-events-none absolute inset-x-0 -bottom-4 h-10 bg-gradient-to-t from-black/60 to-transparent" />
    </div>
  );
}
