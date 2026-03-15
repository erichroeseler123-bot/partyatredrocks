import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks Parking Guide (2026): Lots, Walking Cost, Exit Strategy",
  description:
    "Red Rocks parking guide with lot tradeoffs, hike reality, and post-show exit planning. Includes direct links to venue details, weekly lineup, and ride booking.",
  alternates: {
    canonical: "/guide/logistics/parking-lots",
  },
};

export default async function ParkingLots() {
  const faqRows = await getFaqRowsWithGlobal("guide/parking-lots.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Guide", item: `${SITE}/guide` },
      { "@type": "ListItem", position: 3, name: "Logistics", item: `${SITE}/guide/logistics` },
      { "@type": "ListItem", position: 4, name: "Parking Lots", item: `${SITE}/guide/logistics/parking-lots` },
    ],
  };

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1240px] flex-col gap-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(76,201,240,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(255,176,124,0.14),transparent_28%)]" />
          <div className="relative max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#4cc9f0]">
            Red Rocks Parking
          </div>
          <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem] lg:text-[5rem]">
            Which Lot Is Best at Red Rocks?
          </h1>
          <p className="mt-5 max-w-3xl text-[15px] leading-7 text-white/74 sm:text-lg">
            Direct answer: the best lot depends on whether you optimize for easier entry or faster exit. Most first-timers
            underestimate the stair and elevation cost from lower lots.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#3df3ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#08111e] transition hover:bg-[#62f6ff]" href="/book?venue=red-rocks-amphitheatre">
              Book a Ride
            </Link>
            <Link className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10" href="/week/red-rocks">
              This Week at Red Rocks
            </Link>
          </div>
          </div>
        </section>

        <section className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#4cc9f0]">Lot Tradeoffs</div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-2 pr-3">Lot</th>
                  <th className="py-2 pr-3">Best For</th>
                  <th className="py-2 pr-3">Main Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-3 font-semibold">Upper North / Top Area</td>
                  <td className="py-2 pr-3">Easier entry at show start</td>
                  <td className="py-2 pr-3">Fills early on high-demand nights</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-3 font-semibold">Lower South</td>
                  <td className="py-2 pr-3">Potentially cleaner outbound flow</td>
                  <td className="py-2 pr-3">Longer uphill approach before the show</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/74">
            Validate lot timing with the{" "}
            <a href="https://www.redrocksonline.com/plan-your-visit/getting-here/" target="_blank" rel="noreferrer">
              official venue parking guidance
            </a>{" "}
            before show night.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Link href="/guide/red-rocks-intelligence-hub" className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">Guide</div>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">Red Rocks Guide</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">Full venue context: elevation, layout, day-visit details, and planning links.</p>
          </Link>
          <Link href="/venues/red-rocks-amphitheatre" className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">Venue</div>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">Red Rocks Venue Page</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">Upcoming shows, venue details, and logistics in one place.</p>
          </Link>
          <Link href="/guide/show-night-strategy/post-show-pickup-plan" className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">Exit Plan</div>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">Post-Show Pickup Plan</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">How to avoid the stranded window after encore.</p>
          </Link>
          <Link href="/guide/transportation/shuttle-vs-uber" className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">Compare</div>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">Shuttle vs Uber</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">Reliability and post-show risk comparison for Red Rocks transportation.</p>
          </Link>
          <Link href="/venues/mission-ballroom" className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">Venue</div>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">Mission Ballroom</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">Use the same parking and pickup framework on dense urban venue nights.</p>
          </Link>
          <Link href="/venues/fiddlers-green-amphitheatre" className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">Venue</div>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">Fiddler&apos;s Green</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">Outdoor amphitheatre exit and pickup planning with similar show-night surges.</p>
          </Link>
        </section>

        <FAQBlock title="Red Rocks Parking FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
