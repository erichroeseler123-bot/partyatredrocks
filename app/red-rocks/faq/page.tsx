import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks FAQ",
  description:
    "Red Rocks FAQ covering concerts, hiking, parking, transportation, and practical trip planning.",
  alternates: { canonical: "/red-rocks/faq" },
};

export default async function RedRocksFaqPage({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;
  const faqRows = await getFaqRowsWithGlobal("red-rocks/faq.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
      { "@type": "ListItem", position: 3, name: "FAQ", item: `${SITE}/red-rocks/faq` },
    ],
  };

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <div className="comic-hero">
          <div className="comic-kicker">FAQ</div>
          <h1 className="comic-title">Red Rocks FAQ</h1>
          <p className="comic-copy">
            This page answers common questions about visiting Red Rocks, including parking, transportation, hiking, weather, and
            concert nights. If you need more detail, you can jump into the related guides below.
          </p>
          <p className="comic-copy">
            If you are planning for a group, this is a good place to start before everyone heads to the venue.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link
              className="comic-btn comic-btn-primary"
              href={buildBookingHref({
                target: "book",
                venue: "red-rocks-amphitheatre",
                searchParams: sp,
              })}
            >
              Book a Ride
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/red-rocks/concert-guide">
              Concert Guide
            </Link>
          </div>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Planning Tip</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Start with your immediate question, then check the related guide if you need to make a parking, transportation, or
            timing decision before show night.
          </p>
          <p className="comic-copy">
            The smoothest Red Rocks nights usually come from deciding the ride, arrival time, and meeting point before the day of
            the show.
          </p>
        </section>

        <FAQBlock title="Red Rocks FAQ" rows={faqRows} />

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">More Red Rocks Guides</div>
          <div className="comic-grid" style={{ marginTop: 10 }}>
            <Link href="/red-rocks" className="comic-panel block">
              <div className="comic-tag">Guide</div>
              <h2 className="comic-h3">Red Rocks Guide</h2>
              <p className="comic-copy">Venue basics, planning help, and show-night details.</p>
            </Link>
            <Link href="/red-rocks/transportation" className="comic-panel block">
              <div className="comic-tag">Transport</div>
              <h2 className="comic-h3">Transportation Guide</h2>
              <p className="comic-copy">Arrival, pickup, and return strategy for show nights.</p>
            </Link>
            <Link href="/red-rocks/parking" className="comic-panel block">
              <div className="comic-tag">Parking</div>
              <h2 className="comic-h3">Parking Guide</h2>
              <p className="comic-copy">Lot tradeoffs, timing windows, and egress expectations.</p>
            </Link>
            <Link
              href={buildBookingHref({
                target: "book",
                venue: "red-rocks-amphitheatre",
                searchParams: sp,
              })}
              className="comic-panel block"
            >
              <div className="comic-tag">Book</div>
              <h2 className="comic-h3">See Ride Options</h2>
              <p className="comic-copy">Shared shuttle seats and private rides for Red Rocks concerts.</p>
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
