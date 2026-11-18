import type { Metadata } from "next";
import Link from "next/link";
import { SUBURBAN_2027_USD, VAN_2027_USD } from "@/lib/pricing";

const SITE = "https://www.partyatredrocks.com";

export const metadata: Metadata = {
  title: "Private Red Rocks Ride vs Daytime Park Shuttle Pilot (2026 Reference)",
  description:
    `Why daytime park transit pilots (9 AM – 5 PM) do not cover late-night Red Rocks concert exits, and how private group vehicles ($${SUBURBAN_2027_USD} Suburban / $${VAN_2027_USD} Van) handle the full show night.`,
  alternates: { canonical: `${SITE}/guide/logistics/shuttle-vs-westracks-2026` },
  openGraph: {
    title: "Concert Transportation vs Daytime Park Pilot (2026 Reference)",
    description:
      "Daytime park shuttles stop before evening concerts end. Compare daytime park transit against dedicated private Red Rocks concert vehicles.",
    url: `${SITE}/guide/logistics/shuttle-vs-westracks-2026`,
    type: "article",
  },
};

export default function WestracksComparison() {
  return (
    <main className="mx-auto max-w-4xl bg-surface px-6 py-24 text-white">
      <aside
        aria-label="2026 historical context notice"
        className="mb-8 rounded-2xl border border-[#ffb07c]/35 bg-[#ffb07c]/10 p-5 text-sm leading-6 text-white/90"
      >
        <span className="font-black uppercase tracking-[0.16em] text-[#ffb07c]">2026 Transit Pilot Archive:</span>{" "}
        This comparison documents the 2026 daytime park shuttle pilot vs. dedicated evening concert transportation. Existing 2026 bookings remain honored at their original rates; current 2027 public private round-trip pricing is{" "}
        <strong>${SUBURBAN_2027_USD} Private Suburban</strong> (up to 6) and <strong>${VAN_2027_USD} Private Van</strong> (up to 10).
      </aside>

      <h1 className="mb-6 text-4xl font-black uppercase tracking-tight sm:text-5xl">
        Concert Ride vs. Daytime Park Pilot: <span className="text-[#ffb07c]">The 2026 Reality</span>
      </h1>
      <p className="mb-12 text-lg leading-relaxed text-muted sm:text-xl">
        Daytime park shuttle pilots are built for morning hikers and Trading Post visitors—operating <strong>daytime hours only (roughly 9 AM – 5 PM)</strong>. If you are going to an evening concert that lets out around 11:30 PM, daytime park buses will not bring your group home.
      </p>

      <div className="mb-14 overflow-x-auto rounded-2xl border border-soft">
        <table className="w-full border-collapse text-left text-sm sm:text-base">
          <thead>
            <tr className="bg-surface-strong">
              <th className="border-b border-soft p-4 uppercase">Feature</th>
              <th className="border-b border-soft p-4">Daytime Park Pilot</th>
              <th className="border-b border-soft p-4 font-black uppercase text-[#ffb07c]">
                Party at Red Rocks (Private Vehicle)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-soft p-4 font-bold">Post-Encore Return</td>
              <td className="border-b border-soft p-4 italic text-muted">No service after ~5 PM</td>
              <td className="border-b border-soft p-4 font-bold text-emerald-400">
                Driver & vehicle wait through the entire concert
              </td>
            </tr>
            <tr>
              <td className="border-b border-soft p-4 font-bold">Pickup</td>
              <td className="border-b border-soft p-4">Fixed transit station</td>
              <td className="border-b border-soft p-4 font-bold">
                Door-to-door from your Denver/Golden hotel, Airbnb, or home
              </td>
            </tr>
            <tr>
              <td className="border-b border-soft p-4 font-bold">Arrival & Tailgating</td>
              <td className="border-b border-soft p-4">Trading Post (daytime drop)</td>
              <td className="border-b border-soft p-4 font-bold text-[#ffb07c]">
                Upper North Lot staging + chairs, cooler, speaker & ice
              </td>
            </tr>
            <tr>
              <td className="p-4 font-bold">2027 Public Pricing</td>
              <td className="p-4 text-muted">Daytime park visitors only</td>
              <td className="p-4 font-bold text-white">
                ${SUBURBAN_2027_USD} Suburban (up to 6) · ${VAN_2027_USD} Van (up to 10)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="rounded-[2.5rem] border border-[#ffb07c]/35 bg-surface-strong p-8 text-center sm:p-10">
        <h2 className="mb-4 text-3xl font-black uppercase">Don&apos;t Get Stranded After the Encore</h2>
        <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Reserve one private vehicle for your crew—pickup, Upper North Lot tailgating, driver waiting on-site during the show, and a safe direct ride home included for one flat vehicle price.
        </p>
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
