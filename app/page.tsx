import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="bg-black text-white">

      {/* =========================
         HERO
      ========================= */}
      <section className="relative h-[80vh] flex items-center">
        <Image
          src="/hero/hero-home.jpg"
          alt="Party at Red Rocks"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <h1 className="text-6xl md:text-7xl font-black italic tracking-tight">
            PARTY @ RED ROCKS
          </h1>
          <p className="mt-6 text-xl text-zinc-300 max-w-xl">
            Concert transportation. No driving. No stress.
          </p>

          <div className="mt-10 flex gap-4">
            <Link
              href="/book-shuttle"
              className="bg-red-600 hover:bg-red-500 px-8 py-4 rounded-full font-bold"
            >
              Book a Ride
            </Link>
            <Link
              href="/shows"
              className="border border-white/30 hover:border-white px-8 py-4 rounded-full font-semibold"
            >
              View Shows
            </Link>
          </div>
        </div>
      </section>

      {/* =========================
         UPCOMING SHOWS (SeatGeek pages)
      ========================= */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-10">
            Upcoming Red Rocks Shows
          </h2>

          <p className="text-zinc-400 max-w-xl mb-8">
            Browse upcoming concerts. Each show page includes direct
            transportation options.
          </p>

          <Link
            href="/shows"
            className="inline-block bg-zinc-900 hover:bg-zinc-800 px-6 py-3 rounded-lg font-semibold"
          >
            View All Shows →
          </Link>
        </div>
      </section>

      {/* =========================
         VENUES WE SERVE
      ========================= */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-12">
            Venues We Serve
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Red Rocks */}
            <Link href="/venues/red-rocks-amphitheatre">
              <div className="group cursor-pointer rounded-2xl overflow-hidden border border-zinc-800 hover:border-red-600 transition">
                <Image
                  src="/venues/rrsite.jpg"
                  alt="Red Rocks Amphitheatre"
                  width={800}
                  height={500}
                  className="object-cover object-top h-64 w-full"
                />
                <div className="p-5 font-semibold">
                  Red Rocks Amphitheatre
                </div>
              </div>
            </Link>

            {/* Mishawaka */}
            <Link href="/venues/mishawaka-amphitheatre">
              <div className="group cursor-pointer rounded-2xl overflow-hidden border border-zinc-800 hover:border-red-600 transition">
                <Image
                  src="/venues/mishsite.jpg"
                  alt="Mishawaka Amphitheatre"
                  width={800}
                  height={500}
                  className="object-cover object-top h-64 w-full"
                />
                <div className="p-5 font-semibold">
                  Mishawaka Amphitheatre
                </div>
              </div>
            </Link>

            {/* All Venues */}
            <Link href="/book-all-venues">
              <div className="group cursor-pointer rounded-2xl overflow-hidden border border-zinc-800 hover:border-red-600 transition">
                <Image
                  src="/venues/missionsite.jpg"
                  alt="All Venues Shuttle"
                  width={800}
                  height={500}
                  className="object-cover object-top h-64 w-full"
                />
                <div className="p-5 font-semibold">
                  All-Venues Shuttle
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* =========================
         THE FLEET
      ========================= */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-12">
            The Fleet
          </h2>

          <div className="grid md:grid-cols-2 gap-12">

            {/* Sprinter Shuttle */}
            <Link href="/book-shuttle">
              <div className="cursor-pointer rounded-3xl overflow-hidden border border-zinc-800 hover:border-red-600 transition">
                <Image
                  src="/fleet/fleet-sprinter.jpg"
                  alt="Sprinter Shuttle"
                  width={900}
                  height={600}
                  className="object-cover object-top h-[380px] w-full"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold">
                    Sprinter Shuttle
                  </h3>
                  <p className="text-zinc-400 mt-1">
                    $50 per person · Denver & Boulder · Drink & vape allowed
                  </p>
                </div>
              </div>
            </Link>

            {/* Private Suburban */}
            <Link href="/private-suburban">
              <div className="cursor-pointer rounded-3xl overflow-hidden border border-zinc-800 hover:border-red-600 transition">
                <Image
                  src="/fleet/fleet-suburban.jpg"
                  alt="Private Suburban"
                  width={900}
                  height={600}
                  className="object-cover object-top h-[380px] w-full"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold">
                    Private Suburban
                  </h3>
                  <p className="text-zinc-400 mt-1">
                    $300 minimum · Door-to-door · Your group, your music
                  </p>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* =========================
         FINAL CTA
      ========================= */}
      <section className="py-32 px-6 bg-zinc-950 text-center">
        <h2 className="text-5xl font-black mb-6">
          Don’t Drive to the Show.
        </h2>
        <p className="text-zinc-400 max-w-xl mx-auto mb-10">
          Let us handle the ride so you can focus on the music.
        </p>
        <Link
          href="/book-shuttle"
          className="bg-red-600 hover:bg-red-500 px-10 py-5 rounded-full font-bold"
        >
          Book Now
        </Link>
      </section>

    </main>
  );
}
