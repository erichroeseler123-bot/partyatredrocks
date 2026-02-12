"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type WeekEvent = {
  id: number;
  title: string;
  datetime_local: string;
  url?: string;
  performers?: Array<{ name?: string; image?: string }>;
  venue: { siteSlug: string; siteName: string; city?: string; state?: string };
};

function norm(s: string) {
  return (s || "").toLowerCase().trim();
}

export default function WeekSearchClient({ initialQ }: { initialQ: string }) {
  const [q, setQ] = useState(initialQ || "");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [events, setEvents] = useState<WeekEvent[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch("/api/week-events", { cache: "no-store" });
        const json = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setErr(json?.error || `week-events failed (${res.status})`);
          setEvents([]);
        } else {
          setEvents(Array.isArray(json?.events) ? json.events : []);
        }
      } catch (e: any) {
        if (cancelled) return;
        setErr(e?.message || "fetch failed");
        setEvents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const nq = norm(q);
    if (!nq) return events;

    return events.filter((ev) => {
      const title = norm(ev.title);
      const p0 = norm(ev.performers?.[0]?.name || "");
      const venue = norm(ev.venue?.siteName || "");
      return title.includes(nq) || p0.includes(nq) || venue.includes(nq);
    });
  }, [events, q]);

  return (
    <>
      <div className="mt-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search artist / band (e.g., Zeds Dead, String Cheese, etc.)"
          className="w-full px-4 py-4 rounded-2xl bg-black border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/25"
        />
        <div className="mt-3 text-sm text-zinc-500">
          Tip: you can link directly: <span className="text-zinc-300">/week/search?q=YOUR+ARTIST</span>
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="text-zinc-400">Loading week events…</div>
        ) : err ? (
          <div className="rounded-2xl border border-white/10 bg-black p-5">
            <div className="text-red-300 font-semibold">Search is temporarily unavailable.</div>
            <div className="mt-2 text-sm text-zinc-500">{err}</div>
            <div className="mt-4">
              <Link
                href="/week"
                className="px-3 py-2 rounded-full border border-white/15 text-xs font-bold uppercase tracking-widest text-white hover:border-white/30"
              >
                Back to Week
              </Link>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-zinc-400">No matches.</div>
        ) : (
          <div className="grid gap-4">
            {filtered
              .slice()
              .sort((a, b) => +new Date(a.datetime_local) - +new Date(b.datetime_local))
              .map((ev) => (
                <div key={ev.id} className="rounded-2xl border border-white/10 bg-black p-5">
                  <div className="text-lg font-black">{ev.title}</div>
                  <div className="mt-2 text-sm text-zinc-400">
                    {new Date(ev.datetime_local).toLocaleString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}{" "}
                    •{" "}
                    <Link
                      href={`/venues/${ev.venue.siteSlug}`}
                      className="underline underline-offset-4 hover:text-white"
                    >
                      {ev.venue.siteName}
                    </Link>
                    {ev.venue.city ? ` • ${ev.venue.city}` : ""}
                    {ev.venue.state ? `, ${ev.venue.state}` : ""}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {ev.url ? (
                      <a
                        href={ev.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-full border border-white/15 text-xs font-bold uppercase tracking-widest text-white hover:border-white/30"
                      >
                        Tickets
                      </a>
                    ) : null}

                    <Link
                      href={`/shows/${ev.id}`}
                      className="px-3 py-2 rounded-full border border-white/15 text-xs font-bold uppercase tracking-widest text-white hover:border-white/30"
                    >
                      Show Details
                    </Link>

                    <Link
                      href={`/book?event=${encodeURIComponent(String(ev.id))}`}
                      className="px-3 py-2 rounded-full bg-red-600 text-xs font-bold uppercase tracking-widest text-white hover:bg-red-500"
                    >
                      Book Ride
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
}
