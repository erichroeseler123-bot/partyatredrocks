import Image from 'next/image';
import Link from 'next/link';

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
            Concert transportation, done right. Shuttles, private SUVs,
            and zero stress getting home.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/book-shuttle"
              className="bg-red-600 hover:bg-red-500 px-8 py-4 font-black uppercase tracking-wide rounded-full"
            >
              Book a Shuttle
            </Link>
<Link
  href="/private-suburban"
  className="bg-blue-600 hover:bg-blue-500 px-8 py-4 font-bold uppercase rounded-full transition text-white"
>
  Private SUV
</Link>
          </div>
        </div>
      </section>

      {/* ================= SHOWS CTA ================= */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-black italic uppercase mb-6">
          Upcoming Red Rocks Shows
        </h2>
        <p className="text-zinc-400 mb-8 max-w-2xl">
          Browse upcoming concerts at Red Rocks and book your ride in advance.
        </p>

        <Link
          href="/venues/red-rocks-amphitheatre"
          className="text-red-500 font-black uppercase tracking-widest hover:text-red-400"
        >
          View Red Rocks Shows →
        </Link>
      </section>

      {/* ================= VENUES ================= */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black italic uppercase mb-12">
            Venues We Serve
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <VenueCard
              href="/venues/red-rocks-amphitheatre"
              image="/venues/rrsite.jpg"
              title="Red Rocks Amphitheatre"
            />
            <VenueCard
              href="/venues/mishawaka-amphitheatre"
              image="/venues/mishsite.jpg"
              title="Mishawaka Amphitheatre"
            />
            <VenueCard
              href="/venues"
  className="bg-zinc-800 hover:bg-zinc-700 px-8 py-4 font-bold uppercase rounded-full transition text-white"
              image="/venues/missionsite.jpg"
              title="All Venues Shuttle"
            />
          </div>
        </div>
      </section>

      {/* ================= FLEET ================= */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-black italic uppercase mb-12">
          Our Fleet
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FleetCard
            image="/fleet/fleet-sprinter.jpg"
            title="Sprinter Shuttle"
            desc="Shared concert shuttles from Denver & Golden"
          />
          <FleetCard
            image="/fleet/fleet-suburban.jpg"
            title="Private Suburban"
            desc="Private SUV service for up to 6 guests"
          />
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 px-6 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black italic uppercase">
            Don’t Drive. Don’t Stress.
          </h2>
          <p className="mt-6 text-zinc-400 text-lg">
            Book your ride, enjoy the show, and we’ll handle the rest.
          </p>

          <Link
            href="/book-shuttle"
            className="inline-block mt-10 bg-red-600 hover:bg-red-500 px-10 py-5 font-black uppercase tracking-wide rounded-full"
          >
            Book Now
          </Link>
        </div>
      </section>

    </main>
  );
}

/* ================= COMPONENTS ================= */

function VenueCard({
  href,
  image,
  title,
}: {
  href: string;
  image: string;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl overflow-hidden border border-zinc-800"
    >
      <Image
        src={image}
        alt={title}
        width={800}
        height={500}
        className="object-cover h-64 w-full group-hover:scale-105 transition"
      />
      <div className="p-6 font-black uppercase">{title}</div>
    </Link>
  );
}

function FleetCard({
  image,
  title,
  desc,
}: {
  image: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-3xl overflow-hidden border border-zinc-800">
      <Image
        src={image}
        alt={title}
        width={800}
        height={500}
        className="object-cover h-64 w-full"
      />
      <div className="p-6">
        <h3 className="font-black uppercase">{title}</h3>
        <p className="text-zinc-400 text-sm mt-2">{desc}</p>
      </div>
    </div>
  );
}
