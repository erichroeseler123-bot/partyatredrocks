import Link from 'next/link';

export default function WinterSurvival() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 bg-surface text-white">
      <h1 className="text-5xl font-black mb-6 italic uppercase tracking-tighter">
        Red Rocks <span className="text-[#4cc9f0]">Winter Survival</span> Guide 2026
      </h1>
      
      <p className="text-xl text-muted mb-16 leading-relaxed">
        March and April at Red Rocks are unpredictable. While Denver might feel like spring, the amphitheater sits at <strong>6,450 feet</strong>—nearly 1,000 feet higher than the city—meaning temperatures drop drastically once the sun dips.
      </p>

      <section className="mb-16 rounded-3xl border border-[#3df3ff]/25 bg-surface-strong p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <h3 className="mb-4 font-bold uppercase italic text-[#4cc9f0]">The "20-Degree" Rule</h3>
        <p className="text-lg">Always assume the venue temperature is <strong>20 degrees colder</strong> than the Denver forecast. Wind "howls" through the rocks and is the primary cause of mid-show chills.</p>
      </section>

      <h2 className="text-3xl font-black uppercase mb-6 italic">Essential Gear List</h2>
      <ul className="space-y-6 mb-16">
        <li className="flex items-start gap-4">
          <span className="text-2xl">🧊</span>
          <div>
            <strong>The "Butt Shield":</strong> Stone benches stay frozen all night. Bring a stadium seat cushion (under 18&quot; wide, no legs) to stay off the rock.
          </div>
        </li>
        <li className="flex items-start gap-4">
          <span className="text-2xl">🧤</span>
          <div>
            <strong>Waterproof Footwear:</strong> The rows can puddle with melting snow. Pair boots with <strong>thick wool socks</strong> to prevent numb toes.
          </div>
        </li>
        <li className="flex items-start gap-4">
          <span className="text-2xl">🧥</span>
          <div>
            <strong>Top Circle Drop-off:</strong> Our shuttles drop at Row 70. Keep your heavy layers on until the last second instead of sweating through them on a 1-mile hike from lower lots.
          </div>
        </li>
      </ul>

      <div className="rounded-3xl border border-[#3df3ff]/30 bg-[linear-gradient(180deg,rgba(61,243,255,0.18),rgba(29,191,211,0.16))] p-10 text-center text-white shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <h2 className="text-3xl font-black mb-4 uppercase">Heated Return Transport</h2>
        <p className="text-lg mb-16">
          Don't wait 90 minutes in a frozen lot for an Uber. Our heated Sprinters wait at the Top Circle 30 minutes post-encore.
        </p>
        <Link href="/book" className="inline-block rounded-full bg-[#3df3ff] px-10 py-4 font-black uppercase text-[#08111e] transition shadow-lg hover:bg-[#62f6ff]">
          Book Your Warm Ride
        </Link>
      </div>
    </div>
  );
}
