import Link from 'next/link';
import { VENUES } from '@/data/venues';

export default function BookAllVenuesPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      {/* HERO */}
      <section className="max-w-5xl mx-auto text-center mb-20">
        <h1 className="text-5xl md:text-6xl font-black italic uppercase mb-6">
          All Concert Venue Shuttle
        </h1>

        <p className="text-2xl font-extrabold text-green-400 mb-6">
          $50 per person · $250 minimum — Round Trip
        </p>

        <p className="text-lg text-zinc-400 max-w-3xl mx-auto">
          Private, flexible concert transportation anywhere in the Denver metro
          area to any concert venue along the Front Range.
        </p>
      </section>

      {/* VENUE LIST */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-black italic uppercase mb-10">
          Venues We Serve
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {VENUES.map((venue) => (
            <Link
              key={venue.slug}
              href={`/venues/${venue.slug}`}
              className="rounded-3xl border border-zinc-800 p-8 bg-zinc-900/40 hover:border-red-500 hover:bg-zinc-900 transition"
            >
              <h3 className="text-2xl font-black italic uppercase">
                {venue.name}
              </h3>

              <p className="text-zinc-400 mt-2">
                Shuttle & private SUV service
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto text-center mt-24">
        <Link
          href="/book"
          className="inline-block bg-red-600 hover:bg-red-500 text-white font-black uppercase px-10 py-6 rounded-full transition"
        >
          Book Your Ride
        </Link>
      </section>
    </main>
  );
}
