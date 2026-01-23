import Image from 'next/image';
import Link from 'next/link';
import VenueShows from '@/components/VenueShows';
import FleetGrid from '@/components/FleetGrid';
import { VENUES } from '@/data/venues';

export default function HomePage() {
  const redRocks = VENUES.find(
    (v) => v.slug === 'red-rocks-amphitheatre'
  );

  return (
    <main className="bg-black text-white">

      {/* =========================
          HERO
      ========================== */}
      <section className="relative min-h-[85vh] flex items-end">
        <Image
          src="/hero/hero-home.jpg"
          alt="Party at Red Rocks Transportation"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
          <h1 className="text-5xl md:text-7xl font-black italic uppercase leading-none">
            Party at Red Rocks
          </h1>
          <p className="mt-6 max-w-xl text-zinc-300 text-lg">
            Concert transportation, done right. Shuttles, private SUVs,
            and zero stress getting home.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/book-shuttle"
              className="bg-red-600 hover:bg-red-500 px-8 py-4 font-black uppercase tracking-wide rounded-full"
            >
              Book a Shuttle
            </Link>
            <Link
              href="/private-suburban"
              className="border border-zinc-700 hover:border-white px-8 py-4 font-black uppercase tracking-wide rounded-full"
            >
              Private SUV
            </Link>
          </div>
        </div>
      </section>

      {/* =========================
          RED ROCKS SHOWS
      ========================== */}
      {redRocks && (
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <h2 className="text-3xl font-black italic uppercase mb-10">
            Upcoming Red Rocks Shows
          </h2>

          <VenueShows venue={redRocks} />

          <div className="mt-10">
            <Link
              href="/venues/red-rocks-amphitheatre"
              className="text-red-500 font-black uppercase tracking-widest text-sm hover:text-red-400"
            >
              View All Red Rocks Shows →
            </Link>
          </div>
        </section>
      )}

      {/* =========================
          VENUES WE SERVE
      ========================== */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black italic uppercase mb-12">
            Venues We Serve
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              href="/venues/red-rocks-amphitheatre"
              className="group rounded-3xl overflow-hidden border border-zinc-800"
            >
              <Image
                src="/venues/rrsite.jpg"
                alt="Red Rocks Amphitheatre"
                width={800}
                height={500}
                className="object-cover h-64 w-full group-hover:scale-105 transition"
              />
              <div className="p-6 font-black uppercase">
                Red Rocks Amphitheatre
              </div>
            </Link>

            <Link
              href="/venues/mishawaka-amphitheatre"
              className="group rounded-3xl overflow-hidden border border-zinc-800"
            >
              <Image
                src="/venues/mishsite.jpg"
                alt="Mishawaka Amphitheatre"
                width={800}
                height={500}
                className="object-cover h-64 w-full group-hover:scale-105 transition"
              />
              <div className="p-6 font-black uppercase">
                Mishawaka Amphitheatre
              </div>
            </Link>

            <Link
              href="/book-all-venues"
              className="group rounded-3xl overflow-hidden border border-zinc-800"
            >
              <Image
                src="/venues/missionsite.jpg"
                alt="All Venues Shuttle"
                width={800}
                height={500}
                className="object-cover h-64 w-full group-hover:scale-105 transition"
              />
              <div className="p-6 font-black uppercase">
                All Venues Shuttle
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================
          FLEET
      ========================== */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-black italic uppercase mb-12">
          Our Fleet
        </h2>

        <FleetGrid />
      </section>

      {/* =========================
          FINAL CTA
      ========================== */}
      <section className="py-24 px-6 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black italic uppercase">
            Don’t Drive. Don’t Stress.
          </h2>
          <p className="mt-6 text-zinc-400 text-lg">
            Book your ride, enjoy the show, and we’ll handle the rest.
          </p>

          <Link
            href="/book-shuttle"
            className="inline-block mt-10 bg-red-600 hover:bg-red-500 px-10 py-5 font-black uppercase tracking-wide rounded-full"
          >
            Book Now
          </Link>
        </div>
      </section>

    </main>
  );
}
