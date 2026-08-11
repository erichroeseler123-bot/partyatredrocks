import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import CardGrid from "@/components/CardGrid";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";
import { GuideVisualHero } from "@/components/guide/GuideVisualHero";
import PrimaryCTASection from "@/components/PrimaryCTASection";
import { guideVisuals } from "@/lib/guideVisuals";
import { curatedImages } from "@/lib/curatedImages";
import { RED_ROCKS_ENTITIES } from "@/lib/redRocksAuthority";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";
const DEFAULT_OG_IMAGE = `${SITE}${curatedImages.guideTransportation}`;

export const metadata: Metadata = {
  title: "Red Rocks Transportation Guide | Private Rides, Uber & Parking",
  description:
    "Plan Red Rocks transportation with current private ride pricing, rideshare and parking tradeoffs, pickup timing, and return strategy.",
  alternates: { canonical: `${SITE}/red-rocks/transportation` },
  openGraph: {
    title: "Red Rocks Transportation Guide | Private Rides, Uber & Parking",
    description:
      "Plan Red Rocks transportation with current private ride pricing, rideshare and parking tradeoffs, pickup timing, and return strategy.",
    url: `${SITE}/red-rocks/transportation`,
    type: "article",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        alt: "Red Rocks transportation guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Rocks Transportation Guide | Private Rides, Uber & Parking",
    description:
      "Plan Red Rocks transportation with current private ride pricing, rideshare and parking tradeoffs, pickup timing, and return strategy.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const TRANSPORT_VISUALS = [
  {
    title: "Arrival Flow",
    body: "The first pressure point is getting up the hill before traffic and stair load stack.",
    imageSrc: curatedImages.guideTransportation,
    imageAlt: "Arrival approach and transportation planning for Red Rocks",
  },
  {
    title: "Private Ride",
    body: "Private Suburbans and vans work best when your group wants one coordinated pickup, no shared passengers, and one ride home.",
    imageSrc: curatedImages.privateSUV,
    imageAlt: "Private SUV transportation for Red Rocks groups",
  },
  {
    title: "Pickup Strategy",
    body: "Your return plan should be clear before the encore, not improvised in the lot after lights up.",
    imageSrc: curatedImages.guidePickup,
    imageAlt: "Post-show pickup planning for Red Rocks transportation",
  },
] as const;

const coreLinks = [
  { href: "/red-rocks", label: "Red Rocks Guide" },
  { href: "/red-rocks/transportation", label: "Transportation" },
  { href: "/red-rocks/parking", label: "Parking" },
  { href: "/red-rocks/faq", label: "FAQ" },
] as const;

export default async function RedRocksTransportationPage({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;
  const transportationEntities = RED_ROCKS_ENTITIES.filter((entity) => entity.category === "transportation");
  const faqRows = await getFaqRowsWithGlobal("red-rocks/transportation.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
      { "@type": "ListItem", position: 3, name: "Transportation", item: `${SITE}/red-rocks/transportation` },
    ],
  };
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Red Rocks Transportation Guide",
    description:
      "Red Rocks transportation guide covering current private rides, rideshare, parking, pickup timing, and return planning for concert nights.",
    url: `${SITE}/red-rocks/transportation`,
    mainEntityOfPage: `${SITE}/red-rocks/transportation`,
    author: { "@type": "Organization", name: "Party at Red Rocks" },
    publisher: { "@id": `${SITE}/#organization` },
    about: [
      { "@type": "Place", name: "Red Rocks Amphitheatre", url: `${SITE}/venues/red-rocks-amphitheatre` },
      { "@type": "Service", name: "Private Red Rocks transportation", url: `${SITE}/book/red-rocks-amphitheatre/private` },
    ],
  };

  return (
    <main className="brand-page px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-[var(--brand-max-page)]">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        {faqRows.length > 0 ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        ) : null}

        <GuideVisualHero
          eyebrow={guideVisuals.transportation.eyebrow}
          title="How To Get To Red Rocks"
          copy="Red Rocks transportation usually comes down to three choices: drive and park, use rideshare, or book private transportation in advance. Party at Red Rocks currently offers private service only: a $399 Suburban or $599 van, with door-to-door pickup and the same vehicle waiting through the show."
          imageSrc={guideVisuals.transportation.imageSrc}
          imageAlt={guideVisuals.transportation.imageAlt}
          actions={
            <>
              <Link
                href={buildBookingHref({
                  target: "private",
                  venue: "red-rocks-amphitheatre",
                  searchParams: sp,
                })}
                className="brand-button-primary brand-button-pulse inline-flex min-h-12 items-center justify-center px-6 py-3 text-[12px] font-black uppercase tracking-[0.2em]"
              >
                See Private Ride Options
              </Link>
              <Link href="/week/red-rocks" className="brand-button-secondary inline-flex min-h-12 items-center justify-center px-6 py-3 text-[12px] font-black uppercase tracking-[0.2em] hover:no-underline">
                Shows This Week
              </Link>
            </>
          }
        />

        <CardGrid className="lg:grid-cols-3">
          {TRANSPORT_VISUALS.map((item) => (
            <article key={item.title} className="brand-card overflow-hidden rounded-[26px]">
              <div className="relative aspect-[16/10] border-b border-white/10">
                <Image src={item.imageSrc} alt={item.imageAlt} fill className="object-cover" sizes="(min-width: 1024px) 30vw, 100vw" />
              </div>
              <div className="p-6">
                <div className="brand-kicker text-[12px] sm:text-[13px] font-black uppercase tracking-[0.2em]">{item.title}</div>
                <p className="mt-3 text-sm leading-7 text-white/74">{item.body}</p>
              </div>
            </article>
          ))}
        </CardGrid>

        <section className="brand-card mt-6 rounded-[28px] p-6 sm:p-7">
          <div className="brand-kicker text-[12px] sm:text-[13px] font-black uppercase tracking-[0.22em]">Arrival and Return Timing</div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <article className="rounded-[22px] border border-white/10 bg-black/15 p-5">
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-white">Arrive Early</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Late arrival usually means more traffic, worse parking, and a more rushed walk through security and the stairs.
              </p>
            </article>
            <article className="rounded-[22px] border border-white/10 bg-black/15 p-5">
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-white">Set One Regroup Point</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                The worst time to make a plan is after the encore. Set the meetup and return strategy before the show starts.
              </p>
            </article>
            <article className="rounded-[22px] border border-white/10 bg-black/15 p-5">
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-white">Build in Buffer</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                If anyone in your group is sensitive to stairs, altitude, or weather, add extra walking and transition time.
              </p>
            </article>
          </div>
        </section>

        <CardGrid className="lg:grid-cols-3">
          <Link
            href="/red-rocks/transportation/shuttle-vs-uber"
            className="brand-card block rounded-[26px] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.38)] hover:no-underline"
          >
            <div className="brand-kicker text-[12px] sm:text-[13px] font-black uppercase tracking-[0.22em]">Compare</div>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white">Private Ride vs Uber at Red Rocks</h2>
            <p className="mt-3 text-sm leading-7 text-white/72">Cost, coordination, and post-show reliability tradeoffs.</p>
          </Link>
          <Link
            href="/red-rocks/transportation/parking-reality"
            className="brand-card block rounded-[26px] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.38)] hover:no-underline"
          >
            <div className="brand-kicker text-[12px] sm:text-[13px] font-black uppercase tracking-[0.22em]">Parking</div>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white">Parking Reality</h2>
            <p className="mt-3 text-sm leading-7 text-white/72">Ingress, lot tradeoffs, stair load, and exit bottlenecks.</p>
          </Link>
          <Link
            href="/red-rocks/transportation/post-show-pickup"
            className="brand-card block rounded-[26px] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.38)] hover:no-underline"
          >
            <div className="brand-kicker text-[12px] sm:text-[13px] font-black uppercase tracking-[0.22em]">Pickup</div>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white">Post-Show Pickup Strategy</h2>
            <p className="mt-3 text-sm leading-7 text-white/72">How to avoid regroup failures when crowds surge at close.</p>
          </Link>
        </CardGrid>

        <PrimaryCTASection
          kicker="Before Show Night"
          body="Lock the transport plan in before the day of the show so your group is not improvising once doors open and the lots start moving."
          actions={[
            {
              href: buildBookingHref({
                target: "private",
                venue: "red-rocks-amphitheatre",
                searchParams: sp,
              }),
              label: "See Private Ride Options",
            },
            { href: "/red-rocks/parking", label: "Parking Guide", variant: "secondary" },
            { href: "/red-rocks/transportation/shuttle-vs-uber", label: "Private Ride vs Uber", variant: "secondary" },
          ]}
        >
          <ul className="mt-4 grid gap-3 text-sm leading-7 text-white/72 sm:text-base">
            <li>Decide how your group is getting to Red Rocks before the day of the show.</li>
            <li>Set one meeting point for the ride in and one meeting point for the ride back.</li>
            <li>Keep everyone on the same text thread.</li>
            <li>Allow extra time for traffic, stairs, and security.</li>
            <li>Check the weather and bring layers that match the walk in and out.</li>
          </ul>
        </PrimaryCTASection>

        <section className="brand-card mt-6 rounded-[28px] p-6 sm:p-7">
          <div className="brand-kicker text-[12px] sm:text-[13px] font-black uppercase tracking-[0.22em]">More Red Rocks Guides</div>
          <div className="mt-4 flex flex-wrap gap-3">
            {coreLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white/10 hover:no-underline"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="brand-card mt-6 rounded-[28px] p-6 sm:p-7">
          <div className="brand-kicker text-[12px] sm:text-[13px] font-black uppercase tracking-[0.22em]">More Transportation Topics</div>
          <div className="mt-4 flex flex-wrap gap-3">
            {transportationEntities.map((entity) => (
              <Link
                key={entity.slug}
                href={`/red-rocks/${entity.slug}`}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white/10 hover:no-underline"
              >
                {entity.title}
              </Link>
            ))}
          </div>
        </section>

        <FAQBlock title="Red Rocks Transportation FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
