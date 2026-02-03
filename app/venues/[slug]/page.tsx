import Link from 'next/link';
import { notFound } from 'next/navigation';

// -----------------------------------------------------------------------------
// 1. Master Intelligence Database (With Unique SeatGeek IDs)
// -----------------------------------------------------------------------------
const venueData = {
  'mission-ballroom': { id: 41804, name: 'Mission Ballroom', location: 'RiNo, Denver', address: '4242 Wynkoop St, Denver, CO 80216', pickupNote: '38th & Blake St.' },
  'ball-arena': { id: 85, name: 'Ball Arena', location: 'Downtown Denver', address: '1000 Chopper Cir, Denver, CO 80204', pickupNote: 'Downtown hotel corridor.' },
  'fiddlers-green': { id: 367, name: "Fiddler's Green Amphitheatre", location: 'Greenwood Village', address: '6350 Greenwood Plaza Blvd, Greenwood Village, CO 80111', pickupNote: 'DTC hotel pickup.' },
  'ogden-theatre': { id: 1888, name: 'Ogden Theatre', location: 'Colfax, Denver', address: '935 E Colfax Ave, Denver, CO 80218', pickupNote: 'Colfax door-to-door.' },
  'fillmore-auditorium': { id: 1889, name: 'Fillmore Auditorium', location: 'Colfax, Denver', address: '1510 Clarkson St, Denver, CO 80218', pickupNote: 'Clarkson St entrance.' },
  'bluebird-theater': { id: 1877, name: 'Bluebird Theater', location: 'East Colfax, Denver', address: '3317 E Colfax Ave, Denver, CO 80206', pickupNote: 'East Colfax pickup.' },
  'paramount-theatre': { id: 1875, name: 'Paramount Theatre', location: 'Downtown Denver', address: '1621 Glenarm Pl, Denver, CO 80202', pickupNote: 'Glenarm Pl entrance.' },
  'summit-music-hall': { id: 35051, name: 'Summit Music Hall', location: 'LoDo, Denver', address: '1902 Blake St, Denver, CO 80202', pickupNote: 'Blake St entrance.' },
  'marquis-theater': { id: 16900, name: 'Marquis Theater', location: 'Downtown Denver', address: '2009 Larimer St, Denver, CO 80205', pickupNote: 'Larimer St hub.' },
  'gothic-theatre': { id: 1880, name: 'Gothic Theatre', location: 'Englewood, CO', address: '3263 S Broadway, Englewood, CO 80113', pickupNote: 'South Broadway hub.' },
  'cervantes-masterpiece': { id: 16901, name: "Cervantes' Masterpiece", location: 'Five Points, Denver', address: '2637 Welton St, Denver, CO 80205', pickupNote: 'RiNo/Five Points.' },
  'boulder-theater': { id: 1876, name: 'Boulder Theater', location: 'Boulder, CO', address: '2032 14th St, Boulder, CO 80302', pickupNote: 'Pearl St access.' },
  'fox-theatre': { id: 1883, name: 'Fox Theatre', location: 'Boulder, CO', address: '1135 13th St, Boulder, CO 80302', pickupNote: 'The Hill hub.' },
  'meow-wolf-denver': { id: 483321, name: 'Meow Wolf Denver', location: 'Sun Valley, Denver', address: '1338 1st St, Denver, CO 80204', pickupNote: 'Art District access.' },
  'ophelias-electric-soapbox': { id: 247098, name: "Ophelia's Electric Soapbox", location: 'LoDo, Denver', address: '1215 20th St, Denver, CO 80202', pickupNote: 'LoDo entrance.' },
  'chautauqua-auditorium': { id: 1881, name: 'Chautauqua Auditorium', location: 'Boulder, CO', address: '900 Baseline Rd, Boulder, CO 80302', pickupNote: 'Chautauqua Park.' },
  'macky-auditorium': { id: 1109, name: 'Macky Auditorium', location: 'Boulder, CO', address: '1595 Pleasant St, Boulder, CO 80309', pickupNote: 'Campus door-to-door.' },
  'velvet-elk-lounge': { id: 512686, name: 'Velvet Elk Lounge', location: 'Boulder, CO', address: '2037 13th St, Boulder, CO 80302', pickupNote: 'Pearl St entrance.' },
  'empower-field': { id: 100, name: 'Empower Field', location: 'Denver, CO', address: '1701 Bryant St, Denver, CO 80204', pickupNote: 'Stadium hub.' },
  'dick-sporting-goods-park': { id: 104, name: "Dick's Sporting Goods Park", location: 'Commerce City, CO', address: '6000 Victory Way, Commerce City, CO 80022', pickupNote: 'Commerce City.' },
  'folsom-field': { id: 366, name: 'Folsom Field', location: 'Boulder, CO', address: '2400 Colorado Ave, Boulder, CO 80310', pickupNote: 'Boulder Stadium.' }
};

