import { ALL_VENUES } from "@/lib/venues/registry";
import { normalizeVenueSlug, type HandoffSearchParams } from "@/lib/parrHandoff";
import { getCrossSiteVenue } from "@/lib/crossSiteMap";

function firstValue(searchParams: HandoffSearchParams, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function BookAllVenue({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;
  const venueSlug = normalizeVenueSlug(firstValue(sp, "venue"));
  const venue = venueSlug ? ALL_VENUES.find((item) => item.slug === venueSlug) : null;
  const date = firstValue(sp, "date");
  const event = firstValue(sp, "event");
  const artist = firstValue(sp, "artist");
  const dccEntry = venueSlug ? getCrossSiteVenue(venueSlug) : null;

  return (
    <main className="min-h-screen bg-surface text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-8">
          Request Your <span className="text-[#8fd0ff]">Private Ride</span>
        </h1>
        <p className="text-xl text-muted mb-12">
          {venue?.name
            ? `Tell us about your ${venue.name} ride and we will confirm the private transportation plan for your group.`
            : "Private door-to-door transportation for Denver and Boulder venue nights."}
        </p>

        {venue ? (
          <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/5 px-6 py-5 text-left text-sm text-white/78">
            <div className="font-black uppercase tracking-[0.18em] text-[#8fd0ff]">Ride Request</div>
            <div className="mt-3 space-y-2">
              <div><span className="font-bold text-white">Venue:</span> {venue.name}</div>
              {date ? <div><span className="font-bold text-white">Date:</span> {date}</div> : null}
              {artist ? <div><span className="font-bold text-white">Artist:</span> {artist}</div> : null}
              {event ? <div><span className="font-bold text-white">Event:</span> {event}</div> : null}
            </div>
            {dccEntry ? (
              <a
                href={dccEntry.dccAuthorityPath}
                className="mt-4 inline-flex font-bold text-[#8fd0ff] transition hover:text-white"
              >
                View venue guide
              </a>
            ) : null}
          </div>
        ) : null}

        <div className="panel-soft p-10 rounded-[3rem] shadow-2xl mb-12">
          <h2 className="text-3xl font-black mb-4">Private Transportation Quote</h2>
          <p className="text-muted mb-8 font-medium">
            Vehicle, pickup plan, return plan, availability, and final price are confirmed for your specific venue night before booking.
          </p>
          <a
            href="tel:7203696292"
            className="block w-full btn-primary uppercase shadow-lg transition"
          >
            Call/Text: 720-369-6292
          </a>
        </div>

        <p className="text-muted text-sm">
          Party at Red Rocks currently offers private transportation only. Use the confirmed quote and booking details for your actual trip.
        </p>
      </div>
    </main>
  );
}
