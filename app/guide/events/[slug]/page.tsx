import { Metadata } from 'next';
import { getRedRocksEvents } from '@/lib/events'; // Ensure this path matches your lib location
import { getEventSchema } from '@/lib/schema'; // Ensure this path matches your lib location
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

// 1. Static Generation: Tell Next.js which pages to build at build-time
export async function generateStaticParams() {
  const events = await getRedRocksEvents();
  return events.map((event) => ({
    slug: event.slug,
  }));
}

// 2. Dynamic SEO: Generate unique titles and tags for Google
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const events = await getRedRocksEvents();
  const event = events.find((e) => e.slug === params.slug);

  if (!event) return { title: 'Event Not Found' };

  return {
    title: `${event.artist} Red Rocks Shuttle 2026 | No-Surge Pricing`,
    description: `Don't get stranded. Book your $55 round-trip shuttle for ${event.artist}. Top Circle drop-off at Row 70 included.`,
    openGraph: {
      title: `${event.artist} @ Red Rocks 2026`,
      description: `Official shuttle and logistics guide for ${event.artist}.`,
      images: [event.image || '/images/default-redrocks.jpg'],
    },
  };
}

// 3. The Authority Page Component
export default async function EventPage({ params }: Props) {
  const events = await getRedRocksEvents();
  const event = events.find((e) => e.slug === params.slug);

  if (!event) notFound();

  const schema = getEventSchema(event);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* JSON-LD Schema: The most important part for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="mb-8">
        <Link href="/guide" className="text-red-700 hover:underline flex items-center gap-2">
          ← Back to Venue Intelligence Hub
        </Link>
      </div>

      <header className="mb-12">
        <span className="text-red-700 font-bold uppercase tracking-widest text-sm">
          {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </span>
        <h1 className="text-5xl font-black mt-2 mb-6 text-slate-900">{event.artist} at Red Rocks</h1>
        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
          {event.description} Prepare for the 2026 tour stop with our professional shuttle and logistics intelligence.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
          <h3 className="text-red-700 font-bold mb-4 uppercase text-sm tracking-tighter">Shuttle Timing</h3>
          <ul className="space-y-4">
            <li className="flex justify-between border-b pb-2">
              <span className="font-medium">Denver Pickup (Sheraton)</span>
              <span className="font-bold">{event.pickupDenver || '5:00'} PM</span>
            </li>
            <li className="flex justify-between border-b pb-2">
              <span className="font-medium">Golden Pickup (Trailhead)</span>
              <span className="font-bold">{event.pickupGolden || '5:45'} PM</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium text-slate-500">Return Departure</span>
              <span className="font-bold text-slate-500">30 Min Post-Encore</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-3xl">
          <h3 className="text-red-400 font-bold mb-4 uppercase text-sm tracking-tighter">Pro Intelligence</h3>
          <p className="text-sm mb-4 italic">
            &quot;For {event.artist}, expect high merchandise lines at the new South Merch stand. We recommend heading in 45 minutes before set time.&quot;
          </p>
          <div className="text-xs text-slate-400">Source: Party at Red Rocks Intelligence Feed</div>
        </div>
      </div>

      <div className="bg-red-700 text-white p-12 rounded-3xl text-center shadow-2xl">
        <h2 className="text-white text-3xl font-black mb-4">SAVE YOUR SEAT</h2>
        <p className="text-xl mb-8 text-red-100">
          Average Uber surge for {event.artist} is projected at $165+. 
          Our fixed-rate $55 shuttle includes <strong>Top Circle Drop-off</strong>.
        </p>
        <Link href="/book-shuttle" className="inline-block bg-white text-red-700 px-12 py-4 rounded-full font-black text-xl hover:scale-105 transition transform shadow-lg no-underline">
          Book Round-Trip Shuttle
        </Link>
      </div>

      <footer className="mt-20 pt-8 border-t text-sm text-slate-400 italic">
        * Set times and logistics subject to venue changes. GoSno LLC is a Tier-1 PUC operator (LL-02649).
      </footer>
    </div>
  );
}
