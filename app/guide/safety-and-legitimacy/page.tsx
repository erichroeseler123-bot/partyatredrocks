import type { Metadata } from "next";
import Link from "next/link";
import { PARR_2027_OPTION_B_PRICING_AUTHORITY, PARR_COMPLETE_TOTAL_DISCLOSURE } from "@/lib/pricing";

const SITE = "https://www.partyatredrocks.com";
const SUV = PARR_2027_OPTION_B_PRICING_AUTHORITY.suv;
const VAN = PARR_2027_OPTION_B_PRICING_AUTHORITY.van;

export const metadata: Metadata = {
  title: "Professional Transportation & Safety Standards | Party at Red Rocks",
  description:
    `Commercial passenger licensing, driver background vetting, commercial insurance, and upfront all-in group pricing (${SUV.allInTotalFormatted} Suburban / ${VAN.allInTotalFormatted} Van total) for Red Rocks concerts.`,
  alternates: { canonical: `${SITE}/guide/safety-and-legitimacy` },
};

export default function SafetyAndLegitimacy() {
  const safetySchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE}/#organization`,
    name: "Party at Red Rocks",
    url: `${SITE}/`,
    description:
      "Independent Colorado private concert transportation provider for Red Rocks and Denver venues with vetted drivers and commercial insurance coverage.",
    areaServed: ["Denver", "Golden", "Boulder", "Morrison"],
    telephone: "+1-720-369-6292",
  };

  return (
    <main className="mx-auto max-w-3xl bg-surface px-6 py-24 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(safetySchema) }} />

      <h1 className="mb-6 text-4xl font-black uppercase tracking-tight">Professional Transportation Standards</h1>

      <p className="mb-14 text-lg leading-relaxed text-soft">
        <strong>Party at Red Rocks</strong> operates dedicated private Suburban and 10-passenger van rides for Red Rocks Amphitheatre and Denver-area concert venues. Here are the licensing, driver vetting, insurance, and pricing standards behind every booking.
      </p>

      <section className="panel mb-14 rounded-[2.5rem] p-8 shadow-2xl">
        <h2 className="mb-6 text-2xl font-black uppercase text-[#ffb07c]">Operator Safety & Licensing Standards</h2>
        <ul className="space-y-6">
          <li className="flex gap-4">
            <span className="font-bold text-[#ffb07c]">01.</span>
            <div>
              <strong className="block uppercase tracking-wide text-white">Background-Checked Commercial Drivers</strong>
              <p className="mt-1 text-base text-muted">
                Every driver completes criminal background screening and Colorado mountain-corridor driving standards before operating concert nights.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-[#ffb07c]">02.</span>
            <div>
              <strong className="block uppercase tracking-wide text-white">Commercial Passenger Coverage (PUC LL-02649)</strong>
              <p className="mt-1 text-base text-muted">
                Vehicles operate under active Colorado PUC luxury limousine authority and commercial passenger liability insurance—not personal rideshare policies.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-[#ffb07c]">03.</span>
            <div>
              <strong className="block uppercase tracking-wide text-white">Upfront All-In Pricing Integrity</strong>
              <p className="mt-1 text-base text-muted">
                Your 2027 all-in round-trip total ({SUV.allInTotalFormatted} Private Suburban: {SUV.itemizedSummary} / {VAN.allInTotalFormatted} Private Van: {VAN.itemizedSummary}) is itemized upfront—zero post-show surge multipliers. {PARR_COMPLETE_TOTAL_DISCLOSURE}
              </p>
            </div>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-black uppercase tracking-tight text-white">Why Pre-Booked Private Service Matters</h2>
        <p className="mt-3 leading-relaxed text-muted">
          When 9,500 fans exit Red Rocks at once in the dark, cell networks saturate and rideshare queues back up down the mountain. Having your own driver and vehicle waiting at Red Rocks means your ride home is already staged before the encore ends.
        </p>
      </section>

      <div className="mt-14 border-t border-white/10 pt-10 text-center">
        <Link
          href="/book/red-rocks-amphitheatre/private"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff6b3d] px-8 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-[#ff7f56]"
        >
          Choose Your Private Vehicle
        </Link>
      </div>
    </main>
  );
}
