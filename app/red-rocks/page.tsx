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
import { PARR_COMPLETE_TOTAL_DISCLOSURE } from "@/lib/pricing";
import {
  SUBURBAN_ALL_IN_TOTAL_LABEL,
  SUBURBAN_ITEMIZED_LABEL,
  VAN_ALL_IN_TOTAL_LABEL,
  VAN_ITEMIZED_LABEL,
} from "@/lib/rideCatalog";

const SITE = "https://www.partyatredrocks.com";
const DEFAULT_OG_IMAGE = `${SITE}/hero/hero_red_rocks.webp`;

export const metadata: Metadata = {
  title: "Red Rocks Amphitheatre Guide | Concerts, Tailgating, Parking & Private Rides",
  description:
    `Complete Red Rocks Amphitheatre visitor and concert guide: 2027 concert schedule, Upper North Lot tailgating, parking vs. private transportation (${SUBURBAN_ALL_IN_TOTAL_LABEL} Suburban total / ${VAN_ALL_IN_TOTAL_LABEL} Van total, including 4% Booking fee), weather prep, and trails.`,
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: `${SITE}/red-rocks` },
  openGraph: {
    title: "Red Rocks Amphitheatre Guide | Concerts, Tailgating, Parking & Rides",
    description:
      `Plan your Red Rocks concert night or daytime park visit: 2027 lineup, Upper North Lot tailgating, parking lots, weather at 6,450 ft, and private group rides.`,
    url: `${SITE}/red-rocks`,
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        alt: "Red Rocks Amphitheatre illuminated sandstone monoliths at night",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Rocks Amphitheatre Guide | Concerts, Tailgating & Private Rides",
    description:
      "Parking lots, Upper North Lot tailgating, 6,450-ft weather layering, 2027 concert dates, and private round-trip rides from Denver & Golden.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const clusterLinks = [
  { href: "/red-rocks/concerts", tag: "2027 Lineup", title: "Red Rocks Concert Schedule", copy: "Official 2027 concert calendar by month with one-click private vehicle booking." },
  { href: "/red-rocks/what-to-wear", tag: "Weather Prep", title: "What to Wear at Red Rocks", copy: "Month-by-month layering guide for 6,450-ft sunset temperature drops and wind." },
  { href: "/red-rocks/parking", tag: "Lots & Stairs", title: "Parking & Lot Guide", copy: "Upper North vs. Upper South vs. Lower South stairs, arrival windows, and exit speed." },
  { href: "/red-rocks/post-concert-exit-guide", tag: "Exit Plan", title: "Post-Concert Exit Guide", copy: "How to avoid the Jurassic Lot bottleneck and regroup cleanly after the encore." },
  { href: "/red-rocks/transportation", tag: "Compare", title: "How to Get to Red Rocks", copy: "Side-by-side tradeoffs between private SUVs/vans, self-driving, and rideshare." },
  { href: "/red-rocks/seating-chart", tag: "Rows 1–70", title: "Seating Chart & Views", copy: "Sound sweet spots, stair count from each entrance, and accessible row options." },
  { href: "/red-rocks/weather", tag: "Forecast", title: "Mountain Weather Guide", copy: "Rain-or-shine policy, lightning delays, and keeping dry gear in your vehicle." },
  { href: "/red-rocks/visiting-guide", tag: "Daytime", title: "Daytime Visiting Guide", copy: "Park hours, Trading Post access, pre-show closures, and altitude hydration." },
  { href: "/red-rocks/hiking-trails", tag: "Trails", title: "Hiking Trails", copy: "Trading Post Trail and Geological Overlook profiles before show doors." },
  { href: "/red-rocks/geology", tag: "Geology", title: "Why the Rocks Are Red", copy: "300-million-year Fountain Formation sandstone history behind Creation & Ship Rock." },
  { href: "/red-rocks/map", tag: "Interactive", title: "Red Rocks Map", copy: "Lot layouts, Upper North tailgate zone, entrances, and stair connections." },
  { href: "/red-rocks/faq", tag: "Answers", title: "Red Rocks FAQ", copy: "Direct answers on bag sizes, tailgating rules, pickup windows, and return rides." },
] as const;

const CATEGORY_META = {
  transportation: { label: "Transportation & Exit Strategy", copy: "Getting from Denver, Golden, or Boulder to Morrison—and getting home without surge chaos." },
  concerts: { label: "Concert Night Planning", copy: "Seating rows, arrival timing, dress code, and first-timer essentials." },
  visiting: { label: "Weather, Timing & Nearby Stays", copy: "Seasonal conditions at 6,450 feet, arrival windows, and foothills lodging." },
  hiking: { label: "Daytime Trails", copy: "Morning and early-afternoon hikes inside Red Rocks Park." },
  geology: { label: "Sandstone Geology", copy: "How Ship Rock, Creation Rock, and Stage Rock formed." },
  wildlife: { label: "Foothills Wildlife", copy: "Mule deer, raptors, and trail etiquette in Morrison." },
} as const;

