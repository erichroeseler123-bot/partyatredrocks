import Image from "next/image";
import Link from "next/link";
import FleetGrid from "@/components/FleetGrid";
import VenueShows from "@/components/VenueShows";

export default function HomePage() {
  return (
    <main className="bg-black text-white">
      {/* =========================
          SECTION 1 — HERO
         ========================= */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <Image
          src="/hero/hero-home.jpg"
          alt="Party at Red Rocks Transportation"
          fill
          priority
          className="object-cover object-top"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto h-full flex flex-col justify-end px-6 pb-24">
          <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-none">
            Get to the Show.
            <br />
            <span className="text-red-500">We Handle the Rest.</span>
          </h1>

          <p className="mt-6 text-lg text-zinc-300 max-w-xl">
            Premium concert transportation for Red Rocks and Colorado venues.
            Drink, play music, skip parking — we wait and take you home.
          </p>

          <div className="mt-10 flex gap-4">
            <Link
              href="/book-shuttle"
              className="bg-red-600 hover:bg-red-500 px-8 py-4 font-bold uppercase tracking-wide"
            >
              Book Shuttle
            </Link>
            <Link
              href="/private-suburban"
              className="border border-zinc-600 hover:border-white px-8 py-4 font-bold uppercase tracking-wide"
            >
              Private SUV
            </Link>
          </div>
        </div>
      </section>

      {/* =========================
          SECTION 2 — SHOWS
         ========================= */}
      <section className="py-28 px-6 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black mb-10">
            Upcoming Shows
          </h2>

          {/* SeatGeek-powered, unchanged */}
          <VenueShows />
        </div>
      </section>

      {/* =========================
          SECTION 3 — VENUES
         ========================= */}
      <section className="py-28 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black mb-12">
            Covered Venues
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Red Rocks */}
            <Link href="/venues/red-rocks-amphitheatre" className="group">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/venues/rrsite.jpg"
                  alt="Red Rocks Amphitheatre"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-6 left-6 font-black text-2xl">
                  Red Rocks
                </div>
              </div>
            </Link>

            {/* Mishawaka */}
            <div className="relative h-64 overflow-hidden opacity-80">
              <Image
                src="/venues/mishsite.jpg"
                alt="Mishawaka Amphitheatre"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute bottom-6 left-6 font-black text-2xl">
                Mishawaka
              </div>
            </div>

            {/* All Venues */}
            <div className="relative h-64 overflow-hidden opacity-80">
              <Image
                src="/venues/missionsite.jpg"
                alt="All Venues Shuttle"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute bottom-6 left-6 font-black text-2xl">
                All Venues
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          SECTION 4 — FLEET
         ========================= */}
      <section className="py-28 px-6 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black mb-12">
            The Fleet
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Sprinter */}
            <div className="relative h-80 overflow-hidden">
              <Image
                src="/fleet/fleet-sprinter.jpg"
                alt="Sprinter Shuttle"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-6 left-6">
                <div className="text-2xl font-black">Sprinter Shuttle</div>
                <div className="text-zinc-300 text-sm uppercase">
                  Shared • Party Friendly
                </div>
              </div>
            </div>

            {/* Suburban */}
            <div className="relative h-80 overflow-hidden">
              <Image
                src="/fleet/fleet-suburban.jpg"
                alt="Private Suburban SUV"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-6 left-6">
                <div className="text-2xl font-black">Private Suburban</div>
                <div className="text-zinc-300 text-sm uppercase">
                  VIP • On Your Schedule
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          SECTION 5 — CTA
         ========================= */}
      <section className="py-24 px-6 bg-black text-center">
        <h2 className="text-5xl font-black mb-6">
          Don’t Drive to the Show.
        </h2>
        <p className="text-zinc-400 max-w-xl mx-auto mb-10">
          Let us handle the ride so you can focus on the music.
        </p>

        <Link
          href="/book-shuttle"
          className="inline-block bg-red-600 hover:bg-red-500 px-10 py-5 font-black uppercase tracking-wide"
        >
          Book Now
        </Link>
      </section>
    </main>
  );
}
