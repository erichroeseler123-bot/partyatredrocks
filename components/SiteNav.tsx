"use client";

// components/SiteNav.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = {
 label: string;
 href: string;
 match?: (pathname: string) => boolean;
 badge?: string;
 tone?: "default" | "book";
};

const TABS: Tab[] = [
 {
 label: "Book",
 href: "/book",
 tone: "book",
 match: (p) =>
 p === "/book" ||
 p.startsWith("/book-") ||
 p.startsWith("/booking") ||
 p.startsWith("/private-") ||
 p.startsWith("/shuttles/all-venue") ||
 p.startsWith("/book-all-"),
 },
 {
 label: "This Week",
 href: "/week",
 match: (p) => p === "/week" || p.startsWith("/week/"),
 },
 {
 label: "Venues",
 href: "/venues",
 match: (p) => p === "/venues" || p.startsWith("/venues/"),
 },
 {
 label: "Guides",
 href: "/guide",
 match: (p) => p === "/guide" || p.startsWith("/guide/"),
 },
 {
 label: "Shuttles",
 href: "/shuttles",
 match: (p) => p === "/shuttles" || p.startsWith("/shuttles/"),
 },
];

function isActive(tab: Tab, pathname: string) {
 if (tab.match) return tab.match(pathname);
 return pathname === tab.href || pathname.startsWith(tab.href + "/");
}

export default function SiteNav() {
 const pathname = usePathname() || "/";
 const current = pathname.split("?")[0];

 return (
 <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/85 backdrop-blur supports-[backdrop-filter]:bg-black/60">
 {/* Top strip */}
 <div className="w-full px-4 sm:px-6">
 <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4">
 <Link
 href="/"
 className="shrink-0 font-black uppercase tracking-widest text-white hover:text-neon-blue transition-colors"
 aria-label="Party at Red Rocks homepage"
 >
 Party <span className="text-red-500">@</span> Red Rocks
 </Link>

 <div className="hidden md:flex items-center gap-3">
 <Link
 href="/book-shuttle"
 className="btn-primary"
 >
 Book Shuttle
 </Link>
 </div>
 </div>
 </div>

 {/* Tabs */}
 <div className="w-full px-2 sm:px-6">
 <div className="mx-auto max-w-7xl">
 <div
 className="no-scrollbar flex items-center gap-2 overflow-x-auto py-2"
 role="tablist"
 aria-label="Primary navigation"
 >
 {TABS.map((t) => {
 const active = isActive(t, current);

 const base =
 "relative whitespace-nowrap rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.25em] transition-all";
 const inactive =
 "border border-white/10 bg-surface/20 text-zinc-400 hover:text-white hover:border-zinc-700";
 const activeDefault =
 "border border-neon-blue/40 bg-neon-blue/10 text-neon-blue shadow-[0_0_0_1px_rgba(0,229,255,0.08)]";
 const activeBook =
 "border border-red-500/50 bg-red-600/15 text-red-200 shadow-[0_0_0_1px_rgba(239,68,68,0.12)]";

 const activeCls =
 t.tone === "book" ? activeBook : activeDefault;

 return (
 <Link
 key={t.href}
 href={t.href}
 className={[
 base,
 active ? activeCls : inactive,
 t.tone === "book" && !active
 ? "border-red-600/40 text-red-200/80 hover:border-red-500 hover:text-red-100"
 : "",
 ].join(" ")}
 role="tab"
 aria-selected={active}
 >
 <span className="relative z-10">{t.label}</span>

 {/* active pulse */}
 {active ? (
 <span
 aria-hidden="true"
 className={[
 "pointer-events-none absolute inset-0 rounded-full opacity-100",
 t.tone === "book"
 ? "bg-[radial-gradient(circle_at_30%_30%,rgba(239,68,68,0.22),transparent_55%)]"
 : "bg-[radial-gradient(circle_at_30%_30%,rgba(0,229,255,0.18),transparent_55%)]",
 ].join(" ")}
 />
 ) : null}

 {/* optional badge */}
 {t.badge ? (
 <span className="ml-2 rounded-full border border-zinc-700 bg-surface/50 px-2 py-0.5 text-[9px] tracking-widest text-zinc-300 hover:glow-accent hover:scale-105 transition-all duration-200">
 {t.badge}
 </span>
 ) : null}
 </Link>
 );
 })}
 </div>

 {/* small hint line */}
 <div className="pb-2">
 <div className="flex items-center justify-between">
 <span className="text-[9px] font-mono uppercase tracking-[0.35em] text-zinc-600">
 Global Nav // System_Active
 </span>
 <Link
 href="/book-shuttle"
 className="md:hidden text-[9px] font-black uppercase tracking-[0.35em] text-red-300/80 hover:text-red-200"
 >
 Execute_Booking →
 </Link>
 </div>
 </div>
 </div>
 </div>

 <style jsx global>{`
 .no-scrollbar::-webkit-scrollbar {
 display: none;
 }
 .no-scrollbar {
 -ms-overflow-style: none;
 scrollbar-width: none;
 }
 `}</style>
 </nav>
 );
}
