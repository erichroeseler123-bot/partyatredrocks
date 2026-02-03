import Link from 'next/link';
import { notFound } from 'next/navigation';

// -----------------------------------------------------------------------------
// 1. Static venue metadata (you can later move this to a DB / JSON file)
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
  // ← add more venues here as needed
};

type Venue = (typeof venueData)[keyof typeof venueData];

// -----------------------------------------------------------------------------
// 2. Fetch SeatGeek events for the venue
async function getEventsForVenue(venueSlug: string) {
  const venue = venueData[venueSlug as keyof typeof venueData];
  if (!venue) return [];

  // You need to replace this with your real SeatGeek client_id
  const clientId = process.env.SEATGEEK_CLIENT_ID;

  if (!clientId) {
    console.error('Missing SEATGEEK_CLIENT_ID');
    return [];
  }

  const venueNameForApi = venue.name
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '-');

  const url = `https://api.seatgeek.com/2/events?client_id=${clientId}&venue.name=${encodeURIComponent(venue.name)}&per_page=30&sort=datetime_utc`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1 hour
    if (!res.ok) throw new Error('SeatGeek fetch failed');
    const data = await res.json();
    return data.events || [];
  } catch (err) {
    console.error('SeatGeek error:', err);
    return [];
  }
}

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

        {/* Header */}
        <header className="mb-12 border-l-4 border-red-600 pl-8">
          <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
            {venue.name}
          </h1>
          <p className="mt-3 text-xl text-zinc-400">
            {venue.location} — {venue.capacity} capacity
          </p>
          <p className="mt-4 text-zinc-300 max-w-3xl">
            {venue.description}
          </p>
        </header>

        {/* Shuttle CTA — very prominent */}
        <div className="mb-16 bg-zinc-900/70 border border-zinc-800 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-black mb-4">Get There & Back — No Stress</h2>
          <p className="text-xl text-zinc-300 mb-8">
            $50 / person • $250 group minimum • Door-to-door pickup • We wait after the show
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/book-all-venue"
              className="bg-red-600 hover:bg-red-500 px-10 py-5 rounded-full font-black uppercase text-lg shadow-xl transition"
            >
              Book All-Venue Shuttle →
            </Link>
            <Link
              href="/shuttles/all-venue"
              className="border border-zinc-600 hover:border-zinc-400 px-10 py-5 rounded-full font-medium text-lg transition"
            >
              See how it works
            </Link>
          </div>
          <p className="mt-6 text-sm text-zinc-500">
            Pickup from any Denver / Boulder hotel, Airbnb or residence
          </p>
        </div>

        {/* Upcoming Shows */}
        <section>
          <h2 className="text-3xl font-black mb-8 border-b border-zinc-800 pb-4">
            Upcoming Shows at {venue.name}
          </h2>

          {events.length === 0 ? (
            <p className="text-zinc-500 text-lg">
              No upcoming events found right now. Check SeatGeek or the venue site for the latest.
            </p>
          ) : (
            <div className="space-y-6">
              {events.slice(0, 10).map((event: any) => (
                <div
                  key={event.id}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-xl font-bold">{event.title}</h3>
                      <p className="text-zinc-400 mt-1">
                        {new Date(event.datetime_utc).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
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
                        className="shrink-0 bg-zinc-800 hover:bg-zinc-700 px-5 py-2 rounded-full text-sm font-medium"
                      >
                        Tickets
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {events.length > 10 && (
                <p className="text-center text-zinc-500 mt-6">
                  Showing first 10 events • More on SeatGeek
                </p>
              )}
            </div>
          )}
        </section>

        {/* Quick Venue Shuttle Notes */}
        <section className="mt-16">
          <h3 className="text-2xl font-black mb-6">Why We’re the Best Choice for {venue.name}</h3>
          <ul className="space-y-3 text-zinc-300 list-disc pl-6">
            <li>Door-to-door pickup from any location — no parking / walking</li>
            <li>We wait for you after the show — no surge pricing or long waits</li>
            <li>BYOB + vape friendly (private Suburban / van / party bus)</li>
            <li>Group pricing starts at $250 — perfect for crews</li>
            <li>{venue.pickupNote}</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

// Optional: generate static params if you want SSG for known venues
export async function generateStaticParams() {
  return Object.keys(venueData).map((slug) => ({ slug }));
}
