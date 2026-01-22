import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-black italic uppercase mb-4 tracking-tighter">
        Party @ Red Rocks! <span className="text-red-600 block sm:inline">dispatch hub</span>
      </h1>
      <p className="text-zinc-400 mb-8 max-w-md italic">
        Premium shuttle and private transportation for Colorado's best venues.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/venues/red-rocks-amphitheatre" className="bg-white text-black px-10 py-5 rounded-full font-black uppercase hover:bg-zinc-200 transition">
          Red Rocks
        </Link>
        <Link href="/venues/mishawaka-amphitheatre" className="bg-zinc-900 border border-white/10 px-10 py-5 rounded-full font-black uppercase hover:bg-white/10 transition">
          Mishawaka
        </Link>
        <Link href="/venues" className="bg-red-600 px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-red-700 transition shadow-lg shadow-red-900/20">
          All Venues Shuttle
        </Link>
      </div>
    </main>
  );
}
