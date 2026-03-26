"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import EventCard from "@/components/EventCard";
import MusicWave from "@/components/MusicWave";
import type { DisplayEvent } from "@/lib/events/presentation";
import FAQBlock from "@/components/FAQBlock";
import type { FaqRow } from "@/lib/faqs/schema";

export type WeekEvent = DisplayEvent;

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

export default function WeekClient({
  initialEvents,
  faqRows = [],
  faqJsonLd,
}: {
  initialEvents: WeekEvent[];
  faqRows?: FaqRow[];
  faqJsonLd?: unknown;
}) {
  const [q, setQ] = useState("");
  const [month, setMonth] = useState("all");

  const sorted = useMemo(() => {
    return [...initialEvents].sort(
      (a, b) => parseDate(a.datetimeLocal).getTime() - parseDate(b.datetimeLocal).getTime()
    );
  }, [initialEvents]);

  const monthOptions = useMemo(() => {
    const keys = Array.from(new Set(sorted.map((e) => monthKey(e.datetimeLocal)).filter((k) => k !== "unknown")));
    return ["all", ...keys];
  }, [sorted]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return sorted.filter((e) => {
      const mOk = month === "all" || monthKey(e.datetimeLocal) === month;
      if (!mOk) return false;
      if (!needle) return true;
      return e.title.toLowerCase().includes(needle) || (e.performerName || "").toLowerCase().includes(needle);
    });
  }, [sorted, month, q]);

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        {faqRows.length > 0 && faqJsonLd ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        ) : null}
        <div className="comic-hero">
          <div className="comic-kicker">Upcoming Shows</div>
          <h1 className="comic-title">Red Rocks Lineup</h1>
          <p className="comic-copy">
            Already have tickets? Search by artist, filter by month, and plan your ride before show night.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-secondary" href="/red-rocks">
              Red Rocks Hub
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/red-rocks/concerts">
              Concert Schedule
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/red-rocks/transportation">
              Transportation Guide
            </Link>
            <Link className="comic-btn comic-btn-primary" href="/book/red-rocks-amphitheatre/custom/shared">
              Book Shared Shuttle
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/book/red-rocks-amphitheatre/private">
              Private Rides
            </Link>
          </div>
          <div style={{ marginTop: 18 }}>
            <MusicWave bars={24} />
          </div>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
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

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Before Show Night</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Search the lineup by artist or month, open the show page, then choose the ride that fits the night.
          </p>
          <p className="comic-copy">
            Round-trip rides cover the full concert night, and pickup details are sent before the show.
          </p>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-secondary" href="/red-rocks">
              Back to Red Rocks Hub
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/red-rocks/concerts">
              Full Concert Calendar
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/red-rocks/transportation">
              Transportation Guide
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/venues/red-rocks-amphitheatre">
              Venue Details
            </Link>
            <Link className="comic-btn comic-btn-primary" href="/book/red-rocks-amphitheatre/custom/shared">
              Book Shared Shuttle
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/guide/show-night-strategy/post-show-pickup-plan">
              Pickup Guide
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/guide/logistics/parking-lots">
              Parking Guide
            </Link>
          </div>
        </section>

        <section style={{ marginTop: 16 }}>
          {filtered.length === 0 ? (
            <div className="comic-panel">No events match your current filter.</div>
          ) : (
            <div className="comic-grid">
              {filtered.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          )}
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Before You Go</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Check venue notices and road conditions before you leave for the show.
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
          <Link className="comic-btn comic-btn-primary" href="/book/red-rocks-amphitheatre/custom/shared">
            Book Shared Shuttle
          </Link>
        </div>

        <FAQBlock title="Red Rocks Week FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
