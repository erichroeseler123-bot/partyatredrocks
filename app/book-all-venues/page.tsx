import Link from "next/link";
import { venues } from "@/data/venues";

export default function BookAllVenuesPage() {
  const venueList = Object.values(venues);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <h1 className="text-5xl font-black mb-10">All Concert Venues</h1>

      <ul className="space-y-4">
        {venueList.map((venue) => (
          <li key={venue.slug}>
            <Link
              href={`/venues/${venue.slug}`}
              className="underline text-lg"
            >
              {venue.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
