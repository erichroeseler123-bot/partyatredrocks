'use client';

import Link from 'next/link';

export default function MainNav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-black/90 backdrop-blur border-b border-soft">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="text-white font-black uppercase tracking-widest">
          Party <span className="text-blue-500">@</span> Red Rocks
        </Link>

        {/* PRIMARY NAV */}
        <div className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-muted">
          <Link href="/venues" className="hover:text-white transition">
            Venues
          </Link>
          <Link href="/shuttles" className="hover:text-white transition">
            Shuttles
          </Link>
          <Link href="/gallery" className="hover:text-white transition">
            Gallery
          </Link>
          <Link href="/booking" className="hover:text-white transition">
            Book
          </Link>
        </div>

      </div>
    </nav>
  );
}
