import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks FAQ",
  description:
    "Long-form Red Rocks FAQ covering geology, concerts, hiking, parking, transportation, and practical trip planning.",
  alternates: { canonical: "/red-rocks/faq" },
};

export default async function RedRocksFaqPage() {
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
          <h1 className="comic-title">Red Rocks FAQ: Fast Answers With Real Planning Context</h1>
          <p className="comic-copy">
            This FAQ page is designed for high-intent planning. It answers the questions people ask most before a Red Rocks trip,
            but it also points to deeper pages when a short answer is not enough. Use this page as your quick decision layer, then
            jump into detailed guides for parking, transportation, hiking, geology, or full visit planning.
          </p>
          <p className="comic-copy">
            If you are coordinating a group, send this page first. It creates shared baseline assumptions around arrival timing,
            stairs, weather, and post-show movement, which prevents confusion later.
          </p>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">How To Use This FAQ</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Start with your immediate question, but check adjacent topics before finalizing plans. For example, if you are asking
            about parking, also review transportation and post-show pickup strategy. If you are asking about hiking, also check
            weather and same-day concert pacing. Red Rocks decisions are connected and work best when planned together.
          </p>
          <p className="comic-copy">
            For the most accurate trip execution, combine this FAQ with the Red Rocks hub and your event-week planning pages.
          </p>
        </section>

        <FAQBlock title="Red Rocks FAQ" rows={faqRows} />

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Go Deeper</div>
          <div className="comic-grid" style={{ marginTop: 10 }}>
            <Link href="/red-rocks" className="comic-panel block">
              <div className="comic-tag">Hub</div>
              <h2 className="comic-h3">Red Rocks Hub</h2>
              <p className="comic-copy">Full cluster navigation across all major planning topics.</p>
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
            <Link href="/find" className="comic-panel block">
              <div className="comic-tag">Book</div>
              <h2 className="comic-h3">Ride Match</h2>
              <p className="comic-copy">Convert planning into a confirmed transport plan.</p>
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
