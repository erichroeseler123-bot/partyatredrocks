import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* HERO */}
      <section className="relative h-[80vh] flex items-center justify-center border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-[#050505]" />

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <p className="text-red-500 uppercase tracking-[0.4em] text-[10px] font-mono mb-6">
            Premium Concert Transportation
          </p>

          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-8">
            Party at Red Rocks
          </h1>

          <p className="text-zinc-300 max-w-2xl mx-auto text-lg italic leading-relaxed mb-12">
            Professional round-trip shuttle service for Colorado’s best concert
            venues. We handle the driving. You handle the night.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* RED ROCKS */}
          <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 hover:border-red-500/60 transition-all">
            <h2 className="text-4xl font-black italic uppercase tracking-tight mb-4">
              Party at Red Rocks
            </h2>

            <p className="text-zinc-400 italic mb-6">
              Flagship round-trip shuttle service to Red Rocks Amphitheatre.
            </p>

            <ul className="text-sm text-zinc-300 space-y-2 mb-8">
              <li>• Pickup anywhere in Denver</li>
              <li>• Driver waits after the show</li>
              <li>• Drink, vape, and music allowed</li>
            </ul>

            <Link
              href="/venues/red-rocks-amphitheatre"
              className="inline-block w-full text-center bg-red-600 hover:bg-red-500 transition-all py-5 rounded-2xl font-black uppercase tracking-widest text-[10px]"
            >
              Book Red Rocks Shuttle
            </Link>
          </div>

          {/* MISHAWAKA */}
          <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 hover:border-blue-500/60 transition-all">
            <h2 className="text-4xl font-black italic uppercase tracking-tight mb-4">
              Mishawaka Shuttle
            </h2>

            <p className="text-zinc-400 italic mb-6">
              Shared mountain shuttle service to the Mishawaka Amphitheatre.
            </p>

            <ul className="text-sm text-zinc-300 space-y-2 mb-8">
              <li>• Shared round-trip shuttle</li>
              <li>• Canyon logistics handled for you</li>
              <li>• Ideal for sold-out shows</li>
            </ul>

            <div className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-6">
              $65 Round Trip
            </div>

            <Link
              href="/venues/mishawaka-amphitheatre"
              className="inline-block w-full text-center bg-blue-600 hover:bg-blue-500 transition-all py-5 rounded-2xl font-black uppercase tracking-widest text-[10px]"
            >
              Book Mishawaka Shuttle
            </Link>
          </div>

          {/* ALL VENUE */}
          <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 hover:border-white/40 transition-all">
            <h2 className="text-4xl font-black italic uppercase tracking-tight mb-4">
              All-Venue Shuttle
            </h2>

            <p className="text-zinc-400 italic mb-6">
              Flexible round-trip shuttle to any concert venue in Denver or
              Boulder.
            </p>

            <ul className="text-sm text-zinc-300 space-y-2 mb-8">
              <li>• $50 per person</li>
              <li>• $250 minimum total</li>
              <li>• One stop each way allowed</li>
              <li>• Cash payment at pickup</li>
            </ul>

            <Link
              href="/book-all-venues"
              className="inline-block w-full text-center border border-white/20 hover:bg-white hover:text-black transition-all py-5 rounded-2xl font-black uppercase tracking-widest text-[10px]"
            >
              View All-Venue Shuttle
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
