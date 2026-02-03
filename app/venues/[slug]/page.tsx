import Link from 'next/link';
import { notFound } from 'next/navigation';

// -----------------------------------------------------------------------------
// 1. Master Venue Intelligence Database
// -----------------------------------------------------------------------------
const venueData = {
  'mission-ballroom': {
    name: 'Mission Ballroom',
    slug: 'mission-ballroom',
    location: 'RiNo, Denver',
    capacity: '3,950',
    address: '4242 Wynkoop St, Denver, CO 80216',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Mission+Ballroom+Denver',
    description: 'Modern warehouse-style venue with high-energy electronic and rock sets. Post-show crowds can be chaotic on Wynkoop—our shuttle waits right at the main entrance.',
    pickupNote: 'Best pickup: 38th & Blake St (short walk, easy access).',
    shuttleFit: 'RiNo location makes custom hotel/bar pickups seamless for your group.'
  },
  'ball-arena': {
    name: 'Ball Arena',
    slug: 'ball-arena',
    location: 'Downtown Denver',
    capacity: '20,000',
    address: '1000 Chopper Cir, Denver, CO 80204',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Ball+Arena+Denver',
    description: 'Massive arena hosting major national tours. Parking is expensive and post-show Uber waits often exceed 45 minutes.',
    pickupNote: 'Best pickup: Pepsi Center area lots or nearby hotels.',
    shuttleFit: 'Door-to-door from Downtown hotels; skip the stadium traffic and surge pricing.'
  },
  'fiddlers-green': {
    name: "Fiddler's Green Amphitheatre",
    slug: 'fiddlers-green',
    location: 'Greenwood Village',
    capacity: '18,000',
    address: '6350 Greenwood Plaza Blvd, Greenwood Village, CO 80111',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Fiddlers+Green+Amphitheatre',
    description: 'Outdoor venue in the Tech Center. Post-show I-25 traffic is notoriously gridlocked—shuttle service is the fastest exit.',
    pickupNote: 'Best pickup: Nearby hotels or designated park-and-ride lots.',
    shuttleFit: 'Fixed group rates avoid the high cost of long-distance rideshares from DTC.'
  },
  'ogden-theatre': {
    name: 'Ogden Theatre',
    slug: 'ogden-theatre',
    location: 'Colfax, Denver',
    capacity: '1,600',
    address: '935 E Colfax Ave, Denver, CO 80218',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Ogden+Theatre+Denver',
    description: 'Historic and intimate rock venue. Limited street parking makes door-to-door service highly valuable.',
    pickupNote: 'Door-to-door from any Colfax-area hotel or Airbnb.',
    shuttleFit: 'Perfect for smaller crews visiting Colfax bars before the set.'
  },
  'fillmore-auditorium': {
    name: 'Fillmore Auditorium',
    slug: 'fillmore-auditorium',
    location: 'Colfax, Denver',
    capacity: '3,900',
    address: '1510 Clarkson St, Denver, CO 80218',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Fillmore+Auditorium+Denver',
    description: 'Large historic theatre. Crowds spill onto Colfax post-show; having a waiting vehicle is a significant safety and convenience win.',
    pickupNote: 'Easy pickup from Colfax Ave or nearby parking garages.',
    shuttleFit: 'Door-to-door service means no walking through the Colfax crowds in the dark.'
  },
  'bluebird-theater': {
    name: 'Bluebird Theater',
    slug: 'bluebird-theater',
    location: 'East Colfax, Denver',
    capacity: '550',
    address: '3317 E Colfax Ave, Denver, CO 80206',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Bluebird+Theater+Denver',
    description: 'Intimate historic venue for indie and rock acts. Street parking is nearly impossible on this stretch of Colfax.',
    pickupNote: 'Best pickup: Directly in front of the theater or nearby side-streets.',
    shuttleFit: 'High local search intent for parking; solve it with a $250 group Suburban.'
  },
  'paramount-theatre': {
    name: 'Paramount Theatre',
    slug: 'paramount-theatre',
    location: 'Downtown Denver',
    capacity: '1,800',
    address: '1621 Glenarm Pl, Denver, CO 80202',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Paramount+Theatre+Denver',
    description: 'Classic downtown theater for music and comedy. Traffic on the 16th Street Mall can make arrival difficult.',
    pickupNote: 'Direct drop at the Glenarm entrance; wait beats Downtown garage lines.',
    shuttleFit: 'Professional transport for groups attending theater shows and comedy sets.'
  },
  'summit-music-hall': {
    name: 'Summit Music Hall',
    slug: 'summit-music-hall',
    location: 'Downtown Denver',
    capacity: '1,500',
    address: '1902 Blake St, Denver, CO 80202',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Summit+Music+Hall+Denver',
    description: 'Downtown staple for rock and EDM. Intense post-show surge pricing area.',
    pickupNote: 'Best pickup: Blake Street or nearby parking lots.',
    shuttleFit: 'Fixed $250 rate beats 3x Uber surges for EDM crews.'
  },
  'gothic-theatre': {
    name: 'Gothic Theatre',
    slug: 'gothic-theatre',
    location: 'Englewood, CO',
    capacity: '1,100',
    address: '3263 S Broadway, Englewood, CO 80113',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Gothic+Theatre+Englewood',
    description: 'Iconic South Broadway venue. Great indie lineups, though far from major Downtown hotels.',
    pickupNote: 'Best pickup: South Broadway main entrance.',
    shuttleFit: 'Reliable transport from Englewood back to Denver or Boulder nodes.'
  },
  'cervantes-masterpiece': {
    name: "Cervantes' Masterpiece",
    slug: 'cervantes-masterpiece',
    location: 'Five Points, Denver',
    capacity: '1,000',
    address: '2637 Welton St, Denver, CO 80205',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Cervantes+Masterpiece+Denver',
    description: 'Hip-hop and jam-band hub. Multi-room setup with varying show times. Chaos on Welton post-show makes a waiting vehicle essential.',
    pickupNote: 'Easy pickup from nearby Five Points bars and hotels.',
    shuttleFit: 'Flexible return times handle multi-room shows; RiNo pickup specialist.'
  },
  'marquis-theater': {
    name: 'Marquis Theater',
    slug: 'marquis-theater',
    location: 'Downtown Denver',
    capacity: '900',
    address: '2009 Larimer St, Denver, CO 80205',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Marquis+Theater+Denver',
    description: 'Small, high-energy venue for punk and metal. Street parking is essentially non-existent.',
    pickupNote: 'Best pickup: Larimer St entrance.',
    shuttleFit: 'Reliable late-night return after heavy-hitting sets.'
  },
  'boulder-theater': {
    name: 'Boulder Theater',
    slug: 'boulder-theater',
    location: 'Boulder, CO',
    capacity: '1,000',
    address: '2032 14th St, Boulder, CO 80302',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Boulder+Theater',
    description: 'Pearl Street gem with an iconic art deco vibe and national touring acts.',
    pickupNote: 'Door-to-door for Boulder locals and Pearl Street guests.',
    shuttleFit: 'Perfect for groups combining Pearl Street dinner and a show.'
  },
  'fox-theatre': {
    name: 'Fox Theatre',
    slug: 'fox-theatre',
    location: 'Boulder, CO',
    capacity: '600',
    address: '1135 13th St, Boulder, CO 80302',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Fox+Theatre+Boulder',
    description: 'Intimate venue located on "The Hill" at CU Boulder. Historic indie and rock destination.',
    pickupNote: 'Avoid campus parking tickets; private SUV service for indie fans.',
    shuttleFit: 'Custom pickups from Boulder hotels and Airbnbs.'
  },
  'meow-wolf-denver': {
    name: 'Meow Wolf: Convergence Station',
    slug: 'meow-wolf-denver',
    location: 'Denver, CO',
    capacity: 'Mixed',
    address: '1338 1st St, Denver, CO 80204',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Meow+Wolf+Denver',
    description: 'Immersive art experience featuring a high-tech music stage for emerging acts.',
    pickupNote: 'Custom pickups from nearby Santa Fe Art District spots.',
    shuttleFit: 'Immersive crowds love the seamless waiting shuttle for a group return.'
  },
  'ophelias-electric-soapbox': {
    name: "Ophelia's Electric Soapbox",
    slug: 'ophelias-electric-soapbox',
    location: 'LoDo, Denver',
    capacity: '400',
    address: '1215 20th St, Denver, CO 80202',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Ophelias+Electric+Soapbox+Denver',
    description: 'Supper club and live stage perfect for funk, soul, and intimate performances.',
    pickupNote: 'Ideal for groups combining dinner and a show; custom hotel pickup.',
    shuttleFit: 'Professional transport for higher-end dining and music experiences.'
  },
  'chautauqua-auditorium': {
    name: 'Chautauqua Auditorium',
    slug: 'chautauqua-auditorium',
    location: 'Boulder, CO',
    capacity: '1,200',
    address: '900 Baseline Rd, Boulder, CO 80302',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Chautauqua+Auditorium+Boulder',
    description: 'Scenic and historic historic venue in Chautauqua Park. Parking is extremely limited and hilly.',
    pickupNote: 'Best pickup: Directly in front of the historic auditorium.',
    shuttleFit: 'Door-to-door Boulder service eliminates the park parking hassle.'
  },
  'macky-auditorium': {
    name: 'Macky Auditorium',
    slug: 'macky-auditorium',
    location: 'CU Boulder Campus',
    capacity: '2,600',
    address: '1595 Pleasant St, Boulder, CO 80309',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Macky+Auditorium+Boulder',
    description: 'Grand university venue for large performances. Campus parking is strictly enforced.',
    pickupNote: 'Custom pickups from nearby Boulder locations.',
    shuttleFit: 'Avoid campus chaos with professional group transport.'
  },
  'velvet-elk-lounge': {
    name: 'Velvet Elk Lounge',
    slug: 'velvet-elk-lounge',
    location: 'Boulder, CO',
    capacity: '200',
    address: '2037 13th St, Boulder, CO 80302',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Velvet+Elk+Lounge+Boulder',
    description: 'Intimate lounge and venue in Downtown Boulder. Perfect for local and emerging talent.',
    pickupNote: 'Easy pickup from Pearl Street hotels and bars.',
    shuttleFit: 'Reliable return after intimate late-night sets.'
  },
  'empower-field': {
    name: 'Empower Field at Mile High',
    slug: 'empower-field',
    location: 'Denver, CO',
    capacity: '76,000',
    address: '1701 Bryant St, Denver, CO 80204',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Empower+Field+at+Mile+High',
    description: 'Home of the biggest stadium tours in Colorado. Massive exit traffic is guaranteed.',
    pickupNote: 'Shuttle eliminates the 60,000-person exit panic and Uber lines.',
    shuttleFit: 'High demand for stadium tours; flat-rate group pricing covers the whole crew.'
  },
  'dick-sporting-goods-park': {
    name: "Dick's Sporting Goods Park",
    slug: 'dick-sporting-goods-park',
    location: 'Commerce City, CO',
    capacity: '27,000',
    address: '6000 Victory Way, Commerce City, CO 80022',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Dicks+Sporting+Goods+Park',
    description: 'Outdoor stadium for festivals and major tours. Commerce City is a rideshare dead-zone post-show.',
    pickupNote: 'We are often the only reliable pre-booked return from this location.',
    shuttleFit: 'Essential for festivals where data/Uber signals often fail.'
  },
  'folsom-field': {
    name: 'Folsom Field',
    slug: 'folsom-field',
    location: 'Boulder, CO',
    capacity: '50,000',
    address: '2400 Colorado Ave, Boulder, CO 80310',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Folsom+Field+Boulder',
    description: 'Legendary outdoor stadium on the CU Boulder campus hosting massive summer shows.',
    pickupNote: 'Custom Boulder pickups bypass the campus parking gridlock.',
    shuttleFit: 'Door-to-door Boulder pickups are essential for stadium crowds.'
  }
};

