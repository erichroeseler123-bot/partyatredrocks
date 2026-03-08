"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Row = {
  eventKey: string;
  title: string;
  artistNames: string[];
  venueId: string;
  venueName: string;
  dateKey: string;
  tags?: string[];
};

type Props = {
  initialQ: string;
  rows: Row[];
};

function norm(s: string) {
  return String(s || "").toLowerCase().trim();
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function SearchClient({ initialQ, rows }: Props) {
  const [q, setQ] = useState(initialQ || "");

  const filtered = useMemo(() => {
    const nq = norm(q);
    if (!nq) return rows.slice(0, 250);
    return rows
      .filter((row) => {
        const hay = [
          row.title,
          row.venueName,
          row.venueId,
          row.dateKey,
          row.artistNames.join(" "),
          (row.tags || []).join(" "),
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(nq);
      })
      .slice(0, 300);
  }, [q, rows]);

  return (
    <section className="comic-panel" style={{ marginTop: 14 }}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search artist, venue, or show title"
        className="w-full rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-white"
      />

      <div className="comic-grid" style={{ marginTop: 12 }}>
        {filtered.map((row) => {
          return (
            <article key={row.eventKey} className="comic-panel">
              <div className="comic-h3">{row.title}</div>
              <p className="comic-copy">{row.dateKey}</p>
              <p className="comic-copy">{row.venueName}</p>
              <p className="comic-copy">
                {row.artistNames.map((name, idx) => (
                  <span key={`${row.eventKey}-${name}`}>
                    <Link className="underline" href={`/artists/${encodeURIComponent(slugify(name))}`}>
                      {name}
                    </Link>
                    {idx < row.artistNames.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
              <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Link className="comic-btn comic-btn-secondary" href={`/shows/${encodeURIComponent(row.eventKey)}`}>
                  Show
                </Link>
                <Link className="comic-btn comic-btn-secondary" href={`/venues/${encodeURIComponent(row.venueId)}`}>
                  Venue
                </Link>
                <Link className="comic-btn comic-btn-primary" href={`/find?date=${encodeURIComponent(row.dateKey)}&qty=2`}>
                  Ride
                </Link>
              </div>
            </article>
          );
        })}
        {filtered.length === 0 ? <p className="comic-copy">No matches.</p> : null}
      </div>
    </section>
  );
}
