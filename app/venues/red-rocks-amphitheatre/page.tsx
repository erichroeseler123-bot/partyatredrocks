import Link from "next/link";
import { getRedRocksEvents } from "@/lib/redrocksEvents";
import RedRocksShowsGrid from "@/components/RedRocksShowsGrid";
import FAQBlock from "@/components/FAQBlock";
import MusicWave from "@/components/MusicWave";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";
import { buildBookingHref, type HandoffSearchParams } from "@/lib/parrHandoff";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

type SP = HandoffSearchParams;

function first(sp: SP, key: string) {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

export default async function RedRocksPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
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
  const bookTarget = buildBookingHref({
    target: "book",
    venue: "red-rocks-amphitheatre",
    searchParams: sp,
  });

  return (
    <main className="comic-page pt-24 pb-10">
      <div className="comic-wrap">
        {faqRows.length > 0 ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        ) : null}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <header className="comic-hero mb-8">
          <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
  <Link href="/book?venue=red-rocks-amphitheatre" className="comic-btn comic-btn-primary mb-6 inline-flex">
    Book Shuttle to This Venue →
  </Link>
            Red Rocks Amphitheatre
          </h1>
          <p className="text-muted max-w-2xl">
            Morrison, CO · Live events pulled from SeatGeek · Venue ID 196
          </p>
          <div style={{ marginTop: 18 }}>
            <MusicWave bars={24} />
          </div>
        </header>

        {/* Prefill banner (only shows when params exist) */}
        {(pickup || date || qty) ? (
          <section className="comic-panel p-6 mb-8">
            <div className="text-[11px] font-black uppercase tracking-[.22em] text-white/60">
              Booking Prefill
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {pickup ? (
                <span className="pill px-4 py-2 text-white/85">
                  Pickup: <span className="text-white/95 font-black">{pickup}</span>
                </span>
              ) : null}
              {date ? (
                <span className="pill px-4 py-2 text-white/85">
                  Date: <span className="text-white/95 font-black">{date}</span>
                </span>
              ) : null}
              {qty ? (
                <span className="pill px-4 py-2 text-white/85">
                  Party: <span className="text-white/95 font-black">{qty}</span>
                </span>
              ) : null}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link className="comic-btn comic-btn-primary" href={bookTarget}>
                Continue to booking
              </Link>
              <Link className="comic-btn comic-btn-secondary" href="/book?venue=red-rocks-amphitheatre">
                Change destination
              </Link>
            </div>

            <div className="mt-3 text-xs text-white/55">
              Tip: if your device shows “mm/dd/yyyy” for date inputs, that’s just the browser UI.
              We still pass an ISO date (YYYY-MM-DD) when selected.
            </div>
          </section>
        ) : (
          <section className="comic-panel p-6 mb-8">
            <div className="text-[11px] font-black uppercase tracking-[.22em] text-white/60">
              Booking
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link className="comic-btn comic-btn-primary" href="/book?venue=red-rocks-amphitheatre">
                Start booking
              </Link>
              <Link className="comic-btn comic-btn-secondary" href="/week">
                See events this week
              </Link>
            </div>
          </section>
        )}

        <section>
          <h2 className="text-3xl font-bold mb-8">Upcoming Shows</h2>
          <RedRocksShowsGrid events={events} />
        </section>

        <section className="comic-grid mt-8">
          <Link href="/guide/logistics/parking-lots" className="comic-panel block">
            <div className="comic-tag">Guide</div>
            <h3 className="comic-h3">Red Rocks Parking Guide</h3>
            <p className="comic-copy">Lot strategy, walking cost, and exit tradeoffs.</p>
          </Link>
          <Link href="/guide/transportation/shuttle-vs-uber" className="comic-panel block">
            <div className="comic-tag">Guide</div>
            <h3 className="comic-h3">Shuttle vs Uber</h3>
            <p className="comic-copy">Side-by-side reliability and post-show risk comparison.</p>
          </Link>
          <Link href="/venues/mission-ballroom" className="comic-panel block">
            <div className="comic-tag">Venue</div>
            <h3 className="comic-h3">Mission Ballroom</h3>
            <p className="comic-copy">Compare another high-demand Denver venue logistics profile.</p>
          </Link>
          <Link href="/venues/fiddlers-green-amphitheatre" className="comic-panel block">
            <div className="comic-tag">Venue</div>
            <h3 className="comic-h3">Fiddler&apos;s Green</h3>
            <p className="comic-copy">Cross-venue amphitheatre pickup and exit strategy reference.</p>
          </Link>
        </section>

        <FAQBlock title="Red Rocks Venue FAQ" rows={faqRows} />
      </div>
    </main>
  );
}
