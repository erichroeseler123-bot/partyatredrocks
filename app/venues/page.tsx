import type { Metadata } from "next";
import Link from "next/link";
import ServedVenueSections from "@/components/venues/ServedVenueSections";
import { curatedImages } from "@/lib/curatedImages";
import { SHUTTLE_PRICING, SUBURBAN_2027_USD, VAN_2027_USD } from "@/lib/pricing";

const SITE = "https://www.partyatredrocks.com";

export const metadata: Metadata = {
  title: "Colorado Concert Venues & Private Transportation | Red Rocks, Denver & Boulder",
  description:
    `Private group concert transportation for Red Rocks Amphitheatre ($${SUBURBAN_2027_USD} Suburban / $${VAN_2027_USD} Van), Mission Ballroom, Fiddler's Green, Folsom Field, Fillmore, Ogden, Gothic, and Mishawaka.`,
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${SITE}/venues`,
  },
  openGraph: {
    title: "Colorado Concert Venues Covered by Party at Red Rocks",
    description:
      "Explore venue parking, arrival strategy, and flat-rate private group rides across Red Rocks, Denver, Boulder, and Poudre Canyon.",
    url: `${SITE}/venues`,
    type: "website",
    images: [{ url: `${SITE}${curatedImages.venuesHero}`, alt: "Colorado concert venues covered by Party at Red Rocks" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Colorado Concert Venues & Private Group Rides",
    description:
      "Red Rocks Amphitheatre, Mission Ballroom, Fiddler's Green, Folsom Field, Mishawaka, and Denver music venues.",
    images: [`${SITE}${curatedImages.venuesHero}`],
  },
};

export default function VenuesPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Venues", item: `${SITE}/venues` },
    ],
  };

  return (
    <main className="brand-page bg-[#070b14] px-4 pb-16 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1400px] flex-col gap-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <section
          className="brand-panel relative min-h-[380px] overflow-hidden rounded-[32px] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:min-h-[430px] sm:p-10 lg:p-12"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(7,11,20,0.52), rgba(7,11,20,0.86)), url(${curatedImages.venuesHero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-[#ffb07c]/35 bg-black/45 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
              Front Range & Foothills Venues
            </div>
            <h1 className="mt-5 text-[2.4rem] font-black uppercase leading-[0.95] tracking-[-0.04em] sm:text-[3.8rem] lg:text-[4.6rem]">
              Colorado Concert Venues We Serve
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/82 sm:text-lg">
              Red Rocks Amphitheatre is our flagship show-night route—with dedicated Upper North Lot tailgating and on-site driver wait—plus private SUV and van service for Denver, Boulder, and canyon venues.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book/red-rocks-amphitheatre/private"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff6b3d] px-7 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-[#ff7f56]"
              >
                Book Red Rocks Ride (${SUBURBAN_2027_USD} / ${VAN_2027_USD})
              </Link>
              <Link
                href="/red-rocks/concerts"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/16 bg-white/8 px-6 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/14"
              >
                2027 Red Rocks Concerts
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[26px] border border-[#ffb07c]/30 bg-[#0d1424] p-6">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-[#ffb07c]">Flagship Corridor</div>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">Red Rocks Amphitheatre</h2>
            <p className="mt-2 text-sm leading-6 text-white/78">
              Private Suburban (${SUBURBAN_2027_USD}, up to 6) and Private Van (${VAN_2027_USD}, up to 10) flat round-trip—includes Upper North Lot tailgating gear and driver waiting through the show.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.14em]">
              <Link href="/venues/red-rocks-amphitheatre" className="text-[#ffb07c] underline">
                Venue Guide →
              </Link>
              <Link href="/book/red-rocks-amphitheatre/private" className="text-white underline">
                Book Vehicle →
              </Link>
            </div>
          </article>

          <article className="rounded-[26px] border border-white/10 bg-[#0d1424] p-6">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-[#8fd0ff]">Denver & Boulder Rooms</div>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">Urban Arenas & Theatres</h2>
            <p className="mt-2 text-sm leading-6 text-white/78">
              Mission Ballroom, Ball Arena, Fiddler&apos;s Green, Folsom Field, Fillmore, Ogden, and Gothic Theatre—private group SUVs ({SHUTTLE_PRICING.denverBoulderOtherVenues.suburban}).
            </p>
            <div className="mt-4 text-xs font-black uppercase tracking-[0.14em]">
              <Link href="/book-all-venue" className="text-[#8fd0ff] underline">
                Request Venue Quote →
              </Link>
            </div>
          </article>

          <article className="rounded-[26px] border border-white/10 bg-[#0d1424] p-6">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-[#8fd0ff]">Poudre Canyon</div>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">Mishawaka Amphitheatre</h2>
            <p className="mt-2 text-sm leading-6 text-white/78">
              Zero-cell-service canyon concerts outside Fort Collins where pre-arranged return transport is essential ({SHUTTLE_PRICING.mishawaka.privateSuburban}).
            </p>
            <div className="mt-4 text-xs font-black uppercase tracking-[0.14em]">
              <Link href="/venues/mishawaka-amphitheatre" className="text-[#8fd0ff] underline">
                Mishawaka Guide →
              </Link>
            </div>
          </article>
        </section>

        <ServedVenueSections mode="venues" />
      </section>
    </main>
  );
}
