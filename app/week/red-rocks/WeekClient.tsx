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
          <div className="comic-tag">How Booking + Pickup Works</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Search the lineup by artist or month, open the event card, then choose your ride path. Shared shuttle is best
            when you want predictable return timing. Private options are best when your group needs tighter schedule control.
          </p>
          <p className="comic-copy">
            If you are coordinating a group, set one exact meet point and one fallback before encore to reduce post-show
            confusion.
          </p>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-primary" href="/find">
              Find Ride Options
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/venues/red-rocks-amphitheatre">
              Red Rocks Venue Page
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/guide/show-night-strategy/post-show-pickup-plan">
              Post-Show Pickup Guide
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

        <FAQBlock title="Red Rocks Week FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
