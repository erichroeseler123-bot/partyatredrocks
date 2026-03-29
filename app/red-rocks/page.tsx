import type { Metadata } from "next";
import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import CardGrid from "@/components/CardGrid";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";
import PageHero from "@/components/PageHero";
import PrimaryCTASection from "@/components/PrimaryCTASection";
import { RED_ROCKS_ENTITIES } from "@/lib/redRocksAuthority";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";
const DEFAULT_OG_IMAGE =
  `${SITE}/api/unsplash-image?q=red+rocks+amphitheatre+concert+night+denver+colorado&src=%2Fhero%2Fhero-home.jpg&alt=Red+Rocks+guide&w=1200&h=630`;

export const metadata: Metadata = {
  title: "Red Rocks Guide: Visiting, Concerts, Trails, Geology, Transportation",
  description:
    "Red Rocks visiting and concert guide with parking, trails, transportation, geology, wildlife, and planning basics.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: { canonical: `${SITE}/red-rocks` },
  openGraph: {
    title: "Red Rocks Guide: Visiting, Concerts, Trails, Geology, Transportation",
    description:
      "Red Rocks visiting and concert guide with parking, trails, transportation, geology, wildlife, and planning basics.",
    url: `${SITE}/red-rocks`,
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        alt: "Red Rocks guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Rocks Guide: Visiting, Concerts, Trails, Geology, Transportation",
    description:
      "Red Rocks visiting and concert guide with parking, trails, transportation, geology, wildlife, and planning basics.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const clusterLinks = [
  { href: "/red-rocks/visiting-guide", tag: "Visit", title: "Visiting Guide", copy: "Hours, timing, weather, and what to bring." },
  { href: "/red-rocks/parking", tag: "Parking", title: "Parking Guide", copy: "Lot tradeoffs, stair effort, and exit timing." },
  { href: "/red-rocks/concert-guide", tag: "Concerts", title: "Concert Guide", copy: "Capacity, movement, and show-night basics." },
  { href: "/red-rocks/hiking-trails", tag: "Trails", title: "Hiking Trails", copy: "Route planning for first-time and repeat visitors." },
  { href: "/red-rocks/trading-post-trail", tag: "Trail Focus", title: "Trading Post Trail", copy: "A practical route profile with pacing notes." },
  { href: "/red-rocks/geology", tag: "Geology", title: "Why the Rocks Are Red", copy: "Fountain Formation and Front Range uplift context." },
  { href: "/red-rocks/wildlife", tag: "Wildlife", title: "Wildlife Guide", copy: "What you may see and how to observe safely." },
  { href: "/red-rocks/best-time-to-arrive", tag: "Timing", title: "Best Time to Arrive", copy: "Arrival windows by lot, stairs, and show-night timing." },
  { href: "/red-rocks/camping-nearby", tag: "Camping", title: "Camping Nearby", copy: "Where to stay and how to separate lodging from transport." },
  { href: "/red-rocks/transportation", tag: "Transportation", title: "How To Get To Red Rocks", copy: "Ride planning and post-show pickup details." },
  { href: "/red-rocks/map", tag: "Interactive", title: "Red Rocks Map", copy: "Trails, seating, geology, parking, and pickup points." },
  { href: "/red-rocks/faq", tag: "FAQ", title: "Red Rocks FAQ", copy: "High-intent answers for planning and logistics." },
] as const;

const CATEGORY_META = {
  transportation: { label: "Transportation", copy: "Getting there, pickup planning, and the ride back after the show." },
  concerts: { label: "Concerts", copy: "Show-night planning, seating, and concert basics." },
  hiking: { label: "Hiking", copy: "Trail pages with route notes and planning basics." },
  geology: { label: "Geology", copy: "Formation and history pages for Red Rocks." },
  wildlife: { label: "Wildlife", copy: "Nature pages covering birds, plants, and safety basics." },
  visiting: { label: "Visiting", copy: "General planning pages including timing, weather, and nearby camping." },
} as const;

export default async function RedRocksHubPage({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;
  const faqRows = await getFaqRowsWithGlobal("red-rocks/hub.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);

  const touristAttractionJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: "Red Rocks Amphitheatre",
    description:
      "Natural sandstone amphitheatre in Morrison, Colorado known for concerts, trail access, and geologic landmarks.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Morrison",
      addressRegion: "CO",
      addressCountry: "US",
    },
    url: `${SITE}/red-rocks`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
    ],
  };

  return (
    <main className="brand-page px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-[var(--brand-max-page)]">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(touristAttractionJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        {faqRows.length > 0 ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        ) : null}

        <PageHero
          kicker="Red Rocks Guide"
          title="Plan Your Red Rocks Night"
          description="Start with the decisions that shape the whole night: how you are getting in, when you should arrive, where your group will regroup, and what to do after the show."
          secondaryDescription="Use the guide hub below to jump straight into parking, transportation, concerts, trails, geology, and the practical Red Rocks details people usually scramble to figure out too late."
          actions={[
            {
              href: buildBookingHref({
                target: "book",
                venue: "red-rocks-amphitheatre",
                searchParams: sp,
              }),
              label: "Book Shuttle",
            },
            { href: "/week/red-rocks", label: "This Week at Red Rocks", variant: "secondary" },
            { href: "/venues/red-rocks-amphitheatre", label: "Venue Schedule", variant: "secondary" },
          ]}
        />

        <section className="brand-card mt-6 rounded-[28px] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.34)] sm:p-7">
          <div className="brand-kicker text-[12px] sm:text-[13px] font-black uppercase tracking-[0.22em]">Featured Jam Event</div>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white">
            Phish at Folsom Field 2026
          </h2>
          <p className="mt-3 max-w-[48rem] text-sm leading-7 text-white/72 sm:text-base">
            Dates, transportation options, and planning details for the Boulder run.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/phish-folsom"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-5 py-3 text-[12px] font-black uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 hover:bg-white/10 hover:no-underline"
            >
              View Event Guide
            </Link>
            <Link
              href="/dead-and-company-red-rocks"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-5 py-3 text-[12px] font-black uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 hover:bg-white/10 hover:no-underline"
            >
              Dead & Company Guide
            </Link>
            <Link
              href={buildBookingHref({
                target: "book",
                venue: "red-rocks-amphitheatre",
                searchParams: sp,
              })}
              className="brand-button-primary inline-flex min-h-12 items-center justify-center px-5 py-3 text-[12px] font-black uppercase tracking-[0.18em]"
            >
              Book Ride
            </Link>
          </div>
        </section>

        <CardGrid className="lg:grid-cols-3">
          <article className="brand-card rounded-[26px] p-6">
            <div className="brand-kicker text-[12px] sm:text-[13px] font-black uppercase tracking-[0.2em]">Start Here</div>
            <p className="mt-3 text-sm leading-7 text-white/74">
              Concert nights usually start with parking, transportation, and timing. Daytime visits usually start with trails,
              geology, and weather.
            </p>
          </article>
          <article className="brand-card rounded-[26px] p-6">
            <div className="brand-kicker text-[12px] sm:text-[13px] font-black uppercase tracking-[0.2em]">If You&apos;re Riding</div>
            <p className="mt-3 text-sm leading-7 text-white/74">
              Book before show night so pickup instructions and the return ride are already handled before the venue gets crowded.
            </p>
          </article>
          <article className="brand-card rounded-[26px] p-6">
            <div className="brand-kicker text-[12px] sm:text-[13px] font-black uppercase tracking-[0.2em]">If You&apos;re Coordinating</div>
            <p className="mt-3 text-sm leading-7 text-white/74">
              Give your full group one arrival time, one regroup point, and one clear plan for getting home after the show.
            </p>
          </article>
        </CardGrid>

        <CardGrid className="md:grid-cols-2 xl:grid-cols-3">
          {clusterLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="brand-card block rounded-[26px] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.38)] hover:no-underline"
            >
              <div className="brand-kicker text-[12px] sm:text-[13px] font-black uppercase tracking-[0.22em]">{link.tag}</div>
              <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white">
                {link.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/72 sm:text-base">
                {link.copy}
              </p>
            </Link>
          ))}
        </CardGrid>

        <section className="brand-card mt-6 rounded-[28px] p-6 sm:p-7">
          <div className="brand-kicker text-[12px] sm:text-[13px] font-black uppercase tracking-[0.22em]">Pages By Category</div>
          <p className="mt-3 text-sm leading-7 text-white/72 sm:text-base">
            Browse the Red Rocks pages by topic.
          </p>
          <div className="mt-5 grid gap-4">
            {Object.entries(CATEGORY_META).map(([category, meta]) => {
              const pages = RED_ROCKS_ENTITIES.filter((p) => p.category === category);
              return (
                <article key={category} className="rounded-[24px] border border-white/10 bg-black/15 p-5">
                  <div className="brand-kicker text-[12px] sm:text-[13px] font-black uppercase tracking-[0.2em]">{meta.label}</div>
                  <p className="mt-3 text-sm leading-7 text-white/70 sm:text-base">
                    {meta.copy}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {pages.map((entity) => (
                      <Link
                        key={entity.slug}
                        href={`/red-rocks/${entity.slug}`}
                        className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white/10 hover:no-underline"
                      >
                        {entity.title}
                      </Link>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <PrimaryCTASection
          kicker="Planning Priorities"
          body="Keep the night simple: get there on time, use one regroup point, and lock the return plan in before the venue empties out."
          actions={[
            {
              href: buildBookingHref({
                target: "book",
                venue: "red-rocks-amphitheatre",
                searchParams: sp,
              }),
              label: "Reserve a Ride",
            },
            { href: "/red-rocks/transportation", label: "Transportation Guide", variant: "secondary" },
            { href: "/week/red-rocks", label: "Browse Shows", variant: "secondary" },
          ]}
        >
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <article className="rounded-[22px] border border-white/10 bg-black/15 p-5">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">Timing First</h3>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Arrival time shapes parking, walking distance, and how rushed the night feels before you even get through the gate.
              </p>
            </article>
            <article className="rounded-[22px] border border-white/10 bg-black/15 p-5">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">One Return Plan</h3>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Make sure your group knows when to leave, where to regroup, and how you are getting home after the show.
              </p>
            </article>
            <article className="rounded-[22px] border border-white/10 bg-black/15 p-5">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">Book Early</h3>
              <p className="mt-3 text-sm leading-7 text-white/70">
                When you are ready to ride instead of drive, lock it in before show night so pickup details are already settled.
              </p>
            </article>
          </div>
        </PrimaryCTASection>

        <FAQBlock title="Red Rocks Hub FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
