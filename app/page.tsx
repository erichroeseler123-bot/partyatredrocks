import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="relative flex items-center justify-center h-[70vh] border-b border-white/10">
        <div className="absolute inset-0 bg-[url('https://www.partyatredrocks.com/Shuttle_jpg')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <p className="text-red-500 uppercase tracking-[0.4em] text-xs font-mono mb-6">
            Premium Concert Transportation
          </p>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tight mb-6">
            You Go to the Show.<br />We Handle the Ride.
          </h1>
          <p className="text-zinc-300 text-lg max-w-2xl mx-auto">
            Professional round-trip shuttle service for Colorado’s best concert venues.
            No driving. No parking. No stress.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* RED ROCKS */}
        <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-10 flex flex-col">
          <h2 className="text-3xl font-black italic uppercase mb-4">
            Party at Red Rocks
          </h2>
          <p className="text-zinc-400 mb-6">
            Our flagship round-trip shuttle to Red Rocks Amphitheatre.
          </p>
          <ul className="text-sm text-zinc-300 space-y-2 mb-8">
            <li>• Pickup anywhere in Denver</li>
            <li>• Driver waits after the show</li>
            <li>• Drink, vape, and music allowed</li>
          </ul>
          <Link
            href="/venues/red-rocks-amphitheatre"
            className="mt-auto inline-block text-center bg-red-600 hover:bg-red-500 transition px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs"
          >
            Book Red Rocks Shuttle
          </Link>
        </div>

        {/* MISHAWAKA */}
        <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-10 flex flex-col">
          <h2 className="text-3xl font-black italic uppercase mb-4">
            Mishawaka Shuttle
          </h2>
          <p className="text-zinc-400 mb-6">
            Shared mountain shuttle to the Mishawaka Amphitheatre.
          </p>
          <ul className="text-sm text-zinc-300 space-y-2 mb-8">
            <li>• Shared round-trip shuttle</li>
            <li>• Canyon logistics handled for you</li>
            <li>• Ideal for sold-out shows</li>
          </ul>
          <p className="text-sm font-bold text-zinc-200 mb-6">
            $65 Round Trip
          </p>
          <Link
            href="/venues/mishawaka-amphitheatre"
            className="mt-auto inline-block text-center border border-white/20 hover:bg-white hover:text-black transition px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs"
          >
            Book Mishawaka Shuttle
          </Link>
        </div>

        {/* ALL VENUE */}
        <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-10 flex flex-col">
          <h2 className="text-3xl font-black italic uppercase mb-4">
            All-Venue Shuttle
          </h2>
          <p className="text-zinc-400 mb-6">
            Flexible round-trip shuttle to any concert venue in Denver or Boulder.
          </p>
          <ul className="text-sm text-zinc-300 space-y-2 mb-8">
            <li>• $50 per person</li>
            <li>• $250 minimum total</li>
            <li>• Cash payment at pickup</li>
            <li>• One stop each way allowed</li>
          </ul>
          <Link
            href="/book-all-venues"
            className="mt-auto inline-block text-center border border-white/20 hover:bg-white hover:text-black transition px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs"
          >
            View All-Venue Shuttle
          </Link>
        </div>

      </section>
    </main>
  );
}
