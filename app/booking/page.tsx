import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { PhoneCall, ChevronLeft } from "lucide-react";
import BookingOrderLookup from "@/components/booking/BookingOrderLookup";
import { PARR_PUBLIC_FACTS } from "@/lib/publicOperatorFacts";
import { SUBURBAN_2027_USD, VAN_2027_USD } from "@/lib/pricing";

const SITE = "https://www.partyatredrocks.com";

export const metadata: Metadata = {
  title: "Manage Booking & Private Reservation Lookup | Party at Red Rocks",
  description:
    `Look up an existing Party at Red Rocks reservation or reserve private Red Rocks transportation ($${SUBURBAN_2027_USD} Suburban / $${VAN_2027_USD} Van).`,
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
              2027 flat round-trip vehicle rates: Private Suburban (${SUBURBAN_2027_USD}, up to 6) · Private Van (${VAN_2027_USD}, up to 10). Existing 2026 orders remain unchanged at their original booked prices.
            </p>
          </div>

          <div className="relative min-h-[1000px] bg-white p-2">
            <Script
              src="https://gosnotransportation58.rezdy.com/pluginJs"
              strategy="afterInteractive"
            />
            <iframe
              seamless
              width="100%"
              height="1000px"
              frameBorder="0"
              className="rezdy"
              title="Party at Red Rocks Booking"
              src="https://gosnotransportation58.rezdy.com/catalog/541037/party-at-red-rocks?iframe=true"
            />
          </div>
        </div>
      </main>

      <footer className="py-10 text-center text-[11px] font-bold uppercase tracking-[0.22em] text-white/50">
        Party at Red Rocks · Dispatch {PARR_PUBLIC_FACTS.support.phoneDisplay} · Private Concert Transportation
      </footer>
    </div>
  );
}
