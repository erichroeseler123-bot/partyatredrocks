import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | Party at Red Rocks',
  description: 'The requested guide or event page could not be found.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-surface text-white flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-9xl font-black text-red-600 italic tracking-tighter mb-4">404</h1>

      <div className="max-w-xl">
        <h2 className="text-3xl font-black uppercase mb-6">Looks like you took a wrong turn.</h2>
        <p className="text-muted text-lg mb-10 leading-relaxed">
          The page you’re looking for may have moved. Use the current Red Rocks guides below, or return to the homepage.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 text-left">
          <Link href="/guide/parking" className="p-4 border border-soft rounded-2xl hover:border-red-600 transition group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <span className="block font-black uppercase text-red-600 group-hover:text-red-500">Parking Guide</span>
            <span className="text-xs text-muted">Plan arrival and parking for show night.</span>
          </Link>

          <Link href="/guide/logistics/bag-policy" className="p-4 border border-soft rounded-2xl hover:border-red-600 transition group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <span className="block font-black uppercase text-red-600 group-hover:text-red-500">Bag Policy</span>
            <span className="text-xs text-muted">Check current bag-planning guidance.</span>
          </Link>

          <Link href="/guide/local/denver-pickups" className="p-4 border border-soft rounded-2xl hover:border-red-600 transition group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <span className="block font-black uppercase text-red-600 group-hover:text-red-500">Denver Pickups</span>
            <span className="text-xs text-muted">Plan a private pickup from the Denver area.</span>
          </Link>

          <Link href="/red-rocks/transportation" className="p-4 border border-soft rounded-2xl hover:border-red-600 transition group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <span className="block font-black uppercase text-red-600 group-hover:text-red-500">Transportation</span>
            <span className="text-xs text-muted">See the current private ride options.</span>
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