type Venue = (typeof venueData)[keyof typeof venueData];

// -----------------------------------------------------------------------------
// 2. Fetch Live Show Data (SeatGeek API)
// -----------------------------------------------------------------------------
async function getEventsForVenue(venueSlug: string) {
  const venue = venueData[venueSlug as keyof typeof venueData];
  if (!venue) return [];

  const clientId = process.env.SEATGEEK_CLIENT_ID;
  if (!clientId) return [];

  const url = `https://api.seatgeek.com/2/events?client_id=${clientId}&venue.name=${encodeURIComponent(venue.name)}&per_page=15&sort=datetime_utc`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.events || [];
  } catch (err) {
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
          <h2 className="text-3xl font-black mb-4 uppercase italic tracking-tighter">Get There & Back — No Stress</h2>
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
        <section className="mb-20">
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
                          weekday: 'long', month: 'long', day: 'numeric',
                        })}
                        {' • '}
                        {new Date(event.datetime_utc).toLocaleTimeString('en-US', {
                          hour: 'numeric', minute: '2-digit',
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

        {/* Location & Directions Node */}
        <section className="mb-20">
          <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-8 border-b border-zinc-800 pb-4">
            Location & Directions
          </h3>
          <p className="text-zinc-300 text-lg mb-6 font-medium">{venue.address}</p>
          <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-zinc-800 shadow-2xl relative">
            {/* Embedded Map Logic */}
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(venue.address)}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }} // Dark mode styling
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${venue.name} Location Map`}
            ></iframe>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-zinc-950 rounded-3xl border border-zinc-900">
            <div className="max-w-md">
               <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest mb-2">Shuttle Intelligence</p>
               <p className="text-zinc-300 text-sm font-medium">
                 {venue.pickupNote} Skip the parking lines and industrial walks—book door-to-door ease.
               </p>
            </div>
            <a 
              href={venue.mapUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-white text-black px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest hover:bg-zinc-200 transition"
            >
              Open in Google Maps
            </a>
          </div>
        </section>

        {/* Strategic Shuttle Fit */}
        <section className="p-10 bg-zinc-900/20 rounded-[2.5rem] border border-zinc-800">
          <h3 className="text-2xl font-black mb-6 uppercase italic text-red-600 tracking-tighter">Why We Are The Best Choice</h3>
          <ul className="space-y-4 text-zinc-400 font-bold text-sm leading-relaxed">
            <li className="flex gap-3"><span>•</span> <span>Door-to-door pickup from any hotel, Airbnb, or residence.</span></li>
            <li className="flex gap-3"><span>•</span> <span>We wait for you after the show—no surge pricing or 60-minute Uber queues.</span></li>
            <li className="flex gap-3"><span>•</span> <span>BYOB + Vape Friendly private vehicles.</span></li>
            <li className="flex gap-3 text-white italic"><span>•</span> <span>{venue.shuttleFit}</span></li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(venueData).map((slug) => ({ slug }));
}