export default async function RedRocksHubPage({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;
  const privateBookingHref = buildBookingHref({
    target: "private",
    venue: "red-rocks-amphitheatre",
    searchParams: sp,
  });
  const faqRows = await getFaqRowsWithGlobal("red-rocks/hub.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);

  const touristAttractionJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: "Red Rocks Amphitheatre",
    description:
      "Open-air sandstone amphitheatre at 6,450 feet in Morrison, Colorado renowned for live concerts, Upper North Lot tailgating, and foothills trails.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "18300 W Alameda Pkwy",
      addressLocality: "Morrison",
      addressRegion: "CO",
      postalCode: "80465",
      addressCountry: "US",
    },
    url: `${SITE}/red-rocks`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks Guide", item: `${SITE}/red-rocks` },
    ],
  };

  return (
    <main className="brand-page px-4 pb-16 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-[var(--brand-max-page)]">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(touristAttractionJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        {faqRows.length > 0 ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        ) : null}

        <PageHero
          kicker="Morrison, CO · 6,450 Feet"
          title="The Practical Red Rocks Concert & Visitor Guide"
          description="Everything that shapes a great Red Rocks night: when to leave Denver, how Upper North Lot tailgating works, what to pack for mountain weather swings, and how to get your group home smoothly after the encore."
          secondaryDescription={`Want the easiest group plan? Reserve a dedicated Private Suburban (${SUBURBAN_ALL_IN_TOTAL_LABEL} total: ${SUBURBAN_ITEMIZED_LABEL}, up to 6) or Private Van (${VAN_ALL_IN_TOTAL_LABEL} total: ${VAN_ITEMIZED_LABEL}, up to 10) with chairs, cooler, speaker, ice, and a driver who waits through the show. ${PARR_COMPLETE_TOTAL_DISCLOSURE}`}
          actions={[
            {
              href: privateBookingHref,
              label: `Book Private Ride (${SUBURBAN_ALL_IN_TOTAL_LABEL} / ${VAN_ALL_IN_TOTAL_LABEL} total)`,
            },
            { href: "/red-rocks/concerts", label: "2027 Concert Schedule", variant: "secondary" },
            { href: "/venues/red-rocks-amphitheatre", label: "Venue Overview", variant: "secondary" },
          ]}
        />

        <section className="brand-card mt-6 rounded-[28px] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.34)] sm:p-8">
          <div className="brand-kicker text-[12px] font-black uppercase tracking-[0.22em]">
            First-Timer Reality Check
          </div>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
            Four Things Every Group Should Know Before Heading Up the Canyon
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-2xl border border-white/10 bg-black/25 p-5">
              <h3 className="text-base font-black uppercase tracking-tight text-[#ffb07c]">1. Upper North Is Prime</h3>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Upper North Lot sits closest to the top ramp and hosts Red Rocks&apos; best pre-show tailgating scene—arrive 90–120 minutes before doors.
              </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-black/25 p-5">
              <h3 className="text-base font-black uppercase tracking-tight text-[#ffb07c]">2. Dress for a 20°F Drop</h3>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Morrison sits nearly 1,200 feet above downtown Denver. Even warm July evenings turn breezy once the sun drops behind the foothills.
              </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-black/25 p-5">
              <h3 className="text-base font-black uppercase tracking-tight text-[#ffb07c]">3. Single-Pocket Bags Only</h3>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Multi-pocket backpacks get turned away at security. A waiting private vehicle gives your group locked storage for coolers and extra layers.
              </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-black/25 p-5">
              <h3 className="text-base font-black uppercase tracking-tight text-[#ffb07c]">4. Solve the Exit Early</h3>
              <p className="mt-2 text-sm leading-6 text-white/75">
                9,525 fans leave at once after the encore. Having your own driver staged on-site beats hiking a mile to the Jurassic rideshare lot.
              </p>
            </article>
          </div>
        </section>

        <CardGrid className="md:grid-cols-2 xl:grid-cols-3">
          {clusterLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="brand-card block rounded-[26px] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.38)] hover:no-underline"
            >
              <div className="brand-kicker text-[12px] font-black uppercase tracking-[0.22em]">{link.tag}</div>
              <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white">{link.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/75 sm:text-base">{link.copy}</p>
            </Link>
          ))}
        </CardGrid>

        <section className="brand-card mt-6 rounded-[28px] p-6 sm:p-7">
          <div className="brand-kicker text-[12px] font-black uppercase tracking-[0.22em]">Complete Topic Library</div>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white">
            Explore Red Rocks Guides by Topic
          </h2>
          <div className="mt-5 grid gap-4">
            {Object.entries(CATEGORY_META).map(([category, meta]) => {
              const pages = RED_ROCKS_ENTITIES.filter((p) => p.category === category);
              return (
                <article key={category} className="rounded-[24px] border border-white/10 bg-black/15 p-5">
                  <h3 className="brand-kicker text-[13px] font-black uppercase tracking-[0.2em]">{meta.label}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/72 sm:text-base">{meta.copy}</p>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {pages.map((entity) => (
                      <Link
                        key={entity.slug}
                        href={`/red-rocks/${entity.slug}`}
                        className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/12 hover:no-underline"
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
          kicker="Private Group Rides"
          body={`Private round-trip transportation with pickup, Upper North Lot tailgating time, chairs, cooler, speaker and ice, your driver waiting through the show, and the return ride—${SUBURBAN_ALL_IN_TOTAL_LABEL} Suburban total (${SUBURBAN_ITEMIZED_LABEL}) or ${VAN_ALL_IN_TOTAL_LABEL} Van total (${VAN_ITEMIZED_LABEL}). ${PARR_COMPLETE_TOTAL_DISCLOSURE}`}
          actions={[
            {
              href: privateBookingHref,
              label: "Choose Your Private Vehicle",
            },
            { href: "/red-rocks/concerts", label: "2027 Concert Calendar", variant: "secondary" },
            { href: "/guide/tailgating", label: "Tailgating Guide", variant: "secondary" },
          ]}
        />

        <FAQBlock title="Red Rocks Planning FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
