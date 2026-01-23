import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <nav className="p-6 border-b border-white/5 flex justify-between items-center">
          <Link href="/" className="text-xl font-black italic uppercase tracking-tighter">Party at Red Rocks</Link>
          <div className="flex gap-8">
            {/* ADD THIS LINK TO YOUR NEW FEED */}
            <Link href="/venues/red-rocks-amphitheatre" className="text-xs font-bold uppercase tracking-widest text-red-600 hover:text-white transition italic">
              2026 Schedule Intelligence
            </Link>
            <Link href="/shuttles" className="text-xs font-bold uppercase tracking-widest hover:text-red-600 transition">Shuttles</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
