import Link from "next/link";
import type { Metadata } from "next";
import ShuttleCTA from "@/components/cta/ShuttleCTA";
import { pageVisuals } from "@/lib/pageVisuals";

export const metadata: Metadata = {
  title: "Golden Shuttle Pickup: Trailhead Taphouse | Party at Red Rocks",
  description:
    "Golden pickup location for Party at Red Rocks. Meet at Trailhead Taphouse, then ride a $59 per-person shuttle to Red Rocks with a return plan after the show.",
  alternates: {
    canonical: "https://www.partyatredrocks.com/guide/local/trailhead-taphouse",
  },
  openGraph: {
    title: "Golden Shuttle Pickup: Trailhead Taphouse | Party at Red Rocks",
    description:
      "Golden pickup location. $59 per-person Red Rocks shuttle with a return plan after the show.",
    url: "https://www.partyatredrocks.com/guide/local/trailhead-taphouse",
    type: "article",
  },
};

export default function TrailheadHub() {
  const shareImage = pageVisuals.guideLocal.trailheadTaphouseShareImage;
  const localSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Party at Red Rocks",
    url: "https://www.partyatredrocks.com",
    image: shareImage,
    priceRange: "$59-$449",
    areaServed: ["Golden, CO", "Morrison, CO", "Denver Metro"],
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 bg-surface text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }}
      />

      <header className="mb-10">
        <h1 className="text-4xl font-black mb-4 uppercase italic tracking-tighter">
          Golden Shuttle Pickup: Trailhead Taphouse
        </h1>
        <p className="text-lg text-muted leading-relaxed italic">
          Golden pickup for Party at Red Rocks riders.
          Grab a drink, meet the crew, then roll to Red Rocks with your return ride already planned.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/book"
            className="btn-primary"
          >
            Book Shuttle → $59
          </Link>
          <Link
            href="/week"
            className="inline-block border border-soft hover:border-soft px-5 py-3 font-bold uppercase rounded-full transition"
          >
            See This Week’s Shows →
          </Link>
        </div>
      </header>

      <section className="grid md:grid-cols-2 gap-10 items-center border border-soft rounded-[2.5rem] overflow-hidden bg-surface-strong/30 p-8 shadow-2xl">
        <div>
          <h2 className="text-xl font-bold mb-4 text-[#4cc9f0] uppercase tracking-tight">
            Before Departure
          </h2>

          <p className="text-muted text-base leading-relaxed mb-6">
            Trailhead Taphouse is a simple Golden meet-up point before Red Rocks.
            Arrive early, check in, and settle in before departure.
          </p>

          <ul className="space-y-4 text-base text-soft font-medium">
            <li className="flex gap-2">
              <span>📍</span>
              <span>
                <strong>Pickup Hub:</strong> Trailhead Taphouse (Golden, CO)
              </span>
            </li>
            <li className="flex gap-2">
              <span>🍺</span>
              <span>
                <strong>Pre-show move:</strong> Eat + drink + rally here
              </span>
            </li>
            <li className="flex gap-2">
              <span>🚌</span>
              <span>
                <strong>Service:</strong> $59 per-person, clear departure timing, return ride after the show
              </span>
            </li>
            <li>
              🔗{" "}
              <a
                href="https://trailheadtaphouse.com/"
                target="_blank"
                rel="noreferrer"
                className="text-[#4cc9f0] hover:underline transition"
              >
                Trailhead Taphouse Website
              </a>
            </li>
          </ul>
        </div>

        <div className="aspect-square md:aspect-auto md:h-full min-h-[320px] rounded-2xl overflow-hidden border border-soft shadow-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3069.0!2d-105.2200!3d39.7550!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876b9b0000000000%3A0x0000000000000000!2sTrailhead%20Taphouse!5e0!3m2!1sen!2sus!4v1706990100000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Trailhead Taphouse Map"
          ></iframe>
        </div>
      </section>

      <ShuttleCTA
        title="Golden Pickup → Red Rocks"
        blurb="Depart from Trailhead Taphouse. $59 per-person. Direct Red Rocks drop-off with a return ride planned after the show."
        href="/book"
        button="Book Golden Shuttle → $59"
      />

      <footer className="mt-20 pt-10 border-t border-zinc-900 text-center">
        <p className="text-faint text-[10px] font-black uppercase tracking-[0.4em]">
          Party at Red Rocks | Golden pickup details for Red Rocks show nights
        </p>
      </footer>
    </main>
  );
}
