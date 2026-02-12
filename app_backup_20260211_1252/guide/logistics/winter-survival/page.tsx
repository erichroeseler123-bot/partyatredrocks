import Link from 'next/link';

export default function WinterSurvival() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 bg-surface text-white">
      <h1 className="text-5xl font-black mb-6 italic uppercase tracking-tighter">
        Red Rocks <span className="text-blue-500">Winter Survival</span> Guide 2026
      </h1>
      
      <p className="text-xl text-zinc-400 mb-10 leading-relaxed">
        March and April at Red Rocks are unpredictable. While Denver might feel like spring, the amphitheater sits at <strong>6,450 feet</strong>—nearly 1,000 feet higher than the city—meaning temperatures drop drastically once the sun dips.
      </p>

      <section className="mb-12 bg-surface-strong border border-blue-900/50 p-8 rounded-3xl">
        <h3 className="text-blue-400 font-bold uppercase mb-4 italic">The "20-Degree" Rule</h3>
        <p className="text-lg">Always assume the venue temperature is <strong>20 degrees colder</strong> than the Denver forecast. Wind "howls" through the rocks and is the primary cause of mid-show chills.</p>
      </section>

      <h2 className="text-3xl font-black uppercase mb-6 italic">Essential Gear List</h2>
      <ul className="space-y-6 mb-12">
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

      <div className="bg-blue-600 text-white p-10 rounded-3xl text-center shadow-2xl">
        <h2 className="text-3xl font-black mb-4 uppercase">Heated Return Transport</h2>
        <p className="text-lg mb-8">
          Don't wait 90 minutes in a frozen lot for an Uber. Our heated Sprinters wait at the Top Circle 30 minutes post-encore.
        </p>
        <Link href="/book-shuttle" className="inline-block bg-white text-blue-600 px-10 py-4 rounded-full font-black uppercase hover:bg-zinc-100 transition shadow-lg">
          Book Your Warm Ride
        </Link>
      </div>
    </div>
  );
}
