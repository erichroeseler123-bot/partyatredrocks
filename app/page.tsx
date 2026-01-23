import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="bg-black text-white">

      {/* =========================
          HERO
      ========================== */}
      <section className="relative h-[85vh] w-full">
        <Image
          src="/hero-redrocks.jpg"
          alt="Red Rocks Amphitheatre"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

        <div className="relative z-10 flex h-full items-end px-6 pb-20 max-w-7xl mx-auto">
          <div>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tight">
              PARTY @ RED ROCKS
            </h1>

            <p className="mt-4 text-xl text-zinc-300 max-w-xl">
              Concert transportation. No driving. No stress.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                href="/book-shuttle"
                className="bg-red-600 hover:bg-red-500 px-8 py-4 rounded-full font-bold transition"
              >
                Book a Ride
              </Link>

              <Link
                href="/shows"
                className="border border-white/30 hover:border-white px-8 py-4 rounded-full font-bold transition"
              >
                View Shows
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          SHOWS CTA
      ========================== */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-black mb-6">
          Upcoming Red Rocks Shows
        </h2>

        <p className="text-zinc-400 max-w-xl mb-8">
          We run shuttles and private SUVs for every major Red Rocks event.
        </p>

        <Link
          href="/shows"
          className="inline-block bg-red-600 hover:bg-red-500 px-8 py-4 rounded-full font-bold transition"
        >
          View All 90+ 2026 Shows →
        </Link>
      </section>

      {/* =========================
          VENUES
      ========================== */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-black mb-12">
          Venues We Serve
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <Link href="/venues/red-rocks-amphitheatre" className="group">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/hero-redrocks.jpg"
                alt="Red Rocks Amphitheatre"
                fill
                className="object-cover group-hover:scale-105 transition"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
            <h3 className="mt-4 text-xl font-bold">
              Red Rocks Amphitheatre
            </h3>
          </Link>

          <Link href="/venues/mishawaka-amphitheatre" className="group">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/hero-transport.jpg"
                alt="Mishawaka Amphitheatre"
                fill
                className="object-cover group-hover:scale-105 transition"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
            <h3 className="mt-4 text-xl font-bold">
              Mishawaka Amphitheatre
            </h3>
          </Link>

          <Link href="/book-all-venues" className="group">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-red-600">
              <Image
                src="/shuttle-sprinter.jpg"
                alt="All Venues Shuttle"
                fill
                className="object-cover group-hover:scale-105 transition"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
            <h3 className="mt-4 text-xl font-bold">
              All-Venues Shuttle
            </h3>
          </Link>
        </div>
      </section>

      {/* =========================
          FLEET (CROPPED + DEPTH)
      ========================== */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-black mb-12">
          Our Fleet
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Shuttle */}
          <div className="relative bg-zinc-900 rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8)] hover:shadow-[0_40px_120px_rgba(220,38,38,0.35)] transition">
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src="/shuttle-sprinter.jpg"
                alt="Sprinter Shuttle"
                fill
                className="object-cover"
                style={{ objectPosition: 'center calc(50% + 100px)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            <div className="p-8">
              <h3 className="text-2xl font-black">Sprinter Shuttle</h3>
              <p className="text-zinc-400 mt-2">
                $50 per person · Denver & Boulder pickups · Drink & vape allowed
              </p>
            </div>
          </div>

          {/* Suburban */}
          <div className="relative bg-zinc-900 rounded-3xl overflow-hidden border border-red-600 shadow-[0_30px_80px_rgba(0,0,0,0.8)] hover:shadow-[0_40px_120px_rgba(220,38,38,0.35)] transition">
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src="/suburban-primary.jpg"
                alt="Private Suburban SUV"
                fill
                className="object-cover"
                style={{ objectPosition: 'center calc(50% + 100px)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            <div className="p-8">
              <h3 className="text-2xl font-black">Private Suburban</h3>
              <p className="text-zinc-400 mt-2">
                $300 minimum · Door-to-door · Your group, your music
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
