import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks Concert Guide",
  description:
    "Red Rocks concert guide covering arrival timing, stairs, weather, seat movement, and pickup strategy.",
  alternates: { canonical: "/red-rocks/concert-guide" },
};

const coreLinks = [
  { href: "/red-rocks", label: "Red Rocks Guide" },
  { href: "/red-rocks/transportation", label: "Transportation" },
  { href: "/red-rocks/parking", label: "Parking" },
  { href: "/red-rocks/faq", label: "FAQ" },
] as const;

export default async function RedRocksConcertGuidePage() {
  const faqRows = await getFaqRowsWithGlobal("red-rocks/concert-guide.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
      { "@type": "ListItem", position: 3, name: "Concert Guide", item: `${SITE}/red-rocks/concert-guide` },
    ],
  };

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        {faqRows.length > 0 ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        ) : null}

        <div className="comic-hero">
          <div className="comic-kicker">Concert Guide</div>
          <h1 className="comic-title">Red Rocks Concert Guide</h1>
          <p className="comic-copy">
            Red Rocks concerts go more smoothly when you plan the basics before show night: when to leave, what to bring, how the
            weather looks, and how your group is getting back after the encore.
          </p>
          <p className="comic-copy">
            The venue is open-air, the stairs are real, and movement takes longer than most first-time visitors expect. A little
            planning ahead makes the night feel much easier.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-primary" href="/book?venue=red-rocks-amphitheatre">
              Book a Ride
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/week/red-rocks">
              Shows This Week
            </Link>
          </div>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Before You Leave Home</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Set your departure time, confirm who is riding together, and make sure everyone knows the plan for getting in and out.
            Keep your bag and layers aligned with the venue rules and the forecast.
          </p>
          <p className="comic-copy">
            If your group includes first-time visitors, mention the stairs and altitude before you leave. That small heads-up helps
            everyone pace the night better.
          </p>
          <p className="comic-copy">
            For busier shows, add extra time instead of trying to cut it close.
          </p>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Arrival, Entry, and Seat Movement</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Arrive early enough to handle traffic, security, and the walk to your seats without rushing. Keep tickets ready, know
            the bag rules, and choose a regroup point before the music starts.
          </p>
          <p className="comic-copy">
            Inside the venue, extra movement takes more time than people expect. If you want food, merchandise, or photos, pick a
            controlled window instead of constantly going up and down the stairs.
          </p>
          <p className="comic-copy">
            Stay hydrated and keep a steady pace. Red Rocks is usually better with fewer rushed decisions.
          </p>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Post-Show Exit and Pickup</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            The busiest part of the night starts when the show ends. Everyone leaves in the same window, and that is when parking
            exits and pickup areas get crowded fast.
          </p>
          <p className="comic-copy">
            Use one meeting point, one return timeline, and one text thread. If your ride is booked, follow that plan instead of
            trying to improvise after the encore.
          </p>
          <p className="comic-copy">
            Your return ride is easier when everyone knows the plan before the lights come up.
          </p>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Show-Night Checklist</div>
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            <li className="comic-copy">Confirm forecast and temperature swing before departure.</li>
            <li className="comic-copy">Carry only what is necessary under venue policy constraints.</li>
            <li className="comic-copy">Set a regroup point before music starts.</li>
            <li className="comic-copy">Decide your departure trigger for the return leg.</li>
            <li className="comic-copy">Use one transport plan, not competing backup ideas.</li>
          </ul>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">More Red Rocks Guides</div>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {coreLinks.map((item) => (
              <Link key={item.href} href={item.href} className="comic-btn comic-btn-secondary">
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <FAQBlock title="Red Rocks Concert FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
