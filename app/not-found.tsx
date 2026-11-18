import Link from "next/link";
import type { Metadata } from "next";
import { SUBURBAN_2027_USD, VAN_2027_USD } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Page Not Found | Party at Red Rocks",
  description:
    "This artist, event, or page does not have an active published listing yet. Browse announced 2027 Red Rocks concerts or search artists.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] flex-col items-center justify-center bg-[#070b14] px-4 py-16 text-center text-white sm:px-6">
      <div className="w-full max-w-2xl rounded-[28px] border border-white/12 bg-[#0d1424] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-10">
        <div className="inline-flex items-center rounded-full border border-[#ffb07c]/35 bg-[#ffb07c]/12 px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[#ffb07c]">
          404 · Listing Not Found
        </div>

        <h1 className="mt-4 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
          No Active Listing at This URL
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/78 sm:text-base">
          If you followed an older artist or show link, that artist does not currently have an officially announced 2027 Red Rocks date in our verified schedule—or the page address has changed.
        </p>

        <div className="mt-7 grid gap-3 text-left sm:grid-cols-2">
          <Link
            href="/red-rocks/concerts"
            className="rounded-2xl border border-[#ffb07c]/35 bg-[#ffb07c]/10 p-4 no-underline transition hover:border-[#ffb07c]/65"
          >
            <span className="block text-xs font-black uppercase tracking-[0.14em] text-[#ffb07c]">
              2027 Concert Calendar →
            </span>
            <span className="mt-1 block text-xs leading-5 text-white/80">
              Browse all officially announced 2027 Red Rocks shows by month.
            </span>
          </Link>

          <Link
            href="/search"
            className="rounded-2xl border border-white/12 bg-white/[0.04] p-4 no-underline transition hover:border-white/30"
          >
            <span className="block text-xs font-black uppercase tracking-[0.14em] text-white">
              Search Artists &amp; Venues →
            </span>
            <span className="mt-1 block text-xs leading-5 text-white/75">
              Search upcoming concerts across Red Rocks, Denver, and Boulder.
            </span>
          </Link>

          <Link
            href="/book/red-rocks-amphitheatre/private"
            className="rounded-2xl border border-white/12 bg-white/[0.04] p-4 no-underline transition hover:border-white/30"
          >
            <span className="block text-xs font-black uppercase tracking-[0.14em] text-white">
              Private Vehicles (${SUBURBAN_2027_USD} / ${VAN_2027_USD}) →
            </span>
            <span className="mt-1 block text-xs leading-5 text-white/75">
              Compare Private Suburban and 10-passenger Van round-trip rides.
            </span>
          </Link>

          <Link
            href="/guide"
            className="rounded-2xl border border-white/12 bg-white/[0.04] p-4 no-underline transition hover:border-white/30"
          >
            <span className="block text-xs font-black uppercase tracking-[0.14em] text-white">
              Red Rocks Planning Guides →
            </span>
            <span className="mt-1 block text-xs leading-5 text-white/75">
              Tailgating rules, single-pocket bag checks, and weather layering.
            </span>
          </Link>
        </div>

        <div className="mt-7">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#ff7a4d] px-6 text-xs font-black uppercase tracking-[0.14em] text-[#140804] no-underline transition hover:bg-[#ff926b]"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
