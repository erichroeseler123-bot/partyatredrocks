import Image from 'next/image';
import Link from 'next/link';

import VenueShows from '@/components/VenueShows';
import FleetGrid from '@/components/FleetGrid';
import { VENUES } from '@/data/venues';

export default function HomePage() {
  const redRocksVenue = VENUES.find(
    (v) => v.slug === 'red-rocks-amphitheatre'
  );

  return (
    <main className="bg-black text-white">

      {/* =========================
          SECTION A — HERO
      ========================== */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/redrocks-color.jpg"
          alt="Red Rocks Amphitheatre"
          fill
          priority
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />

        <div className="relative z-10 max-w-5xl px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight">
            Concert Transportation.
            <br />
            No Driving. No Stress.
          </h1>

          <p className="mt-6 text-lg text-zinc-300 max-w-2xl mx-auto">
            Door-to-door shuttle and private SUV service for concerts across Denver & Boulder.
          </p>

          <Link
            href="/book-shuttle"
            className="inline-block mt-10 px-10 py-4 bg-red-600 hover:bg-red-700 font-bold rounded-md"
          >
            Book Your Ride
          </Link>
        </div>
      </section>

      {/* =========================
          SECTION B — UPCOMING SHOWS
      ========================== */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-4xl font-black">Upcoming Shows</h2>
          <Link
            href="/shows"
            className="text-red-500 font-bold hover:underline"
          >
            View All Shows →
          </Link>
        </div>

        {redRocksVenue && <VenueShows venue={redRocksVenue} />}
      </section>

      {/* =========================
          SECTION C — FEATURED ARTISTS
      ========================== */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-10">
            Featured Artists
          </h2>

          {redRocksVenue && <VenueShows venue={redRocksVenue} />}
        </div>
      </section>

      {/* =========================
          SECTION D — VENUES WE SERVE
      ========================== */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-black mb-12">
          Venues We Serve
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <Link
            href="/venues/red-rocks-amphitheatre"
            className="group relative rounded-xl overflow-hidden border border-zinc-800"
          >
            <Image
              src="/redrocks-color.jpg"
              alt="Red Rocks Amphitheatre"
              width={600}
              height={400}
              className="object-cover group-hover:scale-105 transition"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute bottom-4 left-4 font-black text-xl">
              Red Rocks Amphitheatre
            </div>
          </Link>

          <Link
            href="/venues/mishawaka-amphitheatre"
            className="group relative rounded-xl overflow-hidden border border-zinc-800"
          >
            <Image
              src="/hero/transport.jpg"
              alt="Mishawaka Amphitheatre"
              width={600}
              height={400}
              className="object-cover group-hover:scale-105 transition"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute bottom-4 left-4 font-black text-xl">
              Mishawaka Amphitheatre
            </div>
          </Link>

          <Link
            href="/book-shuttle"
            className="group relative rounded-xl overflow-hidden border border-red-600"
          >
            <Image
              src="/fleet/shuttle.jpg"
              alt="All Venues Shuttle"
              width={600}
              height={400}
              className="object-cover group-hover:scale-105 transition"
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute bottom-4 left-4 font-black text-xl">
              All-Venues Shuttle
            </div>
          </Link>

        </div>
      </section>

      {/* =========================
          SECTION E — FLEET
      ========================== */}
      <section className="py-24 px-6 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-12 text-center">
            Our Fleet
          </h2>
          <FleetGrid />
        </div>
      </section>

    </main>
  );
}
