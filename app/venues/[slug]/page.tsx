import Link from 'next/link';
import { notFound } from 'next/navigation';

// -----------------------------------------------------------------------------
// 1. Static Venue Intelligence Metadata
// -----------------------------------------------------------------------------
const venueData = {
  'mission-ballroom': {
    name: 'Mission Ballroom',
    slug: 'mission-ballroom',
    location: 'RiNo, Denver',
    capacity: '3,950',
    address: '4242 Wynkoop St, Denver, CO 80216',
    description: 'Modern warehouse-style venue with excellent sound and huge dance floor. Post-show exit can be chaotic — our shuttle waits right at the main entrance.',
    pickupNote: 'Best pickup: 38th & Blake St (short walk, easy access).',
  },
  'ball-arena': {
    name: 'Ball Arena',
    slug: 'ball-arena',
    location: 'Downtown Denver',
    capacity: '20,000',
    address: '1000 Chopper Cir, Denver, CO 80204',
    description: 'Massive arena for big acts. Parking nightmare + long Uber waits after shows. We drop at the main entrance and wait for you.',
    pickupNote: 'Best pickup: Pepsi Center area lots or nearby hotels.',
  },
  'fiddlers-green': {
    name: "Fiddler's Green Amphitheatre",
    slug: 'fiddlers-green',
    location: 'Greenwood Village',
    capacity: '18,000 (7,200 covered)',
    address: '6350 Greenwood Plaza Blvd, Greenwood Village, CO 80111',
    description: 'Outdoor amphitheatre with lawn seating. Traffic on I-25 is brutal after shows — our shuttle avoids all of that.',
    pickupNote: 'Best pickup: Nearby hotels or park-and-ride lots.',
  },
  'ogden-theatre': {
    name: 'Ogden Theatre',
    slug: 'ogden-theatre',
    location: 'Colfax, Denver',
    capacity: '1,600',
    address: '935 E Colfax Ave, Denver, CO 80218',
    description: 'Historic, intimate rock venue. Limited street parking — we pick you up from any Colfax / Capitol Hill address.',
    pickupNote: 'Door-to-door from any Colfax-area hotel / Airbnb.',
  },
  'fillmore-auditorium': {
    name: 'Fillmore Auditorium',
    slug: 'fillmore-auditorium',
    location: 'Colfax, Denver',
    capacity: '3,900',
    address: '1510 Clarkson St, Denver, CO 80218',
    description: 'Large historic theatre with balcony. Post-show crowds spill onto Colfax — our shuttle waits nearby.',
    pickupNote: 'Easy pickup from Colfax Ave or nearby parking garages.',
  },
  'red-rocks': {
    name: 'Red Rocks Amphitheatre',
    slug: 'red-rocks',
    location: 'Morrison, CO',
    capacity: '9,545',
    address: '18300 W Alameda Pkwy, Morrison, CO 80465',
    description: 'The world\'s premier outdoor venue. Our flagship service drops at the Top Circle (Row 70) to avoid the 380-stair climb.',
    pickupNote: 'Pickup at Lower South Lot B for shared shuttles; Top Circle for private.',
  },
  'bluebird-theater': {
    name: 'Bluebird Theater',
    slug: 'bluebird-theater',
    location: 'Colfax, Denver',
    capacity: '550',
    address: '3317 E Colfax Ave, Denver, CO 80206',
    description: 'Intimate historic theater. Parking is extremely limited on Colfax — door-to-door shuttle is the only way to arrive stress-free.',
    pickupNote: 'Best pickup: Directly in front of the theater on Colfax.',
  },
  'gothic-theatre': {
    name: 'Gothic Theatre',
    slug: 'gothic-theatre',
    location: 'Englewood, CO',
    capacity: '1,100',
    address: '3263 S Broadway, Englewood, CO 80113',
    description: 'A former movie palace turned premier rock venue. We provide direct transport from Denver/Boulder hotels.',
    pickupNote: 'Best pickup: South Broadway main entrance.',
  },
};

type Venue = (typeof venueData)[keyof typeof venueData];

