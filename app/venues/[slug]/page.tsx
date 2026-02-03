import Link from 'next/link';
import { notFound } from 'next/navigation';

// -----------------------------------------------------------------------------
// 1. MASTER UNIFIED DATABASE (Matches all 21 links in /shuttles/all-venue)
// -----------------------------------------------------------------------------
const venueData = {
  'mission-ballroom': { name: 'Mission Ballroom', location: 'RiNo, Denver', address: '4242 Wynkoop St, Denver, CO 80216', pickupNote: '38th & Blake St.' },
  'ball-arena': { name: 'Ball Arena', location: 'Downtown Denver', address: '1000 Chopper Cir, Denver, CO 80204', pickupNote: 'Downtown hotel hub.' },
  'fiddlers-green': { name: "Fiddler's Green Amphitheatre", location: 'Greenwood Village', address: '6350 Greenwood Plaza Blvd, Greenwood Village, CO 80111', pickupNote: 'DTC hotel corridor.' },
  'ogden-theatre': { name: 'Ogden Theatre', location: 'Colfax, Denver', address: '935 E Colfax Ave, Denver, CO 80218', pickupNote: 'Colfax door-to-door.' },
  'fillmore-auditorium': { name: 'Fillmore Auditorium', location: 'Colfax, Denver', address: '1510 Clarkson St, Denver, CO 80218', pickupNote: 'Clarkson St entrance.' },
  'bluebird-theater': { name: 'Bluebird Theater', location: 'East Colfax, Denver', address: '3317 E Colfax Ave, Denver, CO 80206', pickupNote: 'East Colfax pickup.' },
  'paramount-theatre': { name: 'Paramount Theatre', location: 'Downtown Denver', address: '1621 Glenarm Pl, Denver, CO 80202', pickupNote: 'Glenarm Pl entrance.' },
  'summit-music-hall': { name: 'Summit Music Hall', location: 'LoDo, Denver', address: '1902 Blake St, Denver, CO 80202', pickupNote: 'Blake St entrance.' },
  'marquis-theater': { name: 'Marquis Theater', location: 'Downtown Denver', address: '2009 Larimer St, Denver, CO 80205', pickupNote: 'Larimer St hub.' },
  'gothic-theatre': { name: 'Gothic Theatre', location: 'Englewood, CO', address: '3263 S Broadway, Englewood, CO 80113', pickupNote: 'South Broadway hub.' },
  'cervantes-masterpiece': { name: "Cervantes' Masterpiece", location: 'Five Points, Denver', address: '2637 Welton St, Denver, CO 80205', pickupNote: 'RiNo/Five Points.' },
  'boulder-theater': { name: 'Boulder Theater', location: 'Boulder, CO', address: '2032 14th St, Boulder, CO 80302', pickupNote: 'Pearl St access.' },
  'fox-theatre': { name: 'Fox Theatre', location: 'Boulder, CO', address: '1135 13th St, Boulder, CO 80302', pickupNote: 'The Hill hub.' },
  'meow-wolf-denver': { name: 'Meow Wolf Denver', location: 'Sun Valley, Denver', address: '1338 1st St, Denver, CO 80204', pickupNote: 'Art District access.' },
  'ophelias-electric-soapbox': { name: "Ophelia's Electric Soapbox", location: 'LoDo, Denver', address: '1215 20th St, Denver, CO 80202', pickupNote: 'LoDo entrance.' },
  'chautauqua-auditorium': { name: 'Chautauqua Auditorium', location: 'Boulder, CO', address: '900 Baseline Rd, Boulder, CO 80302', pickupNote: 'Chautauqua Park.' },
  'macky-auditorium': { name: 'Macky Auditorium', location: 'Boulder, CO', address: '1595 Pleasant St, Boulder, CO 80309', pickupNote: 'Campus door-to-door.' },
  'velvet-elk-lounge': { name: 'Velvet Elk Lounge', location: 'Boulder, CO', address: '2037 13th St, Boulder, CO 80302', pickupNote: 'Pearl St entrance.' },
  'empower-field': { name: 'Empower Field', location: 'Denver, CO', address: '1701 Bryant St, Denver, CO 80204', pickupNote: 'Stadium hub.' },
  'dick-sporting-goods-park': { name: "Dick's Sporting Goods Park", location: 'Commerce City, CO', address: '6000 Victory Way, Commerce City, CO 80022', pickupNote: 'Commerce City.' },
  'folsom-field': { name: 'Folsom Field', location: 'Boulder, CO', address: '2400 Colorado Ave, Boulder, CO 80310', pickupNote: 'Boulder Stadium.' }
};

// -----------------------------------------------------------------------------
// 2. LOGIC & COMPONENT
// -----------------------------------------------------------------------------
async function getEvents(venueName: string) {
  const clientId = process.env.SEATGEEK_CLIENT_ID;
  if (!clientId) return [];
  const url = `https://api.seatgeek.com/2/events?client_id=${clientId}&venue.name=${encodeURIComponent(venueName)}&per_page=10`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.events || [];
  } catch (e) { return []; }
}

export default async function VenuePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const venue = venueData[slug as keyof typeof venueData];
  if (!venue) notFound();

  const events = await getEvents(venue.name);

  return (
    <main className="min-h-screen bg-black text-white py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 border-l-4 border-red-600 pl-8">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">{venue.name}</h1>
          <p className="mt-3 text-xl text-zinc-400 font-bold uppercase tracking-widest">{venue.location}</p>
        </header>

        {/* Dynamic Schedule Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-black mb-8 border-b border-zinc-800 pb-4 uppercase italic">Show Intelligence</h2>
          <div className="space-y-4">
            {events.length > 0 ? events.map((event: any) => (
              <div key={event.id} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex justify-between items-center hover:border-red-600 transition-all shadow-xl">
                <div>
                  <h3 className="text-xl font-black uppercase italic">{event.title}</h3>
                  <p className="text-zinc-500 font-bold text-sm uppercase">{new Date(event.datetime_local).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-4">
                  {event.url && (
                    <a href={event.url} target="_blank" rel="noopener noreferrer" className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition">Tickets</a>
                  )}
                  <Link href="/book-all-venue" className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition shadow-lg">Book Ride</Link>
                </div>
              </div>
            )) : <p className="text-zinc-500 italic">No upcoming shows found. Check back soon for updates.</p>}
          </div>
        </section>

        {/* Location & Map Hub */}
        <section className="mb-20">
          <h3 className="text-2xl font-black mb-6 uppercase italic tracking-tighter">Location & Directions</h3>
          <p className="text-zinc-400 mb-6 font-medium tracking-wide">{venue.address}</p>
          <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-zinc-800 shadow-2xl relative">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(venue.address)}`}
              width="100%" height="100%" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }} allowFullScreen loading="lazy"
            ></iframe>
          </div>
          <div className="mt-8 p-8 bg-zinc-900/30 rounded-3xl border border-zinc-800 flex justify-between items-center">
            <p className="text-zinc-400 text-sm font-medium">Pickup Intel: {venue.pickupNote} Reliable door-to-door service for any group size.</p>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.address)}`} target="_blank" rel="noopener noreferrer" className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition shrink-0 ml-6">Open Maps</a>
          </div>
        </section>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  return Object.keys(venueData).map((slug) => ({ slug }));
}
