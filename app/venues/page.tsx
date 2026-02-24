import { venueImage } from "@/lib/display";
import Link from "next/link";
import { VENUES } from "@/lib/venues";

export default function VenuesPage() {
  return (
    <main className="min-h-screen bg-surface text-white px-6 py-12">
      <Link
        href="/"
        className="text-white/70 text-xs font-black uppercase tracking-[0.22em] mb-4 inline-block hover:text-white transition"
      >
        ← Back to Hub
      </Link>

      <h1 className="text-4xl md:text-5xl font-black uppercase mb-10 tracking-tight">
        Shuttle Destinations
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {VENUES.map((v) => (
          <Link
            key={v.slug}
            href={`/venues/`}
            className="group relative overflow-hidden rounded-3xl border border-soft panel p-7 shadow-[0_18px_55px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-soft hover:bg-surface/40"
          >
            <img
              src={venueImage(v.slug)}
              alt={v.name}
              className="absolute inset-0 h-full w-full object-cover opacity-18 transition-opacity duration-300 group-hover:opacity-28"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/10" />

            <div className="relative z-10">
              <h2 className="text-2xl font-black uppercase tracking-tight">{v.name}</h2>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.22em] text-white/60 group-hover:text-white/80">
                View shuttles & shows →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
