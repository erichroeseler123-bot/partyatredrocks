import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { GuideVisualHero } from "@/components/guide/GuideVisualHero";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";
import { guideVisuals } from "@/lib/guideVisuals";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks Shuttle vs Uber (2026): Price vs Reliability",
  description:
    "Head-to-head comparison of shuttle vs Uber at Red Rocks: reliability, pricing behavior, pickup friction, and post-show failure modes.",
  alternates: {
    canonical: "/guide/transportation/shuttle-vs-uber",
  },
};

const comparisonRows = [
  {
    option: "Uber/Lyft",
    strongestUse: "Inbound flexibility",
    primaryRisk: "Post-encore surge and pickup friction",
  },
  {
    option: "Shared Shuttle",
    strongestUse: "Reliable round trip",
    primaryRisk: "You need to match the departure timing",
  },
  {
    option: "Private SUV/Van",
    strongestUse: "Control and comfort for your group",
    primaryRisk: "Higher upfront cost",
  },
] as const;

const relatedLinks = [
  {
    href: "/guide/transportation",
    title: "Transportation Guide",
    body: "Compare ride options and choose what fits your show night.",
  },
  {
    href: "/guide/show-night-strategy/post-show-pickup-plan",
    title: "Post-Show Pickup Plan",
    body: "See how to handle the ride home after the encore.",
  },
  {
    href: "/venues/red-rocks-amphitheatre",
    title: "Red Rocks Venue Guide",
    body: "Venue details, upcoming shows, and ride links for Red Rocks.",
  },
  {
    href: "/guide/red-rocks-intelligence-hub",
    title: "Red Rocks Visiting Guide",
    body: "Get the basics on altitude, trails, timing, and venue access.",
  },
  {
    href: "/venues/mission-ballroom",
    title: "Mission Ballroom",
    body: "Use the same ride-planning approach for major Denver venue nights.",
  },
  {
    href: "/venues/fiddlers-green-amphitheatre",
    title: "Fiddler's Green",
    body: "Compare how pickup and exit timing changes at another large amphitheatre.",
  },
] as const;

export default async function Page() {
  const faqRows = await getFaqRowsWithGlobal("guide/shuttle-vs-uber.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Guide", item: `${SITE}/guide` },
      { "@type": "ListItem", position: 3, name: "Transportation", item: `${SITE}/guide/transportation` },
      { "@type": "ListItem", position: 4, name: "Shuttle vs Uber", item: `${SITE}/guide/transportation/shuttle-vs-uber` },
    ],
  };

  return (
    <main className="min-h-screen bg-surface px-6 py-20 text-white">
      <section className="mx-auto max-w-5xl">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <GuideVisualHero
          eyebrow={guideVisuals.transportation.eyebrow}
          title="Shuttle vs Uber to Red Rocks"
          copy="Rideshare is flexible on the way in but less predictable after the show. A scheduled shuttle is less flexible on timing, but much stronger for the ride home."
          imageSrc={guideVisuals.transportation.imageSrc}
          imageAlt={guideVisuals.transportation.imageAlt}
          actions={
            <>
              <Link className="btn-primary" href="/book">
                Book a Ride
              </Link>
              <Link className="btn-ghost" href="/week/red-rocks">
                Red Rocks This Week
              </Link>
            </>
          }
        />

        <section className="mt-10 rounded-3xl border border-soft bg-surface-strong p-6 md:p-8">
          <h2 className="text-2xl font-black tracking-tight">What matters most</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm text-soft">
              <thead>
                <tr className="border-b border-soft text-strong">
                  <th className="py-2 pr-3 font-black">Option</th>
                  <th className="py-2 pr-3 font-black">Strongest use</th>
                  <th className="py-2 pr-3 font-black">Primary risk</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.option} className="border-b border-white/5">
                    <td className="py-3 pr-3 font-semibold text-strong">{row.option}</td>
                    <td className="py-3 pr-3">{row.strongestUse}</td>
                    <td className="py-3 pr-3">{row.primaryRisk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          {relatedLinks.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-3xl border border-soft bg-surface-strong p-6 no-underline transition hover:-translate-y-1 hover:border-white/20">
              <h2 className="text-2xl font-black tracking-tight text-strong">{item.title}</h2>
              <p className="mt-3 text-soft leading-relaxed">{item.body}</p>
            </Link>
          ))}
        </section>

        <FAQBlock title="Shuttle vs Uber FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
