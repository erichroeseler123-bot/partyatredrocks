import Link from "next/link";

export default function BookPage() {
  return (
    <main className="min-h-screen bg-surface text-white px-6 py-24">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <header className="text-center mb-20">
          <p className="text-red-500 uppercase tracking-[0.4em] text-xs font-bold mb-4">
            Booking Router
          </p>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tight mb-6">
            Where Are You Going?
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Choose your destination and we’ll route you to the correct shuttle
            service. You go to the show. We handle the ride.
          </p>
        </header>

        {/* SERVICES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* RED ROCKS */}
          <Link
            href="/venues/red-rocks-amphitheatre"
            className="group rounded-3xl border border-white/10 bg-white/[0.02] p-10 hover:bg-white/[0.05] transition-all hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <h2 className="text-3xl font-black italic uppercase mb-4 group-hover:text-red-500">
              Party at Red Rocks
            </h2>
            <ul className="text-sm text-zinc-300 space-y-2 mb-6">
              <li>• Flagship round-trip shuttle</li>
              <li>• Pickup anywhere in Denver</li>
              <li>• Driver waits after the show</li>
              <li>• Drink, vape & music allowed</li>
            </ul>
            <div className="text-red-500 font-bold uppercase tracking-widest text-xs">
              Book Red Rocks Shuttle →
            </div>
          </Link>

          {/* MISHAWAKA */}
          <Link
            href="/venues/mishawaka-amphitheatre"
            className="group rounded-3xl border border-white/10 bg-white/[0.02] p-10 hover:bg-white/[0.05] transition-all hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <h2 className="text-3xl font-black italic uppercase mb-4 group-hover:text-blue-400">
              Mishawaka Shuttle
            </h2>
            <ul className="text-sm text-zinc-300 space-y-2 mb-6">
              <li>• Shared mountain shuttle</li>
              <li>• Canyon logistics handled</li>
              <li>• Ideal for sold-out shows</li>
              <li>• $65 round trip</li>
            </ul>
            <div className="text-blue-400 font-bold uppercase tracking-widest text-xs">
              Book Mishawaka Shuttle →
            </div>
          </Link>

          {/* ALL VENUE */}
          <Link
            href="/book-all-venues"
            className="group rounded-3xl border border-white/10 bg-white/[0.02] p-10 hover:bg-white/[0.05] transition-all hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <h2 className="text-3xl font-black italic uppercase mb-4 group-hover:text-green-400">
              All-Venue Shuttle
            </h2>
            <ul className="text-sm text-zinc-300 space-y-2 mb-6">
              <li>• Any venue in Denver or Boulder</li>
              <li>• $50 per person</li>
              <li>• $250 minimum total</li>
              <li>• Cash payment at pickup</li>
              <li>• One stop each way allowed</li>
            </ul>
            <div className="text-green-400 font-bold uppercase tracking-widest text-xs">
              View All-Venue Shuttle →
            </div>
          </Link>

        </div>
      </div>
    </main>
  );
}
