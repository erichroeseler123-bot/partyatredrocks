import Link from "next/link";
import type { Metadata } from "next";
import ShuttleCTA from "@/components/cta/ShuttleCTA";

export const metadata: Metadata = {
  title: "Denver Shuttle Hub: Sheraton Downtown | Party at Red Rocks",
  description:
    "Official Downtown Denver pickup hub for Party at Red Rocks. Meet at the Sheraton Denver Downtown and ride a $59 per-person shuttle to Red Rocks with a guaranteed post-show return.",
  alternates: {
    canonical: "https://www.partyatredrocks.com/guide/local/denver-pickups",
  },
  openGraph: {
    title: "Denver Shuttle Hub: Sheraton Downtown | Party at Red Rocks",
    description:
      "Official Downtown Denver pickup hub. $59 per-person Red Rocks shuttle with guaranteed post-show return.",
    url: "https://www.partyatredrocks.com/guide/local/denver-pickups",
    type: "article",
  },
};

export default function DenverPickups() {
  const localSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Party at Red Rocks",
    url: "https://www.partyatredrocks.com",
    image: "https://www.partyatredrocks.com/hero/hero-home.jpg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "1550 Court Pl",
      addressLocality: "Denver",
      addressRegion: "CO",
      postalCode: "80202",
    },
    geo: { "@type": "GeoCoordinates", latitude: 39.743, longitude: -104.9897 },
    priceRange: "$59-$499",
    areaServed: ["Denver, CO", "Morrison, CO", "Denver Metro"],
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 bg-surface text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }}
      />

      <header className="mb-16">
        <h1 className="text-4xl font-black mb-4 uppercase italic tracking-tighter">
          Denver Shuttle Hub: Sheraton Downtown
        </h1>

        <p className="text-lg text-muted leading-relaxed italic">
          The primary Downtown Denver pickup hub for Party at Red Rocks riders. Check in, rally, and roll —
          no parking stress, no surge pricing, guaranteed post-show return.
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

      <section className="grid md:grid-cols-2 gap-10 mb-16 border border-soft rounded-[2.5rem] overflow-hidden bg-surface-strong/30 p-8 shadow-2xl">
        <div>
          <h2 className="mb-4 text-xl font-bold uppercase tracking-tight text-[#4cc9f0]">
            Pre-Concert Strategy
          </h2>
          <p className="text-muted text-base mb-6 leading-relaxed">
            Located at <strong>1550 Court Pl</strong>, the Sheraton is our central Denver basecamp.
            We recommend arriving <strong>45 minutes prior to departure</strong> so you can check in and settle.
          </p>

          <ul className="space-y-4 text-base text-soft font-medium">
            <li className="flex gap-2">
              <span>📍</span>{" "}
              <span>
                <strong>Official Pickup:</strong> 1550 Court Pl, Denver, CO 80202
              </span>
            </li>
            <li className="flex gap-2">
              <span>🚌</span>{" "}
              <span>
                <strong>Fleet:</strong> Late-model Sprinters and Suburbans
              </span>
            </li>
            <li className="flex gap-2">
              <span>✅</span>{" "}
              <span>
                <strong>Guarantee:</strong> We stage post-show return so you don’t get stranded
              </span>
            </li>
            <li>
              🔗{" "}
              <a
                href="https://www.marriott.com/en-us/hotels/dencc-sheraton-denver-downtown-hotel/overview/"
                target="_blank"
                rel="noreferrer"
                className="text-[#4cc9f0] hover:underline transition"
              >
                Sheraton Details
              </a>
            </li>
          </ul>
        </div>

        <div className="aspect-square md:aspect-auto md:h-full min-h-[320px] rounded-2xl overflow-hidden border border-soft shadow-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.439164214555!2d-104.99227562402128!3d39.74301597155639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876c78d052848c41%3A0xe212879659b85c8e!2sSheraton%20Denver%20Downtown%20Hotel!5e0!3m2!1sen!2sus!4v1706990100000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Sheraton Denver Downtown Map"
          ></iframe>
        </div>
      </section>

      <ShuttleCTA
        title="Denver Pickup → Red Rocks"
        blurb="Board in Downtown Denver. $59 per-person. No parking stress, no surge pricing, guaranteed post-show return."
        href="/book"
        button="Book Denver Shuttle → $59"
      />

      <footer className="mt-20 pt-10 border-t border-zinc-900 text-center">
        <p className="text-faint text-[10px] font-black uppercase tracking-[0.4em]">
          Party at Red Rocks | Colorado&apos;s Premier Concert Logistics
        </p>
      </footer>
    </main>
  );
}
