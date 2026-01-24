import Link from "next/link";
import { venues } from "@/data/venues";

export default function Footer() {
  const venueList = Object.values(venues);

  return (
    <footer className="border-t border-zinc-800 mt-24 px-6 py-12 bg-black text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand */}
        <div>
          <h3 className="font-black text-lg mb-2">Party at Red Rocks</h3>
          <p className="text-sm text-zinc-400">
            Concert shuttles & private transportation across Colorado.
          </p>
        </div>

        {/* Venues */}
        <div>
          <h4 className="uppercase text-xs font-bold tracking-widest text-zinc-500 mb-3">
            Venues
          </h4>
          <ul className="space-y-1">
            {venueList.map((venue) => (
              <li key={venue.slug}>
                <Link
                  href={`/venues/${venue.slug}`}
                  className="text-sm text-zinc-300 hover:text-white transition"
                >
                  {venue.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Booking */}
        <div>
          <h4 className="uppercase text-xs font-bold tracking-widest text-zinc-500 mb-3">
            Book a Ride
          </h4>
          <ul className="space-y-1">
            <li>
              <Link
                href="/book-shuttle"
                className="text-sm text-zinc-300 hover:text-white"
              >
                Red Rocks Shuttle
              </Link>
            </li>
            <li>
              <Link
                href="/private-suburban"
                className="text-sm text-zinc-300 hover:text-white"
              >
                Private SUV
              </Link>
            </li>
            <li>
              <Link
                href="/book-all-venues"
                className="text-sm text-zinc-300 hover:text-white"
              >
                All Venues
              </Link>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
