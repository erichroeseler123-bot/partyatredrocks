// app/page.tsx
import Link from 'next/link';
import FleetGrid from '@/components/FleetGrid';

export default function HomePage() {
  return (
    <main className="bg-black text-white">
      
      {/* SECTION A: HERO — decision forcing */}
      <section
        className="relative h-[80vh] flex items-center justify-center text-center"
        style={{
          backgroundImage:
            "url('https://seatgeek.com/images/venues/red-rocks-amphitheatre-196/huge.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-4xl px-6">
          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            Concert Transportation.<br />No Driving. No Stress.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-200">
            Door-to-door shuttle and private SUV service for concerts across Denver & Boulder.
          </p>
          <Link
            href="/book-shuttle"
            className="inline-block mt-10 px-10 py-4 text-lg font-bold bg-red-600 hover:bg-red-700 transition"
          >
            Book Your Ride
          </Link>
        </div>
      </section>

      {/* SECTION B: HOW IT WORKS — clarity */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-black mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-10 text-lg">
          <div>
            <h3 className="font-bold mb-2">Pickups Anywhere</h3>
            <p className="text-gray-300">
              We pick you up anywhere in Denver or Boulder and get you to the show.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Ride How You Want</h3>
            <p className="text-gray-300">
              Drink, vape, play your music — it’s your ride.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">We Wait</h3>
            <p className="text-gray-300">
              After the show, your driver is waiting to take you home.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION C: FLEET — confidence */}
      <section className="bg-neutral-900 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-12">
            Our Fleet
          </h2>
          <FleetGrid />
        </div>
      </section>

    </main>
  );
}
