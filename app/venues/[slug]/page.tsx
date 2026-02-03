import { notFound } from 'next/navigation';
import Link from 'next/link';

const venueData = {
  'mission-ballroom': { name: 'Mission Ballroom', loc: 'RiNo', addr: '4242 Wynkoop St, Denver, CO 80216' },
  'ball-arena': { name: 'Ball Arena', loc: 'Downtown', addr: '1000 Chopper Cir, Denver, CO 80204' },
  'fiddlers-green': { name: "Fiddler's Green", loc: 'DTC', addr: '6350 Greenwood Plaza Blvd, Greenwood Village, CO 80111' },
  'fillmore-auditorium': { name: 'Fillmore Auditorium', loc: 'Colfax', addr: '1510 Clarkson St, Denver, CO 80218' },
  'ogden-theatre': { name: 'Ogden Theatre', loc: 'Colfax', addr: '935 E Colfax Ave, Denver, CO 80218' },
  'bluebird-theater': { name: 'Bluebird Theater', loc: 'East Colfax', addr: '3317 E Colfax Ave, Denver, CO 80206' },
  'paramount-theatre': { name: 'Paramount Theatre', loc: 'Downtown', addr: '1621 Glenarm Pl, Denver, CO 80202' },
  'summit-music-hall': { name: 'Summit Music Hall', loc: 'LoDo', addr: '1902 Blake St, Denver, CO 80202' },
  'marquis-theater': { name: 'Marquis Theater', loc: 'Downtown', addr: '2009 Larimer St, Denver, CO 80205' },
  'gothic-theatre': { name: 'Gothic Theatre', loc: 'Englewood', addr: '3263 S Broadway, Englewood, CO 80113' },
  'cervantes-masterpiece': { name: "Cervantes' Masterpiece", loc: 'Five Points', addr: '2637 Welton St, Denver, CO 80205' },
  'boulder-theater': { name: 'Boulder Theater', loc: 'Boulder', addr: '2032 14th St, Boulder, CO 80302' },
  'fox-theatre': { name: 'Fox Theatre', loc: 'Boulder', addr: '1135 13th St, Boulder, CO 80302' },
  'meow-wolf-denver': { name: 'Meow Wolf Denver', loc: 'Sun Valley', addr: '1338 1st St, Denver, CO 80204' },
  'ophelias-electric-soapbox': { name: "Ophelia's Electric Soapbox", loc: 'LoDo', addr: '1215 20th St, Denver, CO 80202' },
  'chautauqua-auditorium': { name: 'Chautauqua Auditorium', loc: 'Boulder', addr: '900 Baseline Rd, Boulder, CO 80302' },
  'macky-auditorium': { name: 'Macky Auditorium', loc: 'Boulder', addr: '1595 Pleasant St, Boulder, CO 80309' },
  'velvet-elk-lounge': { name: 'Velvet Elk Lounge', loc: 'Boulder', addr: '2037 13th St, Boulder, CO 80302' },
  'empower-field': { name: 'Empower Field', loc: 'Denver', addr: '1701 Bryant St, Denver, CO 80204' },
  'dick-sporting-goods-park': { name: "Dick's Sporting Goods Park", loc: 'Commerce City', addr: '6000 Victory Way, Commerce City, CO 80022' },
  'folsom-field': { name: 'Folsom Field', loc: 'Boulder', addr: '2400 Colorado Ave, Boulder, CO 80310' }
};

export default async function VenuePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const venue = venueData[slug as keyof typeof venueData];
  if (!venue) notFound();

  return (
    <div className="min-h-screen bg-black text-white py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-black uppercase italic tracking-tighter mb-4">{venue.name}</h1>
        <p className="text-xl text-zinc-400 mb-10 font-medium uppercase tracking-widest">{venue.loc}</p>
        <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-zinc-800 shadow-2xl mb-12">
          <iframe 
            src={`https://www.google.com/maps/embed/v1/place?key=YOUR_KEY&q=${encodeURIComponent(venue.addr)}`}
            width="100%" height="100%" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }} allowFullScreen loading="lazy"
          ></iframe>
        </div>
        <Link href="/book-all-venue" className="bg-red-600 px-10 py-5 rounded-full font-black uppercase inline-block">Book Shuttle</Link>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(venueData).map((slug) => ({ slug }));
}