// -----------------------------------------------------------------------------
// 2. Precision Fetch (Using ID instead of Name)
// -----------------------------------------------------------------------------
async function getEvents(venueId: number) {
  const clientId = process.env.SEATGEEK_CLIENT_ID;
  if (!clientId) return [];
  
  // Use venue.id to ensure local-only show results
  const url = `https://api.seatgeek.com/2/events?client_id=${clientId}&venue.id=${venueId}&per_page=12&sort=datetime_local.asc`;
  
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.events || [];
  } catch (e) { return []; }
}

// -----------------------------------------------------------------------------
// 3. Dynamic Node Component
// -----------------------------------------------------------------------------
export default async function VenuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const venue = venueData[slug as keyof typeof venueData];
  
  if (!venue) notFound();

  // Pass the precise ID to the fetcher
  const events = await getEvents(venue.id);

  return (
    <main className="min-h-screen bg-black text-white py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 border-l-4 border-red-600 pl-8">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-tight">
            {venue.name}
          </h1>
          <p className="mt-3 text-xl text-zinc-400 font-bold uppercase tracking-widest">{venue.location}</p>
        </header>

        {/* Dynamic Schedule Node */}
        <section className="mb-20">
          <h2 className="text-3xl font-black mb-8 border-b border-zinc-800 pb-4 uppercase italic">Venue Intelligence</h2>
          <div className="space-y-4">
            {events.length > 0 ? events.map((event: any) => (
              <div key={event.id} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex justify-between items-center hover:border-red-600 transition-all shadow-xl">
                <div>
                  <h3 className="text-xl font-black uppercase italic leading-tight">{event.title}</h3>
                  <p className="text-zinc-500 font-bold text-sm uppercase mt-1">
                    {new Date(event.datetime_local).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex gap-4">
                  {event.url && (
                    <a href={event.url} target="_blank" rel="noopener noreferrer" className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition">
                      Tickets
                    </a>
                  )}
                  <Link href="/book-all-venue" className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition shadow-lg">
                    Book Ride
                  </Link>
                </div>
              </div>
            )) : <p className="text-zinc-500 italic text-center py-10 uppercase text-xs font-bold tracking-widest">Updating show schedule for 2026...</p>}
          </div>
        </section>

        {/* Maps Intelligence */}
        <section className="mb-20">
          <h3 className="text-2xl font-black mb-6 uppercase italic">Location & Logistics</h3>
          <p className="text-zinc-400 mb-6 font-medium tracking-wide">{venue.address}</p>
          <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-zinc-800 shadow-2xl relative">
            <iframe
              src={`https://maps.google.com/?q=1621+Glenarm+Pl,+Denver,+CO+802029{encodeURIComponent(venue.address)}&output=embed`}
              width="100%" height="100%" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }} allowFullScreen loading="lazy"
            ></iframe>
          </div>
          <div className="mt-8 p-8 bg-zinc-900/30 rounded-3xl border border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-zinc-400 text-sm font-medium">Pickup Intel: {venue.pickupNote} Reliable door-to-door shuttle for any group size.</p>
            <Link href="/book-all-venue" className="bg-white text-black px-10 py-3 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-zinc-200 transition shrink-0 shadow-lg">Book Now</Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  return Object.keys(venueData).map((slug) => ({ slug }));
}
