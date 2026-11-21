import type { Metadata } from "next";
import Link from "next/link";
import { PhoneCall, ChevronLeft } from "lucide-react";
import BookingOrderLookup from "@/components/booking/BookingOrderLookup";
import { PARR_PUBLIC_FACTS } from "@/lib/publicOperatorFacts";
import { PARR_COMPLETE_TOTAL_DISCLOSURE } from "@/lib/pricing";
import {
  SUBURBAN_ALL_IN_TOTAL_LABEL,
  SUBURBAN_ITEMIZED_LABEL,
  VAN_ALL_IN_TOTAL_LABEL,
  VAN_ITEMIZED_LABEL,
} from "@/lib/rideCatalog";

const SITE = "https://www.partyatredrocks.com";

export const metadata: Metadata = {
  title: "Manage Booking & Private Reservation Lookup | Party at Red Rocks",
  description:
    `Look up an existing Party at Red Rocks reservation or reserve private Red Rocks transportation (${SUBURBAN_ALL_IN_TOTAL_LABEL} Suburban total / ${VAN_ALL_IN_TOTAL_LABEL} Van total, including 4% Booking fee).`,
  alternates: { canonical: `${SITE}/booking` },
};

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-white font-sans">
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#070b14]/95 px-6 py-4 backdrop-blur">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold uppercase text-white/80 no-underline transition-colors hover:text-[#ffb07c]"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Home
        </Link>
        <div className="text-lg font-black uppercase tracking-tight">
          Party at <span className="text-[#ffb07c]">Red Rocks</span>
        </div>
        <a
          href={`tel:${PARR_PUBLIC_FACTS.support.phoneE164}`}
          className="flex items-center gap-2 rounded-full bg-[#ff6b3d] px-4 py-2 text-xs font-black uppercase text-white no-underline"
        >
          <PhoneCall className="h-3 w-3" /> {PARR_PUBLIC_FACTS.support.phoneDisplay}
        </a>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 rounded-3xl border border-white/10 bg-white p-4 text-slate-900 sm:p-6">
          <BookingOrderLookup />
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d1424] shadow-2xl">
          <div className="border-b border-white/10 p-6 sm:p-8">
            <h1 className="text-3xl font-black uppercase tracking-tight text-white">
              Manage Existing Booking or Reserve Private Ride
            </h1>
            <p className="mt-2 text-sm text-white/75">
              2027 round-trip vehicle totals: Private Suburban {SUBURBAN_ALL_IN_TOTAL_LABEL} total ({SUBURBAN_ITEMIZED_LABEL}, up to 6) · Private Van {VAN_ALL_IN_TOTAL_LABEL} total ({VAN_ITEMIZED_LABEL}, up to 10). {PARR_COMPLETE_TOTAL_DISCLOSURE} Existing 2026 orders remain unchanged at their original booked prices.
            </p>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
            <Link href="/book/red-rocks-amphitheatre/private/suv" className="rounded-2xl bg-[#ff6b3d] px-5 py-5 text-center font-bold text-white">
              Book a Private Suburban — {SUBURBAN_ALL_IN_TOTAL_LABEL} total
            </Link>
            <Link href="/book/red-rocks-amphitheatre/private/van" className="rounded-2xl bg-[#ff6b3d] px-5 py-5 text-center font-bold text-white">
              Book a Private Van — {VAN_ALL_IN_TOTAL_LABEL} total
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-10 text-center text-[11px] font-bold uppercase tracking-[0.22em] text-white/50">
        Party at Red Rocks · Dispatch {PARR_PUBLIC_FACTS.support.phoneDisplay} · Private Concert Transportation
      </footer>
    </div>
  );
}
