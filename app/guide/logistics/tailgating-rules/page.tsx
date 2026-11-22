import Link from "next/link";
import { DccSourceCitations } from "@/components/shared/DccSourceCitations";

export const metadata = {
  title: "Red Rocks Tailgating Rules: What's Allowed & Prohibited in the Lots",
  description:
    "Official Red Rocks parking-lot tailgating rules: rear-of-vehicle footprint, no glass or charcoal grills, propane grill rules, gate bag limits, and private vehicle planning.",
  alternates: { canonical: "https://www.partyatredrocks.com/guide/logistics/tailgating-rules" },
};

export default function TailgatingRules() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 text-white">
      <h1 className="mb-4 text-4xl font-black tracking-tight">
        Tailgating at Red Rocks: Official Lot Rules &amp; Show-Night Tips
      </h1>
      <p className="mb-10 max-w-3xl text-soft leading-relaxed">
        Red Rocks allows pre-show tailgating in its parking lots, subject to strict park safety, alcohol, and fire rules. Separate rules apply once you walk from the parking lots to the amphitheatre gates.
      </p>

      <div className="mb-12 grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <h2 className="mb-3 text-xl font-bold text-emerald-300">Allowed in the Parking Lots</h2>
          <ul className="ml-5 list-disc space-y-2 text-white/90">
            <li>Tailgate directly behind your vehicle without blocking adjacent spaces or drive lanes.</li>
            <li>Bring cans or plastic containers instead of glass; full-strength beer and wine are permitted in the lots subject to Colorado law.</li>
            <li>Small gas-controlled propane grills at least 12&quot; off the ground with a flame 6&quot; or under, only when no temporary fire ban is in effect.</li>
            <li>If carrying snacks inside the amphitheatre gates, pack food in a 1-gallon clear plastic bag (fruit and vegetables sliced, plastic utensils only).</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-[#4cc9f0]/30 bg-[#3df3ff]/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <h2 className="mb-3 text-xl font-bold text-[#4cc9f0]">Prohibited in the Lots &amp; Park</h2>
          <ul className="ml-5 list-disc space-y-2 text-white/90">
            <li>Glass bottles or glass containers anywhere in the parking lots, park, or amphitheatre.</li>
            <li>Tents, freestanding canopies, amplified sound systems, and portable generators.</li>
            <li>Open-flame fires and charcoal grills anywhere in the park, plus beer kegs, hard liquor, or unauthorized vending.</li>
            <li>Overnight camping in vehicles (unoccupied vehicles left past 10 a.m. the next day may be ticketed or towed).</li>
          </ul>
        </div>
      </div>

      <h2 className="mb-4 text-2xl font-bold text-white">Practical Lot Note (Unofficial Fan Tip)</h2>
      <blockquote className="mb-10 rounded-2xl border-l-4 border-[#4cc9f0] bg-white/[0.04] p-5 italic text-white/85">
        &quot;If you end up parked in a lower lot, wear real walking shoes and pack light before heading up to the gates—the uphill walk and stairs take longer than first-timers expect.&quot;
      </blockquote>

      <div className="rounded-2xl border border-[#3df3ff]/30 bg-[linear-gradient(180deg,rgba(61,243,255,0.18),rgba(29,191,211,0.16))] p-8 text-center text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <p className="mb-5 text-lg">
          <strong>Keep Pre-Show Gear Locked in One Vehicle:</strong> Our private Suburban and 10-passenger van options keep your group on one reserved vehicle that stays on site through the concert—so extra layers and tailgating coolers do not have to go through security.
        </p>
        <Link
          href="/book/red-rocks-amphitheatre/private"
          className="inline-flex rounded-full bg-[#3df3ff] px-8 py-3 font-bold text-[#08111e] no-underline"
        >
          View Private Vehicle Options
        </Link>
      </div>

      <DccSourceCitations
        claimIds={[
          "red-rocks-tailgating-and-lot-rules",
          "red-rocks-single-pocket-bag-policy",
          "red-rocks-dropoff-and-lot-opening",
        ]}
        className="mt-12"
      />
    </main>
  );
}
