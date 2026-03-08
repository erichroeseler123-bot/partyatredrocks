"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type SearchRow = {
  eventKey: string;
  title: string;
  dateKey: string;
  venueSlug: string;
  venueName: string;
  artistNames: string[];
};

function norm(s: string) {
  return (s || "").toLowerCase().trim();
}

function dateLabel(dateKey: string) {
  const dt = new Date(`${dateKey}T19:00:00`);
  if (Number.isNaN(dt.getTime())) return dateKey;
  return dt.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function WeekSearchClient({
  initialQ,
  initialRows,
}: {
  initialQ: string;
  initialRows: SearchRow[];
}) {
  const [q, setQ] = useState(initialQ || "");

  const filtered = useMemo(() => {
    const nq = norm(q);
    if (!nq) return initialRows;

    return initialRows.filter((ev) => {
      const title = norm(ev.title);
      const artists = norm(ev.artistNames.join(" "));
      const venue = norm(ev.venueName);
      return title.includes(nq) || artists.includes(nq) || venue.includes(nq);
    });
  }, [initialRows, q]);

  return (
    <>
      <div className="mt-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search artist / band (e.g., Zeds Dead, String Cheese, etc.)"
          className="w-full px-4 py-4 rounded-2xl panel-soft text-white placeholder:text-faint focus:outline-none focus:border-soft hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        />
        <div className="mt-3 text-sm text-muted">
          Tip: you can link directly: <span className="text-soft">/week/search?q=YOUR+ARTIST</span>
        </div>
      </div>

      <div className="mt-8">
        {filtered.length === 0 ? (
          <div className="text-muted">No matches.</div>
        ) : (
          <div className="grid gap-4">
            {filtered
              .slice()
              .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
              .map((ev) => (
                <div key={ev.eventKey} className="rounded-2xl border border-soft bg-surface p-5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <div className="text-lg font-black">{ev.title}</div>
                  <div className="mt-2 text-sm text-muted">
                    {dateLabel(ev.dateKey)} •{" "}
                    <Link
                      href={`/venues/${ev.venueSlug}`}
                      className="underline underline-offset-4 hover:text-white"
                    >
                      {ev.venueName}
                    </Link>
                    {ev.artistNames.length > 0 ? ` • ${ev.artistNames.join(", ")}` : ""}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href={`/find?date=${encodeURIComponent(ev.dateKey)}&qty=2`}
                      className="px-3 py-2 rounded-full border border-soft text-xs font-bold uppercase tracking-widest text-white hover:border-soft"
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
