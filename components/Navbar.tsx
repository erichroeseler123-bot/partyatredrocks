import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-black border-b border-zinc-800 py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-black italic uppercase text-white">
          Party at Red Rocks
        </Link>
        
        <div className="hidden md:flex gap-8 items-center">
          {/* THE SEO FRONT DOOR */}
          <Link href="/guide" className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-red-500 transition">
            Intelligence Hub
          </Link>
          <Link href="/venues/red-rocks-amphitheatre" className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-red-500 transition">
            Shows
          </Link>
          <Link href="/book-shuttle" className="bg-red-600 px-6 py-2 rounded-full text-xs font-black uppercase hover:bg-red-500 transition">
            Book Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
