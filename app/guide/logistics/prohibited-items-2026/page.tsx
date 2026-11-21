import type { Metadata } from "next";
import Link from "next/link";
import { PARR_COMPLETE_TOTAL_DISCLOSURE } from "@/lib/pricing";
import {
  SUBURBAN_ALL_IN_TOTAL_LABEL,
  SUBURBAN_ITEMIZED_LABEL,
  VAN_ALL_IN_TOTAL_LABEL,
  VAN_ITEMIZED_LABEL,
} from "@/lib/rideCatalog";

const SITE = "https://www.partyatredrocks.com";

export const metadata: Metadata = {
  title: "Red Rocks Prohibited Items & Security Rules (2026 Reference & 2027 Prep)",
  description:
    `Red Rocks Amphitheatre prohibited items, single-pocket hydration pack rules, and why keeping extra gear locked in a private Suburban (${SUBURBAN_ALL_IN_TOTAL_LABEL} total) or Van (${VAN_ALL_IN_TOTAL_LABEL} total, including 4% Booking fee) saves your show night.`,
  alternates: { canonical: `${SITE}/guide/logistics/prohibited-items-2026` },
  openGraph: {
    title: "Red Rocks Prohibited Items Deep Dive (2026 Season Reference)",
    description:
      "Hydration pack rules, battery limits, clear food bags, and locked private-vehicle gear storage at Red Rocks.",
    url: `${SITE}/guide/logistics/prohibited-items-2026`,
    type: "article",
  },
};

export default function ProhibitedItems() {
  const items = [
    {
      name: "Hydration Packs",
      rule: "Single-pocket only (plus the bladder compartment). Max 2L–3L bladder emptied before entry. Multi-zipper hiking packs are turned away.",
      tip: "If it looks like a daypack with organizer pockets, leave it in your private vehicle.",
    },
    {
      name: "Vapes & Pens",
      rule: "Permitted in designated outer smoking areas only—not inside the seating bowl.",
      tip: "Follow ushers' instructions in the rows; security actively enforces bowl rules.",
    },
    {
      name: "External Batteries",
      rule: "Pocket-sized phone power banks are permitted; oversized camping power stations are rejected.",
      tip: "Bring a compact cable and pocket charger for post-encore coordination.",
    },
    {
      name: "Outside Food",
      rule: "Permitted for personal consumption in a clear 1-gallon plastic bag.",
      tip: "Slice whole fruit ahead of time—whole apples or oranges are routinely turned back at security.",
    },
  ];

  return (
    <main className="mx-auto max-w-4xl bg-surface px-6 py-24 text-left text-white">
      <aside
        aria-label="2026 archive and 2027 update notice"
        className="mb-8 rounded-2xl border border-[#ffb07c]/35 bg-[#ffb07c]/10 p-5 text-sm leading-6 text-white/90"
      >
        <span className="font-black uppercase tracking-[0.16em] text-[#ffb07c]">2026 Security Reference · 2027 Ready:</span>{" "}
        Originally published for the 2026 Red Rocks season; always verify show-specific promoter rules on official Red Rocks channels before departure. Existing 2026 ride bookings remain honored at their original prices, while 2027 private round-trip vehicles book at{" "}
        <strong>{SUBURBAN_ALL_IN_TOTAL_LABEL} Private Suburban total</strong> ({SUBURBAN_ITEMIZED_LABEL}) and <strong>{VAN_ALL_IN_TOTAL_LABEL} Private Van total</strong> ({VAN_ITEMIZED_LABEL}).
      </aside>

      <header className="mb-12 border-l-4 border-[#ffb07c] pl-6 sm:pl-8">
        <h1 className="text-4xl font-black uppercase tracking-tight sm:text-5xl">
          2026 <span className="text-[#ffb07c]">Prohibited</span> Items Deep Dive
        </h1>
        <p className="mt-4 max-w-2xl text-lg font-medium text-muted sm:text-xl">
          Don&apos;t get sent back down the ramp at doors. Entry lanes at the Upper North and East Terrace entrances screen bags quickly—know what passes and what stays in the vehicle.
        </p>
      </header>

      <h2 className="mb-6 text-2xl font-black uppercase tracking-tight text-white">
        Most Common Gate Rejections
      </h2>

      <div className="mb-14 grid gap-6">
        {items.map((item) => (
          <div key={item.name} className="rounded-[2rem] border border-soft bg-surface-strong/60 p-7 shadow-soft">
            <h3 className="mb-2 text-2xl font-black uppercase text-[#ffb07c]">{item.name}</h3>
            <p className="mb-4 font-bold text-white">{item.rule}</p>
            <div className="rounded-2xl border border-soft bg-surface/50 p-4 text-base text-muted">
              <strong>Show-Night Tip:</strong> {item.tip}
            </div>
          </div>
        ))}
      </div>

      <section className="mb-14 rounded-[2.5rem] border border-soft bg-surface-strong p-8 sm:p-10">
        <h2 className="mb-6 text-2xl font-black uppercase text-white">Related Red Rocks Prep Guides</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <Link href="/guide/logistics/bag-policy" className="group">
            <h3 className="font-bold text-strong transition group-hover:text-[#ffb07c]">Bag Size & Clear Bag Rules →</h3>
            <p className="mt-1 text-base text-muted">Exact dimensions for totes, fanny packs, and small clutches.</p>
          </Link>
          <Link href="/red-rocks/what-to-wear" className="group">
            <h3 className="font-bold text-strong transition group-hover:text-[#ffb07c]">What to Wear at Red Rocks →</h3>
            <p className="mt-1 text-base text-muted">Month-by-month layering strategy for 6,450 feet.</p>
          </Link>
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-[#ffb07c]/30 bg-[#0d1424] p-8 text-center shadow-2xl sm:p-12">
        <h2 className="mb-4 text-3xl font-black uppercase text-white">The Waiting Private Vehicle Advantage</h2>
        <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
          If you arrive in an Uber and security turns away a bag or tailgate item, you have nowhere to put it. With a Party at Red Rocks Private Suburban ({SUBURBAN_ALL_IN_TOTAL_LABEL} total: {SUBURBAN_ITEMIZED_LABEL}) or Private Van ({VAN_ALL_IN_TOTAL_LABEL} total: {VAN_ITEMIZED_LABEL}), your driver and locked vehicle stay at Red Rocks through the entire concert—so tailgate coolers, chairs, and extra layers stay safe until the ride home. {PARR_COMPLETE_TOTAL_DISCLOSURE}
        </p>
        <Link
          href="/book/red-rocks-amphitheatre/private"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff6b3d] px-8 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-[#ff7f56]"
        >
          Choose Your Private Vehicle
        </Link>
      </section>
    </main>
  );
}
