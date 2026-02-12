import Link from 'next/link';
import { Metadata } from 'next';

// 1. SEO Metadata: Telling Google not to index the error page itself
export const metadata: Metadata = {
  title: 'Page Not Found | Party at Red Rocks',
  description: 'The requested guide or event page could not be found.',
  robots: {
    index: false, // Essential: Prevent 404s from appearing in search results
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      {/* Visual Error Code */}
      <h1 className="text-9xl font-black text-red-600 italic tracking-tighter mb-4">404</h1>
      
      <div className="max-w-xl">
        <h2 className="text-3xl font-black uppercase mb-6">Looks like you took a wrong turn.</h2>
        <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
          The 2025 event or guide you're looking for has been moved to our new <strong>2026 Venue Intelligence Hub</strong>. 
          Don't get stranded—use the guides below to master your Red Rocks logistics.
        </p>

        {/* Recovery Links: Guiding users back to authority content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 text-left">
          <Link href="/guide/logistics/parking-lots" className="p-4 border border-zinc-800 rounded-2xl hover:border-red-600 transition group">
            <span className="block font-black uppercase text-red-600 group-hover:text-red-500">Parking Hacks</span>
            <span className="text-xs text-zinc-500">Avoid the 380-stair climb.</span>
          </Link>
          
          <Link href="/guide/logistics/bag-policy" className="p-4 border border-zinc-800 rounded-2xl hover:border-red-600 transition group">
            <span className="block font-black uppercase text-red-600 group-hover:text-red-500">2026 Bag Rules</span>
            <span className="text-xs text-zinc-500">New single-pocket policy.</span>
          </Link>
          
          <Link href="/guide/local/denver-pickups" className="p-4 border border-zinc-800 rounded-2xl hover:border-red-600 transition group">
            <span className="block font-black uppercase text-red-600 group-hover:text-red-500">Denver Pickups</span>
            <span className="text-xs text-zinc-500">Sheraton Downtown hub.</span>
          </Link>
          
          <Link href="/guide/logistics/sold-out-survival" className="p-4 border border-zinc-800 rounded-2xl hover:border-red-600 transition group">
            <span className="block font-black uppercase text-red-600 group-hover:text-red-500">Sold-Out Survival</span>
            <span className="text-xs text-zinc-500">Beat the $150 Uber surge.</span>
          </Link>
        </div>

        <Link 
          href="/" 
          className="inline-block btn-primary uppercase hover:bg-red-500 transition shadow-xl"
        >
          Return to Homepage
        </Link>
      </div>
    </main>
  );
}
