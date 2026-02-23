import Link from "next/link";
import { VENUES } from "@/lib/venues";

export default function VenuesPage() {
  return (
    <main className="min-h-screen bg-surface text-white p-12">
      <Link
        href="/"
        className="text-red-600 text-xs font-bold uppercase tracking-widest mb-4 inline-block"
      >
        ← Back to Hub
      </Link>

      <h1 className="text-5xl font-black italic uppercase mb-12 tracking-tighter text-red-600">
        Shuttle Destinations
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {VENUES.map((v) => (
          <Link key={v.slug} href={`/venues/${v.slug}`} className="btn-primary">
            <h2 className="text-2xl font-black italic uppercase">{v.name}</h2>
            <p className="text-zinc-500 text-xs mt-2 group-hover:text-white/80 uppercase font-bold tracking-widest">
              View Shuttles & Shows →
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