// -----------------------------------------------------------------------------
// 2. Fetch Live Show Data (SeatGeek API)
// -----------------------------------------------------------------------------
async function getEventsForVenue(venueSlug: string) {
  const venue = venueData[venueSlug as keyof typeof venueData];
  if (!venue) return [];

  const clientId = process.env.SEATGEEK_CLIENT_ID;

  if (!clientId) {
    console.error('Missing SEATGEEK_CLIENT_ID in environment variables.');
    return [];
  }

  const url = `https://api.seatgeek.com/2/events?client_id=${clientId}&venue.name=${encodeURIComponent(venue.name)}&per_page=15&sort=datetime_utc`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache results for 1 hour
    if (!res.ok) throw new Error('SeatGeek fetch failed');
    const data = await res.json();
    return data.events || [];
  } catch (err) {
    console.error('SeatGeek API Error:', err);
    return [];
  }
}

// -----------------------------------------------------------------------------
// 3. Dynamic Page Component
// -----------------------------------------------------------------------------
export default async function VenuePage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const venue = venueData[slug as keyof typeof venueData] as Venue | undefined;

  if (!venue) {
    notFound();
  }

  const events = await getEventsForVenue(slug);

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header Intelligence */}
        <header className="mb-12 border-l-4 border-red-600 pl-8">
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
            {venue.name}
          </h1>
          <p className="mt-3 text-xl text-zinc-400 font-bold">
            {venue.location} — {venue.capacity} Capacity
          </p>
          <p className="mt-4 text-zinc-300 max-w-3xl leading-relaxed">
            {venue.description}
          </p>
        </header>

        {/* City Service Conversion Hub */}
        <div className="mb-16 bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl">
          <h2 className="text-3xl font-black mb-4 uppercase italic italic tracking-tighter">Get There & Back — No Stress</h2>
          <p className="text-xl text-zinc-300 mb-8 font-medium italic">
            $50 / Person • $250 Group Minimum • Door-to-Door • We Wait After the Show
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/book-all-venue"
              className="bg-red-600 hover:bg-red-500 px-10 py-5 rounded-full font-black uppercase text-lg shadow-xl transition transform hover:scale-105"
            >
              Book All-Venue Shuttle →
            </Link>
            <Link
              href="/shuttles/all-venue"
              className="border border-zinc-700 hover:border-zinc-500 px-10 py-5 rounded-full font-bold text-lg transition bg-zinc-950/50"
            >
              How It Works
            </Link>
          </div>
          <p className="mt-6 text-sm text-zinc-500 font-bold uppercase tracking-widest">
            Pickup from any Denver / Boulder Hotel, Airbnb, or Residence
          </p>
        </div>

        {/* Live Show Schedule */}
        <section>
          <h2 className="text-3xl font-black mb-8 border-b border-zinc-800 pb-4 uppercase italic tracking-tighter">
            Upcoming Shows at {venue.name}
          </h2>

          {events.length === 0 ? (
            <p className="text-zinc-500 text-lg italic">
              No upcoming events found right now. Check SeatGeek or the venue site for the latest updates.
            </p>
          ) : (
            <div className="space-y-6">
              {events.slice(0, 10).map((event: any) => (
                <div
                  key={event.id}
                  className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 hover:border-red-600/50 transition-all shadow-sm"
                >
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <h3 className="text-xl font-black uppercase italic text-white">{event.title}</h3>
                      <p className="text-zinc-500 mt-1 font-bold text-sm">
                        {new Date(event.datetime_utc).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}
                        {' • '}
                        {new Date(event.datetime_utc).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {event.url && (
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 bg-zinc-800 hover:bg-zinc-700 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition shadow-md"
                      >
                        Tickets
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Venue-Specific Logistics */}
        <section className="mt-20 p-10 bg-zinc-950 rounded-[2.5rem] border border-zinc-900">
          <h3 className="text-2xl font-black mb-6 uppercase italic text-red-600 italic tracking-tighter">The Best Choice for {venue.name}</h3>
          <ul className="space-y-4 text-zinc-400 font-bold text-sm leading-relaxed">
            <li className="flex gap-3"><span>•</span> <span>Door-to-door pickup from any location — no parking or walking through industrial areas.</span></li>
            <li className="flex gap-3"><span>•</span> <span>We wait for you after the show — avoid the 60-minute Uber queue and surge pricing.</span></li>
            <li className="flex gap-3"><span>•</span> <span>BYOB + Vape Friendly vehicles (Private Suburbans and Sprinter Vans).</span></li>
            <li className="flex gap-3"><span>•</span> <span>Fixed group pricing — perfect for concert crews.</span></li>
            <li className="flex gap-3 text-white italic"><span>•</span> <span>{venue.pickupNote}</span></li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(venueData).map((slug) => ({ slug }));
}
