import Link from 'next/link';
import { VENUES } from '@/data/venues';

export default function BookAllVenuesPage() {
  const venues = Object.values(VENUES);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <h1 className="text-5xl font-black italic uppercase mb-12 text-center">
        All Concert Venues
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {venues.map((venue) => (
          <Link
            key={venue.slug}
            href={`/venues/${venue.slug}`}
            className="rounded-3xl border border-zinc-800 p-8 bg-zinc-900/40 hover:border-red-500 transition"
          >
            <h2 className="text-2xl font-black italic uppercase">
              {venue.name}
            </h2>
            <p className="text-zinc-400 mt-2">
              {venue.city}, {venue.state}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
