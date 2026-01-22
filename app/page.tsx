import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-black italic uppercase mb-4 tracking-tighter text-red-600">
        Party Dispatch Hub
      </h1>
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link href="/venues/red-rocks-amphitheatre" className="bg-white text-black px-10 py-5 rounded-full font-black uppercase hover:bg-zinc-200 transition">
          Red Rocks
        </Link>
        <Link href="/venues/mishawaka-amphitheatre" className="border border-white/20 px-10 py-5 rounded-full font-black uppercase hover:bg-white/10 transition">
          Mishawaka
        </Link>
      </div>
    </main>
  );
}
