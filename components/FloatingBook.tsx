"use client";

import Link from "next/link";
import { DISPLAY } from "@/lib/display";

export default function FloatingBook() {
  // show on mobile only
  return (
    <div className="fixed bottom-4 left-0 right-0 z-[60] px-4 md:hidden">
      <Link
        href="/book"
        className="flex w-full items-center justify-center rounded-full bg-[var(--accent)] px-6 py-4 text-[12px] font-black uppercase tracking-[0.22em] text-white shadow-[0_18px_60px_rgba(0,0,0,0.55)] active:scale-[0.99]"
      >
        {DISPLAY.ui.cta.primary}
      </Link>
      <div className="pointer-events-none absolute inset-x-0 -bottom-4 h-10 bg-gradient-to-t from-black/60 to-transparent" />
    </div>
  );
}
