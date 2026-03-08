import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Camping Near Red Rocks (Not In The Park)",
  description:
    "Camping is not allowed in Red Rocks Park. Use this guide for nearby alternatives like Golden Gate Canyon, Bear Creek Lake, and Chief Hosa.",
  alternates: { canonical: "/red-rocks/camping" },
};

export default function RedRocksCampingPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
      { "@type": "ListItem", position: 3, name: "Camping", item: `${SITE}/red-rocks/camping` },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can you camp inside Red Rocks Park?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, overnight camping is not allowed inside Red Rocks Park.",
        },
      },
    ],
  };

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

        <div className="comic-hero">
          <div className="comic-kicker">Camping</div>
          <h1 className="comic-title">Camping Near Red Rocks</h1>
          <p className="comic-copy">
            Important: camping is not allowed inside Red Rocks Park. Use nearby campgrounds and plan transportation separately for show nights.
          </p>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Nearby Options</div>
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            <li className="comic-copy">Golden Gate Canyon State Park</li>
            <li className="comic-copy">Bear Creek Lake Park</li>
            <li className="comic-copy">Chief Hosa Campground</li>
          </ul>
        </section>

        <div className="comic-grid" style={{ marginTop: 16 }}>
          <Link href="/red-rocks/visiting-guide" className="comic-panel block">
            <div className="comic-tag">Related</div>
            <h2 className="comic-h3">Visiting Guide</h2>
          </Link>
          <Link href="/red-rocks/concerts" className="comic-panel block">
            <div className="comic-tag">Related</div>
            <h2 className="comic-h3">Concert Logistics</h2>
          </Link>
          <Link href="/find" className="comic-panel block">
            <div className="comic-tag">CTA</div>
            <h2 className="comic-h3">Book Show Transportation</h2>
          </Link>
        </div>
      </section>
    </main>
  );
}
