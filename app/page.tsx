import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="bg-black text-white tracking-tight antialiased">

      {/* =========================
         HERO
      ========================= */}
      <section className="relative h-[85vh] flex items-center">
        <Image
          src="/hero/hero-home.jpg"
          alt="Party at Red Rocks"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <h1 className="text-6xl md:text-7xl font-black italic">
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
              href="/venues/red-rocks-amphitheatre"
              className="border border-white/30 hover:border-white px-8 py-4 rounded-full font-semibold"
            >
              View Shows
            </Link>
          </div>
        </div>
      </section>

      <div className="h-px bg-zinc-800 my-28" />

      {/* =========================
         VENUES
      ========================= */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-12">Venues We Serve</h2>

          <div className="grid md:grid-cols-3 gap-8">

            <Link href="/venues/red-rocks-amphitheatre">
              <div className="rounded-2xl overflow-hidden border border-zinc-800 hover:border-red-600 transition cursor-pointer">
                <Image
                  src="/venues/rrsite.jpg"
                  alt="Red Rocks Amphitheatre"
                  width={800}
                  height={500}
                  className="h-64 w-full object-cover object-top"
                />
                <div className="p-5 font-semibold">Red Rocks Amphitheatre</div>
              </div>
            </Link>

            <Link href="/venues/mishawaka-amphitheatre">
              <div className="rounded-2xl overflow-hidden border border-zinc-800 hover:border-red-600 transition cursor-pointer">
                <Image
                  src="/venues/mishsite.jpg"
                  alt="Mishawaka Amphitheatre"
                  width={800}
                  height={500}
                  className="h-64 w-full object-cover object-top"
                />
                <div className="p-5 font-semibold">Mishawaka Amphitheatre</div>
              </div>
            </Link>

            <Link href="/book-all-venues">
              <div className="rounded-2xl overflow-hidden border border-zinc-800 hover:border-red-600 transition cursor-pointer">
                <Image
                  src="/venues/missionsite.jpg"
                  alt="All Venues Shuttle"
                  width={800}
                  height={500}
                  className="h-64 w-full object-cover object-top"
                />
                <div className="p-5 font-semibold">All Venues Shuttle</div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      <div className="h-px bg-zinc-800 my-28" />

      {/* =========================
         FLEET (FIXED CROPPING)
      ========================= */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-12">The Fleet</h2>

          <div className="grid md:grid-cols-2 gap-12">

            <Link href="/book-shuttle">
              <div className="group rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 hover:border-red-600 shadow-xl transition cursor-pointer">
                <Image
                  src="/fleet/fleet-sprinter.jpg"
                  alt="Sprinter Shuttle"
                  width={900}
                  height={600}
                  className="h-[420px] w-full object-cover object-[50%_20%] transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold">Sprinter Shuttle</h3>
                  <p className="text-zinc-400 mt-1">
                    Denver & Golden · $59–$65 · Drink & vape allowed
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/private-suburban">
              <div className="group rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 hover:border-red-600 shadow-xl transition cursor-pointer">
                <Image
                  src="/fleet/fleet-suburban.jpg"
                  alt="Private Suburban"
                  width={900}
                  height={600}
                  className="h-[420px] w-full object-cover object-[50%_25%] transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold">Private Suburban</h3>
                  <p className="text-zinc-400 mt-1">
                    $499 flat · Door-to-door · Your group, your music
                  </p>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

    </main>
  );
}
