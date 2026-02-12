import Link from "next/link";

// Cache the page at the edge for 60s (fast + still “this week”)
export const revalidate = 60;

const SITE = "https://www.partyatredrocks.com";

type WeekEvent = {
  id: number;
  title: string;
  datetime_local: string;
  url?: string;
  performers?: Array<{ name?: string; image?: string }>;
  venue: {
    siteSlug: string;
    siteName: string;
    city?: string;
    state?: string;
    address?: string;
  };
};

function formatDay(d: Date) {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}
function formatTime(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function dayKeyLocal(d: Date) {
  // Group by LOCAL day, not UTC (prevents midnight shift bugs)
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function getWeekEventsSafe(): Promise<
  | { ok: true; range: { start: string; end: string }; events: WeekEvent[] }
  | { ok: false; error: string }
> {
  try {
    const res = await fetch(`${SITE}/api/week-events`, {
      // let Next cache this fetch for 60s
      next: { revalidate: 60 },
    });

    if (!res.ok) return { ok: false, error: `week-events failed: ${res.status}` };

    const json = (await res.json()) as {
      range: { start: string; end: string };
      events: WeekEvent[];
    };

    return { ok: true, ...json };
  } catch (e: any) {
    return { ok: false, error: e?.message || "fetch failed" };
  }
}

export async function generateMetadata() {
  const title = "Concerts This Week (All Venues) + Ride Options | Party at Red Rocks";
  const description =
    "All upcoming concerts in the next 7 days across our venue list. Open show details and book transportation.";

  return {
    title,
    description,
    alternates: { canonical: `${SITE}/week` },
    openGraph: { title, description, url: `${SITE}/week`, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function WeekPage() {
  const data = await getWeekEventsSafe();

  if (!data.ok) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-16 text-white">
        <h1 className="text-4xl font-black">Concerts This Week</h1>
        <p className="mt-4 text-red-300">Error: {data.error}</p>

        <div className="mt-6 flex gap-3 flex-wrap">
          <Link
            className="px-4 py-2 rounded-lg border border-white/20 hover:border-white/50 transition"
            href="/week/search"
          >
            Search artists →
          </Link>
          <Link
            href="/book"
            className="btn-primary"
          >
            Book a ride →
          </Link>
        </div>
      </main>
    );
  }

  const start = new Date(data.range.start);
  const end = new Date(data.range.end);

  // Group by day (LOCAL)
  const groups = new Map<string, WeekEvent[]>();
  for (const ev of data.events) {
    const d = new Date(ev.datetime_local);
    const key = dayKeyLocal(d);
    groups.set(key, [...(groups.get(key) || []), ev]);
  }

  const days = Array.from(groups.keys()).sort();

  // Sort each day by time
  for (const key of days) {
    const list = groups.get(key) || [];
    list.sort(
      (a, b) => new Date(a.datetime_local).getTime() - new Date(b.datetime_local).getTime()
    );
    groups.set(key, list);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Concerts This Week",
    url: `${SITE}/week`,
    isPartOf: { "@type": "WebSite", name: "Party at Red Rocks", url: SITE },
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <h1 className="text-4xl font-black">Concerts This Week</h1>
          <p className="mt-2 text-zinc-400">
            {start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
            {end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>

          <p className="mt-3 text-zinc-300 max-w-2xl">
            Click a show for details, or book a ride now. This list updates automatically.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Link
            href="/week/search"
            className="px-4 py-2 rounded-lg border border-white/20 hover:border-white/50 transition"
          >
            Search Artists
          </Link>
          <Link
            href="/book"
            className="btn-primary"
          >
            Book a Ride
          </Link>
        </div>
      </header>

      {data.events.length === 0 ? (
        <p className="mt-10 text-zinc-300">No events found in the next 7 days.</p>
      ) : (
        <div className="mt-10 space-y-10">
          {days.map((dayKey) => {
            const list = groups.get(dayKey) || [];
            const label = formatDay(new Date(dayKey + "T12:00:00")); // noon avoids TZ edge cases

            return (
              <section key={dayKey}>
                <h2 className="text-2xl font-bold">{label}</h2>

                <div className="mt-4 grid gap-4">
                  {list.map((ev) => {
                    const d = new Date(ev.datetime_local);

                    const showHref = `/shows/${ev.id}`;
                    const venueHref = `/venues/${ev.venue.siteSlug}`;

                    return (
                      <article
                        key={ev.id}
                        className="rounded-2xl border border-white/10 p-5 bg-white/5 hover:bg-white/[0.07] transition hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="min-w-[240px]">
                            <p className="text-zinc-400">{formatTime(d)}</p>

                            <h3 className="text-xl font-bold mt-1">
                              <Link className="hover:underline" href={showHref}>
                                {ev.title}
                              </Link>
                            </h3>

                            <p className="text-zinc-300 mt-1">
                              <Link className="hover:underline" href={venueHref}>
                                {ev.venue.siteName}
                              </Link>
                              {ev.venue.city ? ` · ${ev.venue.city}` : ""}
                              {ev.venue.state ? `, ${ev.venue.state}` : ""}
                            </p>

                            {/* performer names */}
                            {ev.performers?.length ? (
                              <p className="mt-2 text-sm text-zinc-400">
                                {ev.performers
                                  .map((p) => p?.name)
                                  .filter(Boolean)
                                  .slice(0, 3)
                                  .join(" · ")}
                              </p>
                            ) : null}

                            {/* performer thumbnails (minimal + safe) */}
                            {ev.performers?.length ? (
                              <div className="mt-3 flex gap-2 flex-wrap">
                                {ev.performers
                                  .filter((p) => p?.image)
                                  .slice(0, 3)
                                  .map((p) => (
                                    <img
                                      key={p.image}
                                      src={p.image}
                                      alt={p.name || "Performer"}
                                      className="h-10 w-16 object-cover rounded-md border border-white/10"
                                      loading="lazy"
                                    />
                                  ))}
                              </div>
                            ) : null}
                          </div>

                          <div className="flex gap-3 flex-wrap">
                            <Link
                              href={showHref}
                              className="px-4 py-2 rounded-lg border border-white/20 hover:border-white/50 transition"
                            >
                              Details →
                            </Link>

                            <Link
                              href={`/book?venue=${encodeURIComponent(
                                ev.venue.siteSlug
                              )}&eventId=${encodeURIComponent(String(ev.id))}`}
                              className="btn-primary"
                            >
                              Ride →
                            </Link>

                            {ev.url ? (
                              <a
                                href={ev.url}
                                className="px-4 py-2 rounded-lg border border-white/20 hover:border-white/50 transition"
                                target="_blank"
                                rel="noreferrer"
                              >
                                SeatGeek →
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
