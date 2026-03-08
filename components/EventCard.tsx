import Link from "next/link";
import type { DisplayEvent } from "@/lib/events/presentation";

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
  return (
    <article className="comic-panel">
      <img
        src={event.image}
        alt={`Event art for ${event.title}`}
        className="w-full h-44 object-cover rounded-xl border border-white/20"
        loading="lazy"
      />
      <div className="comic-tag" style={{ marginTop: 10 }}>
        {fmtDate(event.datetimeLocal)}
      </div>
      <h2 className="comic-h3">{event.title}</h2>
      <p className="comic-copy">{event.performerName ? `Headliner: ${event.performerName}` : "Headliner info pending"}</p>
      <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {showBookRide ? (
          <Link className="comic-btn comic-btn-primary" href={event.bookHref}>
            Book Ride
          </Link>
        ) : null}
        {event.url ? (
          <a className="comic-btn comic-btn-secondary" href={event.url} target="_blank" rel="noreferrer">
            Tickets
          </a>
        ) : null}
      </div>
    </article>
  );
}
