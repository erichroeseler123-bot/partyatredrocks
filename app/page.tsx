import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-black text-white">
      {/* ================= HERO ================= */}
      <section className="relative min-h-[85vh] flex items-end">
        <Image
          src="/hero/hero-home.jpg"
          alt="Party at Red Rocks Transportation"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
          <h1 className="text-5xl md:text-7xl font-black italic uppercase leading-none">
            Party at Red Rocks
          </h1>
          <p className="mt-6 max-w-xl text-zinc-300 text-lg">
            Premium concert transportation in Colorado — fixed pricing, professional drivers, and a reliable
            post-show return.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/book-shuttle" className="btn-primary">
              Book Red Rocks Shuttle — $59/pp →
            </Link>
            <Link
              href="/private-suburban"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition"
            >
              Private Suburban — Flat Rate →
            </Link>
            <Link
              href="/week"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition"
            >
              This Week at Red Rocks →
            </Link>
          </div>

          <div className="mt-6 text-sm text-zinc-400">
            Prefer to research first?{" "}
            <Link className="underline decoration-white/20 hover:decoration-white/60" href="/guide">
              Read the Red Rocks Guide →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= PRICING / OPTIONS (kept minimal) ================= */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-black">Options</h2>
        <p className="mt-3 text-zinc-300 max-w-3xl">
          Pick the simple plan: shuttle seats for most people, private vehicles for groups or comfort.
        </p>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="bg-surface-strong border border-white/10 rounded-3xl p-7">
            <div className="text-2xl font-black">Shuttle Seats</div>
            <div className="mt-2 text-zinc-300">Per-person, fixed price. Best for most shows.</div>
            <div className="mt-6 flex items-center justify-between">
              <div>
                <div className="text-3xl font-black">$59</div>
                <div className="text-sm text-zinc-400">per person</div>
              </div>
              <Link href="/book-shuttle" className="btn-primary">
                Book Shuttle →
              </Link>
            </div>
          </div>

          <div className="bg-surface-strong border border-white/10 rounded-3xl p-7">
            <div className="text-2xl font-black">Private Suburban</div>
            <div className="mt-2 text-zinc-300">Flat rate. More room + more comfort.</div>
            <div className="mt-6 flex items-center justify-between">
              <div>
                <div className="text-3xl font-black">$499</div>
                <div className="text-sm text-zinc-400">flat rate</div>
              </div>
              <Link href="/private-suburban" className="btn-primary">
                View Details →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= QUICK INTEL ================= */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-surface-strong border border-white/10 rounded-3xl p-8">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <h2 className="text-3xl font-black">Quick intel for show night</h2>
              <p className="mt-3 text-zinc-300 max-w-3xl">
                Keep the homepage clean — deep logistics live on dedicated authority pages.
              </p>
            </div>
            <Link
              href="/guide"
              className="inline-flex items-center justify-center px-5 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition"
            >
              View all guides →
            </Link>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-surface border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-black">Local Music Intelligence</h3>
              <p className="mt-2 text-zinc-300">
                Pickup reality, post-show timing, and how to avoid the trap.
              </p>
              <div className="mt-4">
                <Link className="underline decoration-white/20 hover:decoration-white/60" href="/guide">
                  Open →
                </Link>
              </div>
            </div>

            <div className="bg-surface border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-black">Red Rocks FAQ</h3>
              <p className="mt-2 text-zinc-300">
                Bag policy, tailgating, entry timing, and exits — quick answers.
              </p>
              <div className="mt-4">
                <Link className="underline decoration-white/20 hover:decoration-white/60" href="/guide">
                  Open →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-10 text-sm text-zinc-400 flex flex-wrap items-center gap-3">
          <span>© {new Date().getFullYear()} Party at Red Rocks. All rights reserved.</span>
          <span className="text-zinc-600">•</span>
          <Link className="hover:text-white" href="/guide">
            Guides
          </Link>
          <span className="text-zinc-600">•</span>
          <Link className="hover:text-white" href="/week">
            This Week
          </Link>
          <span className="text-zinc-600">•</span>
          <Link className="hover:text-white" href="/venues">
            Venues
          </Link>
          <span className="text-zinc-600">•</span>
          <Link className="hover:text-white" href="/book-shuttle">
            Shuttles
          </Link>
        </div>
      </footer>
    </main>
  );
}
