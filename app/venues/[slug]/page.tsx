import Image from "next/image";
import { notFound } from "next/navigation";
import { getCanonicalVenueBySiteSlug } from "@/lib/venues/registry";
import { resolveSeatGeekVenue, seatgeekEventsByVenueId } from "@/lib/seatgeek";

export const revalidate = 1800; // 30 min ISR

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const canonical = getCanonicalVenueBySiteSlug(slug);

  if (!canonical) {
    return {
      title: "Venue | Party at Red Rocks",
      description:
        "Venue schedule + transportation. Live events, venue intel, and shuttle booking.",
    };
  }

  return {
    title: `${canonical.name} Shows + Shuttle Transportation | Party at Red Rocks`,
    description: `See upcoming shows at ${canonical.name} and book shuttle transportation. Pickup options, venue intel, and live schedule.`,
    alternates: {
      canonical: `https://www.partyatredrocks.com/venues/${canonical.slug}`,
    },
  };
}

function buildQuery(parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(", ");
}

function buildFallbackMapFromQuery(q: string) {
  const enc = encodeURIComponent(q);
  const embed = `https://www.google.com/maps?q=${enc}&output=embed`;
  const link = `https://www.google.com/maps/search/?api=1&query=${enc}`;
  return { embed, link };
}

function formatLastUpdated() {
  return new Date().toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function VenuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: siteSlug } = await params;

  const canonical = getCanonicalVenueBySiteSlug(siteSlug);
  if (!canonical) notFound();

  const sgVenue = await resolveSeatGeekVenue({
    targetName: canonical.name,
    seatgeekSlug: canonical.seatgeekSlug,
    siteSlug: canonical.slug,
  });

  if (!sgVenue) {
    return (
      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black text-white">{canonical.name}</h1>
        <p className="mt-4 text-zinc-400">
          We couldn’t match this venue to SeatGeek yet. Add the correct{" "}
          <code>seatgeekSlug</code> in <code>lib/venues/registry.ts</code>.
        </p>
      </main>
    );
  }

  const venueQuery = buildQuery([
    canonical.name,
    sgVenue.address,
    sgVenue.city,
    sgVenue.state,
  ]);

  const map = buildFallbackMapFromQuery(venueQuery);
  const events = await seatgeekEventsByVenueId(sgVenue.id);

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 text-white">
      <header className="mb-6">
        <h1 className="text-4xl font-black">{canonical.name}</h1>
        <div className="mt-3 text-zinc-400">
          <div>
            {sgVenue.city}
            {sgVenue.state ? `, ${sgVenue.state}` : ""}
          </div>
          {sgVenue.address && <div>{sgVenue.address}</div>}
        </div>
      </header>

      {/* ACTION BAR */}
      <section className="mb-16 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-zinc-400">
          Real-time events powered by SeatGeek. Book your ride before surge hits.
        </div>

        <div className="flex gap-3">
          {sgVenue.url ? (
            <a
              href={sgVenue.url}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full border border-white/15 text-xs font-bold uppercase tracking-widest hover:border-white/30"
            >
              Tickets
            </a>
          ) : null}

          <a
            href={`/book?venue=${encodeURIComponent(canonical.slug)}`}
            className="btn-primary"
          >
            Book Ride
          </a>
        </div>
      </section>

      {/* MAP + VENUE INTEL (TOP) */}
      <section className="mb-16 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Map */}
        <div className="rounded-2xl border border-white/10 overflow-hidden bg-surface hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-zinc-500">
                Map
              </div>
              <div className="text-sm text-zinc-300">
                {sgVenue.address ? sgVenue.address : "Venue location"}
              </div>
            </div>

            <a
              href={map.link}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold uppercase tracking-widest text-red-400 hover:text-red-300"
            >
              Open →
            </a>
          </div>

          <div className="relative w-full h-[320px] bg-surface">
            <iframe
              title={`${canonical.name} map`}
              src={map.embed}
              className="absolute inset-0 w-full h-full"
              loading="lazy"
            />
          </div>
        </div>

        {/* Venue Intel */}
        <div className="rounded-2xl border border-white/10 bg-surface p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="text-xs uppercase tracking-widest text-zinc-500">
            Venue Intel
          </div>

          <h2 className="mt-2 text-2xl font-black">{canonical.name}</h2>

          <div className="mt-4 grid gap-3 text-sm text-zinc-300">
            <div>
              <div className="text-xs uppercase tracking-widest text-zinc-500">
                City
              </div>
              <div>
                {sgVenue.city}
                {sgVenue.state ? `, ${sgVenue.state}` : ""}
              </div>
            </div>

            {sgVenue.address ? (
              <div>
                <div className="text-xs uppercase tracking-widest text-zinc-500">
                  Address
                </div>
                <div>{sgVenue.address}</div>
              </div>
            ) : null}

            <div className="pt-2 border-t border-white/10">
              <div className="text-xs uppercase tracking-widest text-zinc-500">
                Last Updated
              </div>
              <div className="mt-1 text-zinc-200">{formatLastUpdated()}</div>
            </div>

            {canonical.pickupNote ? (
              <div className="pt-2 border-t border-white/10">
                <div className="text-xs uppercase tracking-widest text-zinc-500">
                  Pickup Note
                </div>
                <div className="mt-1 text-zinc-200">{canonical.pickupNote}</div>
              </div>
            ) : null}

            {sgVenue.url ? (
              <a
                href={sgVenue.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-2 text-xs font-semibold uppercase tracking-widest text-zinc-200 hover:text-white"
              >
                SeatGeek Venue Page →
              </a>
            ) : null}

            <a
              href="/week"
              className="inline-flex items-center gap-2 mt-2 text-xs font-semibold uppercase tracking-widest text-zinc-200 hover:text-white"
            >
              This Week — All Venues →
            </a>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      {events.length === 0 ? (
        <section className="rounded-2xl border border-white/10 p-6 bg-surface hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <h2 className="text-xl font-bold">No events found</h2>
          <p className="mt-2 text-zinc-400">
            SeatGeek returned 0 upcoming events for this venue.
          </p>
        </section>
      ) : (
        <section className="grid gap-6">
          {events.map((ev) => {
            const performerImg = ev.performers?.[0]?.image;
            return (
              <article
                key={ev.id}
                className="rounded-2xl border border-white/10 overflow-hidden bg-surface hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {performerImg ? (
                  <div className="relative w-full h-56">
                    <Image
                      src={performerImg}
                      alt={ev.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                  </div>
                ) : null}

                <div className="p-5">
                  <h3 className="text-lg font-bold">{ev.title}</h3>
                  <div className="mt-2 text-zinc-400">
                    {new Date(ev.datetime_local).toLocaleString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {ev.url ? (
                      <a
                        href={ev.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-full border border-white/15 text-xs font-bold uppercase tracking-widest hover:border-white/30"
                      >
                        Tickets
                      </a>
                    ) : null}

                    <a
                      href={`/shows/${ev.id}`}
                      className="px-3 py-2 rounded-full border border-white/15 text-xs font-bold uppercase tracking-widest hover:border-white/30"
                    >
                      Show Details
                    </a>

                    <a
                      href={`/book?venue=${encodeURIComponent(
                        canonical.slug
                      )}&event=${encodeURIComponent(String(ev.id))}`}
                      className="btn-primary"
                    >
                      Book Ride
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
