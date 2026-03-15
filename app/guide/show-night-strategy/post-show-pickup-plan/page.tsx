import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Best Post-Show Pickup Plan at Red Rocks (2026)",
  description:
    "How to avoid getting stranded after Red Rocks: meet-point strategy, timing choices, and fallback plans for sold-out nights.",
  alternates: {
    canonical: "/guide/show-night-strategy/post-show-pickup-plan",
  },
};

const actionLinks = [
  { href: "/book", label: "Book a Ride" },
  { href: "/week/red-rocks", label: "This Week at Red Rocks" },
  { href: "/guide/transportation/shuttle-vs-uber", label: "Shuttle vs Uber" },
  { href: "/guide/parking", label: "Parking Guide" },
] as const;

const relatedLinks = [
  {
    href: "/guide/show-night-strategy",
    title: "Show-Night Strategy",
    body: "See timing, weather, and arrival planning for Red Rocks nights.",
  },
  {
    href: "/venues/red-rocks-amphitheatre",
    title: "Red Rocks Venue Guide",
    body: "Use the venue page to line up your timing, show details, and ride options.",
  },
  {
    href: "/guide/red-rocks-intelligence-hub",
    title: "Red Rocks Visiting Guide",
    body: "Review venue basics before you lock in your ride home.",
  },
  {
    href: "/venues/mission-ballroom",
    title: "Mission Ballroom",
    body: "Apply the same pre-show pickup planning to major indoor rooms.",
  },
  {
    href: "/venues/fiddlers-green-amphitheatre",
    title: "Fiddler's Green",
    body: "Use the same ride-home planning on sold-out amphitheatre nights.",
  },
] as const;

export default async function Page() {
  const faqRows = await getFaqRowsWithGlobal("guide/post-show-pickup-plan.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Guide", item: `${SITE}/guide` },
      { "@type": "ListItem", position: 3, name: "Show-Night Strategy", item: `${SITE}/guide/show-night-strategy` },
      {
        "@type": "ListItem",
        position: 4,
        name: "Post-Show Pickup Plan",
        item: `${SITE}/guide/show-night-strategy/post-show-pickup-plan`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-surface px-6 py-20 text-white">
      <section className="mx-auto max-w-5xl">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <div className="rounded-3xl border border-soft bg-surface-strong p-8 md:p-10">
          <div className="text-[11px] font-black uppercase tracking-[0.25em] text-muted">
            Pickup Planning
          </div>
          <h1 className="mt-3 text-5xl font-black tracking-tight md:text-6xl">
            Post-Show Pickup Plan
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-soft">
            Choose your meet point and backup plan before the encore. The toughest part of Red Rocks transportation usually
            starts when groups wait until the crowd is already moving.
          </p>
        </div>

        <section className="mt-10 rounded-3xl border border-soft bg-surface-strong p-6 md:p-8">
          <h2 className="text-2xl font-black tracking-tight">Before the encore</h2>
          <ol className="mt-5 list-decimal space-y-2 pl-5 text-soft leading-relaxed">
            <li>Pick one specific meet point before the show starts.</li>
            <li>Choose one fallback point in case service drops.</li>
            <li>Text the plan to everyone before the encore starts.</li>
            <li>Decide ahead of time if you are staying for the full encore or leaving early.</li>
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            {actionLinks.map((item) => (
              <Link key={item.href} className={item.label === "Book a Ride" ? "btn-primary" : "btn-ghost"} href={item.href}>
                {item.label}
              </Link>
            ))}
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

        <FAQBlock title="Post-Show Pickup FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
