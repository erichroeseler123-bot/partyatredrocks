import type { Metadata } from "next";
import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";
import { RED_ROCKS_ENTITIES } from "@/lib/redRocksAuthority";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";
const DEFAULT_OG_IMAGE =
  `${SITE}/api/unsplash-image?q=red+rocks+amphitheatre+concert+night+denver+colorado&src=%2Fhero%2Fhero-home.jpg&alt=Red+Rocks+shuttle+transportation&w=1200&h=630`;

export const metadata: Metadata = {
  title: "Red Rocks Transportation Guide",
  description:
    "Red Rocks transportation guide with shuttle, rideshare, parking, pickup timing, and return planning for concert nights.",
  alternates: { canonical: `${SITE}/red-rocks/transportation` },
  openGraph: {
    title: "Red Rocks Transportation Guide",
    description:
      "Red Rocks transportation guide with shuttle, rideshare, parking, pickup timing, and return planning for concert nights.",
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
    title: "Red Rocks Transportation Guide",
    description:
      "Red Rocks transportation guide with shuttle, rideshare, parking, pickup timing, and return planning for concert nights.",
    images: [DEFAULT_OG_IMAGE],
  },
};

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
      "Red Rocks transportation guide with shuttle, rideshare, parking, pickup timing, and return planning for concert nights.",
    url: `${SITE}/red-rocks/transportation`,
    mainEntityOfPage: `${SITE}/red-rocks/transportation`,
    author: { "@type": "Organization", name: "Party at Red Rocks" },
    publisher: { "@id": `${SITE}/#organization` },
    about: [
      { "@type": "Place", name: "Red Rocks Amphitheatre", url: `${SITE}/venues/red-rocks-amphitheatre` },
      { "@type": "Service", name: "Red Rocks shuttle transportation", url: `${SITE}/book/red-rocks-amphitheatre/custom/shared` },
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

        <section className="brand-panel overflow-hidden rounded-[32px] px-6 py-8 shadow-[0_28px_90px_rgba(0,0,0,0.34)] sm:px-8 sm:py-10 lg:px-10">
          <div className="brand-kicker text-[11px] font-black uppercase tracking-[0.24em]">Transportation</div>
          <h1 className="mt-4 max-w-[12ch] text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
            How To Get To Red Rocks
          </h1>
          <p className="mt-4 max-w-[58rem] text-base leading-7 text-white/78 sm:text-lg">
            Red Rocks transportation usually comes down to three choices: drive and park, use rideshare, or book a shuttle or
            private ride in advance. The best option depends on your group size, timing, and how much certainty you want after
            the show.
          </p>
          <p className="mt-3 max-w-[54rem] text-sm leading-7 text-white/64 sm:text-base">
            Red Rocks is different from a downtown arena. Traffic builds before doors, walking can be steep, and the rush after
            the encore happens fast. If you know how you are getting in and out before show night, the whole evening is easier.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              className="brand-button-primary brand-button-pulse inline-flex min-h-12 items-center justify-center px-6 py-3 text-[12px] font-black uppercase tracking-[0.2em]"
              href={buildBookingHref({
                target: "book",
                venue: "red-rocks-amphitheatre",
                searchParams: sp,
              })}
            >
              Book a Ride
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 py-3 text-[12px] font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5 hover:border-[var(--brand-border-strong)] hover:bg-white/10 hover:no-underline"
              href="/week/red-rocks"
            >
              Shows This Week
            </Link>
          </div>
        </section>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <article className="brand-card rounded-[26px] p-6">
            <div className="brand-kicker text-[10px] font-black uppercase tracking-[0.2em]">Drive + Park</div>
            <p className="mt-3 text-sm leading-7 text-white/74">
              Full control, but you take on parking strategy, stair load, and the slowest part of the night after the final song.
            </p>
          </article>
          <article className="brand-card rounded-[26px] p-6">
            <div className="brand-kicker text-[10px] font-black uppercase tracking-[0.2em]">Rideshare</div>
            <p className="mt-3 text-sm leading-7 text-white/74">
              Sometimes workable on lighter nights, but the least predictable option when a sold-out crowd all heads out together.
            </p>
          </article>
          <article className="brand-card rounded-[26px] p-6">
            <div className="brand-kicker text-[10px] font-black uppercase tracking-[0.2em]">Shuttle or Private Ride</div>
            <p className="mt-3 text-sm leading-7 text-white/74">
              The clearest plan before the night starts, especially when you want fixed pricing, one pickup point, and a guaranteed ride back.
            </p>
          </article>
        </div>

        <section className="brand-card mt-6 rounded-[28px] p-6 sm:p-7">
          <div className="brand-kicker text-[10px] font-black uppercase tracking-[0.22em]">Arrival and Return Timing</div>
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

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Link
            href="/red-rocks/transportation/shuttle-vs-uber"
            className="brand-card block rounded-[26px] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.38)] hover:no-underline"
          >
            <div className="brand-kicker text-[10px] font-black uppercase tracking-[0.22em]">Compare</div>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white">Shuttle vs Uber at Red Rocks</h2>
            <p className="mt-3 text-sm leading-7 text-white/72">Cost and reliability comparison with post-show risk notes.</p>
          </Link>
          <Link
            href="/red-rocks/transportation/parking-reality"
            className="brand-card block rounded-[26px] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.38)] hover:no-underline"
          >
            <div className="brand-kicker text-[10px] font-black uppercase tracking-[0.22em]">Parking</div>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white">Parking Reality</h2>
            <p className="mt-3 text-sm leading-7 text-white/72">Ingress, lot tradeoffs, stair load, and exit bottlenecks.</p>
          </Link>
          <Link
            href="/red-rocks/transportation/post-show-pickup"
            className="brand-card block rounded-[26px] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.38)] hover:no-underline"
          >
            <div className="brand-kicker text-[10px] font-black uppercase tracking-[0.22em]">Pickup</div>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white">Post-Show Pickup Strategy</h2>
            <p className="mt-3 text-sm leading-7 text-white/72">How to avoid regroup failures when crowds surge at close.</p>
          </Link>
        </div>

        <section className="brand-card mt-6 rounded-[28px] p-6 sm:p-7">
          <div className="brand-kicker text-[10px] font-black uppercase tracking-[0.22em]">Before Show Night</div>
          <ul className="mt-4 grid gap-3 text-sm leading-7 text-white/72 sm:text-base">
            <li>Decide how your group is getting to Red Rocks before the day of the show.</li>
            <li>Set one meeting point for the ride in and one meeting point for the ride back.</li>
            <li>Keep everyone on the same text thread.</li>
            <li>Allow extra time for traffic, stairs, and security.</li>
            <li>Check the weather and bring layers that match the walk in and out.</li>
          </ul>
        </section>

        <section className="brand-card mt-6 rounded-[28px] p-6 sm:p-7">
          <div className="brand-kicker text-[10px] font-black uppercase tracking-[0.22em]">More Red Rocks Guides</div>
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
          <div className="brand-kicker text-[10px] font-black uppercase tracking-[0.22em]">More Transportation Topics</div>
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
