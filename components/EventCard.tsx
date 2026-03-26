import Link from "next/link";
import type { DisplayEvent } from "@/lib/events/presentation";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fmtDate(raw: string) {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EventCard({
  event,
  showBookRide = true,
}: {
  event: DisplayEvent;
  showBookRide?: boolean;
}) {
  const artistSlug = event.performerName ? slugify(event.performerName) : "";
  const heroImage = event.image || "/images/shows/fallback.jpg";
  const thumbnailImage = event.thumbnail || "/images/shows/fallback.jpg";

  return (
    <article className="comic-panel">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/20 bg-black/20">
        <img
          src={heroImage}
          alt={`${event.title} – ${event.performerName || "upcoming concert"}`}
          width={320}
          height={180}
          className="h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="comic-tag" style={{ marginTop: 10 }}>
        {fmtDate(event.datetimeLocal)}
      </div>
      <h2 className="comic-h3">{event.title}</h2>
      <p className="comic-copy">
        {event.performerName ? (
          <>
            Headliner:{" "}
            <Link href={`/artists/${encodeURIComponent(artistSlug)}`} className="underline text-white/90 hover:text-white">
              {event.performerName}
            </Link>
          </>
        ) : (
          "Headliner info pending"
        )}
      </p>

      {event.thumbnail ? (
        <div className="mt-2 flex items-center gap-2">
          <img
            src={thumbnailImage}
            alt={`${event.performerName || "Artist"} thumbnail`}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full border border-white/20 object-cover"
            loading="lazy"
            decoding="async"
          />
          <span className="text-xs text-white/75">Artist thumbnail</span>
        </div>
      ) : null}

      {event.weather ? (
        <p className="comic-copy" style={{ marginTop: 8 }}>
          Weather (next 7 days): {event.weather.highF}/{event.weather.lowF}F
          {typeof event.weather.precipChance === "number" ? ` • ${event.weather.precipChance}% precip` : ""}
        </p>
      ) : null}

      {event.setlistPreview && event.setlistPreview.length > 0 ? (
        <p className="comic-copy" style={{ marginTop: 6 }}>
          Recent setlist: {event.setlistPreview.join(" • ")}
        </p>
      ) : null}

      <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {showBookRide ? (
          <Link className="comic-btn comic-btn-primary" href={event.bookHref}>
            Get a Ride
          </Link>
        ) : null}
        <Link className="comic-btn comic-btn-secondary" href={`/shows/${encodeURIComponent(event.id)}`}>
          Show Details
        </Link>
        {event.url ? (
          <a className="comic-btn comic-btn-secondary" href={event.url} target="_blank" rel="noreferrer">
            Tickets
          </a>
        ) : null}
      </div>
    </article>
  );
}
