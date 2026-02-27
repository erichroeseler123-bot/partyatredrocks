"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
type ApiEvent = {
  id: number;
  title: string;
  datetime_local: string;
  url?: string;
  image?: string | null;
  performer?: { name?: string; image?: string } | null;
};

function formatParts(dt: string) {
  const d = new Date(dt);
  const mon = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = String(d.getDate());
  const time = d.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const dow = d.toLocaleString("en-US", { weekday: "short" }).toUpperCase();
  return { mon, day, time, dow };
}

export default function RedRocksLineupPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [events, setEvents] = useState<ApiEvent[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch("/api/red-rocks-events", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok)
          throw new Error(json?.error || `red-rocks-events (${res.status})`);
        const evs: ApiEvent[] = Array.isArray(json?.events) ? json.events : [];
        if (alive) setEvents(evs);
      } catch (e: any) {
        if (alive) setErr(e?.message || "Failed to load");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const sorted = useMemo(() => {
    return [...events].sort((a, b) => {
      const ta = new Date(a.datetime_local).getTime();
      const tb = new Date(b.datetime_local).getTime();
      return ta - tb;
    });
  }, [events]);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[.22em] text-white/60">
              Red Rocks
            </div>
            <h1 className="mt-2 text-4xl md:text-5xl font-black tracking-tight text-white">
              Red Rocks Lineup
            </h1>
            <p className="mt-2 text-white/70 max-w-2xl">
              Upcoming concerts at Red Rocks — tickets + shuttle in one flow.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link className="btn-secondary" href="/week">
              ALL VENUES
            </Link>
            <Link
              className="btn-primary text-lg px-8 py-4 hover:scale-105 transition"
              href="/book?venue=red-rocks-amphitheatre"
            >
              BOOK RED ROCKS SHUTTLE
            </Link>
          </div>
        </div>

        <div className="mt-10">
          {loading ? (
            <div className="panel-soft p-7 text-white/70">Loading events…</div>
          ) : err ? (
            <div className="panel-soft p-7">
              <div className="text-white/90 font-black">Failed to load</div>
              <div className="mt-2 text-white/70">{err}</div>
              <div className="mt-4">
                <button
                  className="btn-secondary"
                  onClick={() => location.reload()}
                  type="button"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : sorted.length === 0 ? (
            <div className="panel-soft p-7 text-white/70">
              No Red Rocks concerts returned.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {sorted.map((e) => {
                const { mon, day, time, dow } = formatParts(e.datetime_local);
                const img =
                  e.image || e.performer?.image || "/images/shows/fallback.jpg";

                return (
<div key={e.id} className="panel-soft p-6 md:p-7 group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col md:flex-row gap-5 md:items-center">
                      <div className="w-full md:w-[220px] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
<img priority
  src={img}
  alt={`Headliner ${e.performer?.name || e.title} at Red Rocks`}
  width={220}
  height={140}
  className="h-40 md:h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
  loading="lazy"
/>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                            <div className="text-[11px] font-black tracking-[.22em] text-white/60">
                              {dow}
                            </div>
                            <div className="h-4 w-px bg-white/15" />
                            <div className="text-sm font-black text-white/85">
                              {mon} {day}
                            </div>
                            <div className="h-4 w-px bg-white/15" />
                            <div className="text-sm font-semibold text-white/70">
                              {time}
                            </div>
                          </div>

                          <div className="text-[11px] font-black uppercase tracking-[.22em] text-white/55">
                            Event #{e.id}
                          </div>
                        </div>

                        <div className="mt-4 text-xl md:text-2xl font-black text-white/92">
                          {e.title}
                        </div>

                        <div className="mt-2 text-white/70">
                          {e.performer?.name
                            ? `Headliner: ${e.performer.name}`
                            : "Headliner: —"}
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3">
                          {e.url ? (
                            <a
                              className="btn-secondary"
                              href={e.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              TICKETS
                            </a>
                          ) : null}

                          <Link
                            className="btn-primary text-lg px-8 py-4 hover:scale-105 transition"
                            href={`/book?venue=red-rocks-amphitheatre&seatgeek_event=${encodeURIComponent(
                              String(e.id),
                            )}`}
                          >
                            Book Shuttle – $59
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-10 text-sm text-white/55">
          Data source: SeatGeek (venueId 196). Times shown are local.
        </div>
      </div>

<div className="mt-8 mb-6 text-center md:text-left">
  <h2 className="text-2xl md:text-3xl font-black text-white">
    {sorted.length} Upcoming Shows
  </h2>
  <p className="mt-1 text-white/60 text-sm">
    Sorted by date • Powered by SeatGeek
  </p>
</div>

    </main>
  );
}
