import Link from "next/link";
import type { DisplayEvent } from "@/lib/events/presentation";

const CARD_FALLBACK_IMAGE =
  "/api/unsplash-image?q=red+rocks+concert+crowd+night+colorado&src=%2Fimages%2Fshows%2Ffallback.jpg&alt=Red+Rocks+concert+night&w=960&h=540";

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
  const heroImage = event.image || CARD_FALLBACK_IMAGE;
  const thumbnailImage = event.thumbnail || heroImage;

  return (
    <article className="brand-card overflow-hidden rounded-[26px] shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
      <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-white/10 bg-black/20">
        <img
          src={heroImage}
          alt={`${event.title} – ${event.performerName || "upcoming concert"}`}
          width={320}
          height={180}
          className="h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,22,0.04),rgba(5,8,22,0.28)_55%,rgba(5,8,22,0.72)_100%)]" />
        <div className="absolute left-4 top-4 rounded-full border border-white/14 bg-black/35 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/86">
          Upcoming Show
        </div>
      </div>

      <div className="p-5">
        <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--brand-cyan)]">
          {fmtDate(event.datetimeLocal)}
        </div>
        <h2 className="mt-2 text-xl font-black tracking-[-0.03em] text-white">{event.title}</h2>
        <p className="mt-3 text-sm leading-7 text-white/72">
          {event.performerName ? (
            <>
              Headliner:{" "}
              <Link
                href={`/artists/${encodeURIComponent(artistSlug)}`}
                className="text-white/88 underline decoration-white/30 underline-offset-4 transition hover:text-white"
              >
                {event.performerName}
              </Link>
            </>
          ) : (
            "Headliner info pending"
          )}
        </p>

        {event.thumbnail ? (
          <div className="mt-4 flex items-center gap-3">
            <img
              src={thumbnailImage}
              alt={`${event.performerName || "Artist"} thumbnail`}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full border border-white/18 object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-white/54">Headliner</div>
          </div>
        ) : null}

        {event.weather ? (
          <p className="mt-4 text-sm leading-7 text-white/68">
            Weather (next 7 days): {event.weather.highF}/{event.weather.lowF}F
            {typeof event.weather.precipChance === "number" ? ` • ${event.weather.precipChance}% precip` : ""}
          </p>
        ) : null}

        {event.setlistPreview && event.setlistPreview.length > 0 ? (
          <p className="mt-2 text-sm leading-7 text-white/68">Recent setlist: {event.setlistPreview.join(" • ")}</p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-3">
          {showBookRide ? (
            <Link
              className="brand-button-primary inline-flex min-h-11 items-center justify-center px-5 py-3 text-[12px] font-black uppercase tracking-[0.18em]"
              href={event.bookHref}
            >
              Get a Ride
            </Link>
          ) : null}
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white/10 hover:no-underline"
            href={`/shows/${encodeURIComponent(event.id)}`}
          >
            Show Details
          </Link>
          {event.url ? (
            <a
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white/10 hover:no-underline"
              href={event.url}
              target="_blank"
              rel="noreferrer"
            >
              Tickets
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
