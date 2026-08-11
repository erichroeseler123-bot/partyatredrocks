import Link from "next/link";
import Image from "next/image";
import { getRedRocksEvents } from "@/lib/redrocksEvents";
import RedRocksShowsGrid from "@/components/RedRocksShowsGrid";
import FAQBlock from "@/components/FAQBlock";
import MusicWave from "@/components/MusicWave";
import { UnsplashImg } from "@/components/UnsplashImg";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";
import { buildBookingHref, type HandoffSearchParams } from "@/lib/parrHandoff";
import { getVenueMedia, getVenueRelatedCardImage } from "@/data/media";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

type SP = HandoffSearchParams;

type RelatedCard = {
  href: string;
  label: string;
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
};

function first(sp: SP, key: string) {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

export default async function RedRocksPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const faqRows = await getFaqRowsWithGlobal("venues/red-rocks-amphitheatre.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Venues", item: `${SITE}/venues` },
      { "@type": "ListItem", position: 3, name: "Red Rocks Amphitheatre", item: `${SITE}/venues/red-rocks-amphitheatre` },
    ],
  };

  const pickup = first(sp, "pickup") || "";
  const date = first(sp, "date") || "";
  const qty = first(sp, "qty") || "";
  const events = await getRedRocksEvents(2026);
  const bookTarget = buildBookingHref({ target: "private", venue: "red-rocks-amphitheatre", searchParams: sp });
  const venueMedia = getVenueMedia("red-rocks-amphitheatre");

  const relatedTransportCards: RelatedCard[] = [
    {
      href: "/book/red-rocks-amphitheatre/private",
      label: "Transport",
      title: "Private Suburban — $399",
      body: "Private round-trip Red Rocks transportation with door-to-door service and your vehicle waiting through the show.",
      ...getVenueRelatedCardImage({ intent: "transport", transportKey: "fleet" }),
    },
    {
      href: "/book/red-rocks-amphitheatre/private",
      label: "Transport",
      title: "Private Van — $599",
      body: "Private van upgrade for larger groups that want one vehicle and one concert-night plan from pickup through the ride home.",
      ...getVenueRelatedCardImage({ intent: "transport", transportKey: "fleet" }),
    },
  ];

  const relatedGuideCards: RelatedCard[] = [
    {
      href: "/guide/logistics/parking-lots",
      label: "Guide",
      title: "Red Rocks Parking Guide",
      body: "Lot strategy, walking cost, and exit tradeoffs.",
      ...getVenueRelatedCardImage({ intent: "guide", slug: "parking-reality" }),
    },
    {
      href: "/red-rocks/transportation/shuttle-vs-uber",
      label: "Guide",
      title: "Private Ride vs Uber",
      body: "Compare price certainty, pickup planning, and post-show reliability.",
      ...getVenueRelatedCardImage({ intent: "guide", slug: "transportation-guide" }),
    },
  ];

  const relatedVenueCards: RelatedCard[] = [
    {
      href: "/venues/mission-ballroom",
      label: "Venue",
      title: "Mission Ballroom",
      body: "Compare another high-demand Denver venue logistics profile.",
      ...getVenueRelatedCardImage({ intent: "venue", slug: "mission-ballroom" }),
    },
    {
      href: "/venues/fiddlers-green-amphitheatre",
      label: "Venue",
      title: "Fiddler's Green",
      body: "Cross-venue amphitheatre pickup and exit strategy reference.",
      ...getVenueRelatedCardImage({ intent: "venue", slug: "fiddlers-green-amphitheatre" }),
    },
  ];

  const renderRelatedCard = (card: RelatedCard) => (
    <Link key={`${card.label}-${card.href}-${card.title}`} href={card.href} className="comic-panel block overflow-hidden">
      <UnsplashImg src={card.imageSrc} query={`${card.title} red rocks`} alt={card.imageAlt} className="mb-4 h-40 w-full rounded-xl border border-white/20 object-cover" width={640} height={320} loading="lazy" decoding="async" />
      <div className="comic-tag">{card.label}</div>
      <h3 className="comic-h3">{card.title}</h3>
      <p className="comic-copy">{card.body}</p>
    </Link>
  );

  return (
    <main className="comic-page pt-24 pb-10">
      <div className="comic-wrap">
        {faqRows.length > 0 ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} /> : null}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <header className="relative mb-8 overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="absolute inset-0">
            <Image src={venueMedia.hero} alt="Red Rocks Amphitheatre crowd and venue lights at night" fill className="object-cover object-center opacity-32" priority sizes="(min-width: 1280px) 1240px, 100vw" />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(5,8,22,0.88)_0%,rgba(5,8,22,0.58)_45%,rgba(5,8,22,0.92)_100%)]" />
          </div>
          <div className="relative max-w-4xl">
            <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Venue Guide</div>
            <h1 className="mt-5 text-5xl font-black tracking-tight text-white md:text-6xl">Red Rocks Amphitheatre</h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/78 sm:text-lg">
              Morrison, CO. Live event schedule, private ride planning, venue logistics, and direct booking for Red Rocks concert nights.
            </p>
            <p className="mt-3 text-sm text-white/62">Private Suburban $399 · Private van $599 · Door-to-door · Vehicle waits through the show</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={bookTarget} className="comic-btn comic-btn-primary">Book Private Ride →</Link>
              <Link href="/week/red-rocks" className="comic-btn comic-btn-secondary">This Week at Red Rocks</Link>
            </div>
            <div style={{ marginTop: 18 }}><MusicWave bars={24} /></div>
          </div>
        </header>

        {(pickup || date || qty) ? (
          <section className="comic-panel p-6 mb-8">
            <div className="text-[11px] font-black uppercase tracking-[.22em] text-white/60">Booking Prefill</div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {pickup ? <span className="pill px-4 py-2 text-white/85">Pickup: <span className="text-white/95 font-black">{pickup}</span></span> : null}
              {date ? <span className="pill px-4 py-2 text-white/85">Date: <span className="text-white/95 font-black">{date}</span></span> : null}
              {qty ? <span className="pill px-4 py-2 text-white/85">Party: <span className="text-white/95 font-black">{qty}</span></span> : null}
            </div>
            <div className="mt-5 flex flex-wrap gap-3"><Link className="comic-btn comic-btn-primary" href={bookTarget}>Continue to private ride</Link></div>
          </section>
        ) : (
          <section className="comic-panel p-6 mb-8">
            <div className="text-[11px] font-black uppercase tracking-[.22em] text-white/60">Private Transportation</div>
            <p className="mt-3 text-sm text-white/70">Choose the $399 Suburban or $599 private van for a planned round trip to Red Rocks.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link className="comic-btn comic-btn-primary" href={bookTarget}>See Private Ride Options</Link>
              <Link className="comic-btn comic-btn-secondary" href="/week/red-rocks">See events this week</Link>
            </div>
          </section>
        )}

        <section>
          <h2 className="text-3xl font-bold mb-8">Upcoming Shows</h2>
          <RedRocksShowsGrid events={events} />
        </section>

        <section className="mt-8 space-y-6">
          <div><div className="comic-tag">Related transport</div><div className="comic-grid mt-3">{relatedTransportCards.map(renderRelatedCard)}</div></div>
          <div><div className="comic-tag">Related guides</div><div className="comic-grid mt-3">{relatedGuideCards.map(renderRelatedCard)}</div></div>
          <div><div className="comic-tag">Related venues</div><div className="comic-grid mt-3">{relatedVenueCards.map(renderRelatedCard)}</div></div>
        </section>

        <FAQBlock title="Red Rocks Venue FAQ" rows={faqRows} />
      </div>
    </main>
  );
}
