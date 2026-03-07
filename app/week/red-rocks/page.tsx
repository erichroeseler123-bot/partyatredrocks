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

function parseDate(raw: string) {
  return new Date(raw);
}

function monthKey(raw: string) {
  const d = parseDate(raw);
  if (Number.isNaN(d.getTime())) return "unknown";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  if (key === "all") return "All Months";
  const [y, m] = key.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}

function fmtDate(raw: string) {
  const d = parseDate(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function RedRocksLineupPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [q, setQ] = useState("");
  const [month, setMonth] = useState("all");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch("/api/red-rocks-events", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || `red-rocks-events (${res.status})`);
        const evs: ApiEvent[] = Array.isArray(json?.events) ? json.events : [];
        if (alive) setEvents(evs);
      } catch (e: any) {
        if (alive) setErr(e?.message || "Failed to load events");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const sorted = useMemo(() => {
    return [...events].sort((a, b) => parseDate(a.datetime_local).getTime() - parseDate(b.datetime_local).getTime());
  }, [events]);

  const monthOptions = useMemo(() => {
    const keys = Array.from(new Set(sorted.map((e) => monthKey(e.datetime_local)).filter((k) => k !== "unknown")));
    return ["all", ...keys];
  }, [sorted]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return sorted.filter((e) => {
      const mOk = month === "all" || monthKey(e.datetime_local) === month;
      if (!mOk) return false;
      if (!needle) return true;
      return (
        e.title.toLowerCase().includes(needle) ||
        (e.performer?.name || "").toLowerCase().includes(needle)
      );
    });
  }, [sorted, month, q]);

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Live Calendar</div>
          <h1 className="comic-title">Red Rocks Lineup</h1>
          <p className="comic-copy">
            Search by artist, filter by month, and book your ride directly from each event card.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-primary" href="/find">
              Find Ride Options
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/guide">
              Open Guide Hub
            </Link>
          </div>
        </div>

        <section className="comic-panel" style={{ marginTop: 14 }}>
          <div className="comic-tag">Filters</div>
          <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search artist or event title"
              className="w-full rounded-xl border border-white/25 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-white/50"
            />
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full rounded-xl border border-white/25 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-white/50"
            >
              {monthOptions.map((key) => (
                <option key={key} value={key}>
                  {monthLabel(key)}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section style={{ marginTop: 14 }}>
          {loading ? (
            <div className="comic-panel">Loading Red Rocks events…</div>
          ) : err ? (
            <div className="comic-panel">
              <div className="comic-h3">Could not load events</div>
              <p className="comic-copy">{err}</p>
              <button type="button" className="comic-btn comic-btn-secondary" onClick={() => location.reload()}>
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="comic-panel">No events match your current filter.</div>
          ) : (
            <div className="comic-grid">
              {filtered.map((e) => {
                const img = e.image || e.performer?.image || "/images/shows/fallback.jpg";
                return (
                  <article key={e.id} className="comic-panel">
                    <img
                      src={img}
                      alt={`Event art for ${e.title}`}
                      className="w-full h-44 object-cover rounded-xl border border-white/20"
                      loading="lazy"
                    />
                    <div className="comic-tag" style={{ marginTop: 10 }}>
                      {fmtDate(e.datetime_local)}
                    </div>
                    <h2 className="comic-h3">{e.title}</h2>
                    <p className="comic-copy">
                      {e.performer?.name ? `Headliner: ${e.performer.name}` : "Headliner info pending"}
                    </p>
                    <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <Link
                        className="comic-btn comic-btn-primary"
                        href={`/book?venue=red-rocks-amphitheatre&seatgeek_event=${encodeURIComponent(String(e.id))}`}
                      >
                        Book Ride
                      </Link>
                      {e.url ? (
                        <a className="comic-btn comic-btn-secondary" href={e.url} target="_blank" rel="noreferrer">
                          Tickets
                        </a>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="comic-panel" style={{ marginTop: 14 }}>
          <div className="comic-tag">Authority Note</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Use this lineup for discovery, then validate venue notices and weather before departure.
          </p>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a className="comic-btn comic-btn-secondary" href="https://www.redrocksonline.com" target="_blank" rel="noreferrer">
              Venue Updates
            </a>
            <a className="comic-btn comic-btn-secondary" href="https://www.cotrip.org" target="_blank" rel="noreferrer">
              Road Conditions
            </a>
          </div>
        </section>

        <div className="comic-mobile-cta">
          <Link className="comic-btn comic-btn-primary" href="/find">
            Book Your Show-Night Ride
          </Link>
        </div>
      </section>
    </main>
  );
}
