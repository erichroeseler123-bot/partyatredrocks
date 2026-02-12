import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <div>
            <div className="font-black uppercase tracking-[0.22em] text-sm">
              Party at Red Rocks
            </div>
            <div className="mt-2 text-sm text-zinc-400 max-w-sm">
              Premium concert transportation in Colorado — fixed pricing, professional drivers, and a reliable post-show return.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm">
            <Link className="link-blue" href="/book-shuttle">Book Shuttle</Link>
            <Link className="link-blue" href="/private-suburban">Private Suburban</Link>
            <Link className="link-blue" href="/week">This Week</Link>
            <Link className="link-blue" href="/venues">Venues</Link>
            <Link className="link-blue" href="/guide">Guides</Link>
            <Link className="link-blue" href="/shuttles">Shuttles</Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-xs text-zinc-500">
          © {new Date().getFullYear()} Party at Red Rocks. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
