import Link from "next/link";

type TMEvent = {
  id: string;
  name: string;
  url: string | null;
  startLocal: string | null; // "YYYY-MM-DD HH:MM:SS"
  venue: string | null;
  attractions: { name: string }[];
  image: string | null;
};

function qp(searchParams: Record<string, string | string[] | undefined>, k: string) {
  const v = searchParams[k];
  return Array.isArray(v) ? v[0] : v;
}

function parseStartLocal(s: string | null): Date | null {
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/.test(s)) {
    const [d, t] = s.split(/\s+/);
    const [Y, M, D] = d.split("-").map(Number);
    const [hh, mm] = t.split(":").map(Number);
    return new Date(Y, M - 1, D, hh, mm, 0, 0);
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function fmtTime(d: Date) {
  const hh = d.getHours();
  const mm = String(d.getMinutes()).padStart(2, "0");
  const suffix = hh >= 12 ? "PM" : "AM";
  const h12 = ((hh + 11) % 12) + 1;
  return `${h12}:${mm} ${suffix}`;
}

function headliner(e: TMEvent) {
  return e.attractions?.[0]?.name || e.name;
}

function toKey(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

async function fetchShowForDate(dateYYYYMMDD: string): Promise<TMEvent | null> {
  const year = dateYYYYMMDD.slice(0, 4);

  const r = await fetch(`/api/redrocks/events?year=${encodeURIComponent(year)}`, {
    cache: "no-store",
  });

  const j = await r.json().catch(() => null);
  const events: TMEvent[] = (j?.events ?? []) as TMEvent[];

  const matches = events
    .map((e) => ({ e, d: parseStartLocal(e.startLocal) }))
    .filter(({ d }) => (d ? toKey(d) === dateYYYYMMDD : false))
    .sort((a, b) => a.d!.getTime() - b.d!.getTime());

  return matches[0]?.e ?? null;
}

export const metadata = {
  title: "Find Your Ride | Party At Red Rocks",
  description: "Compare shuttle, SUV, vans, and party bus options for your date.",
};

export default async function FindPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const date = qp(sp, "date") || "";
  const qty = qp(sp, "qty") || "2";

  const show = date ? await fetchShowForDate(date).catch(() => null) : null;
  const showStart = show ? parseStartLocal(show.startLocal) : null;
  const doorsEst = showStart ? new Date(showStart.getTime() - 90 * 60 * 1000) : null;

  const base = new URLSearchParams();
  if (date) base.set("date", date);
  if (qty) base.set("qty", qty);

  const href = (path: string) => {
    const qs = base.toString();
    return qs ? `${path}?${qs}` : path;
  };

  return (
    <main className="home">
      <section className="home-wrap home-section">
        <div className="home-kicker">Find your ride</div>
        <div className="home-h2">Pick the ride that fits your night</div>

        <p className="home-subhead" style={{ maxWidth: 760 }}>
          {date ? (
            <>
              Showing options for <b>{date}</b> ({qty} passenger{qty === "1" ? "" : "s"}).
            </>
          ) : (
            <>Choose a ride option below.</>
          )}
        </p>

        {show ? (
          <div className="card" style={{ marginTop: 14, padding: 16 }}>
            <div style={{ fontWeight: 1000, fontSize: 18 }}>{headliner(show)}</div>

            <div style={{ marginTop: 6, opacity: 0.86, fontWeight: 800 }}>
              {show?.venue ? `${show.venue} • ` : ""}
              {doorsEst ? `Doors (est.) ${fmtTime(doorsEst)} • ` : ""}
              {showStart ? `Show ${fmtTime(showStart)}` : ""}
            </div>

            <div style={{ marginTop: 8, opacity: 0.7, fontSize: 12, fontWeight: 800 }}>
              Doors time is estimated unless otherwise posted by the venue/ticket.
            </div>
          </div>
        ) : date ? (
          <div className="card" style={{ marginTop: 14, padding: 16, opacity: 0.85 }}>
            No Red Rocks show detected for this date yet — still showing ride options.
          </div>
        ) : null}

        <div className="home-vibe-grid" style={{ marginTop: 18 }}>
          <div className="card home-vibe-card">
            <div className="home-vibe-top">
              <div className="home-vibe-title">Shuttle tickets</div>
              <div className="home-vibe-best">Best for: solo fans & small groups</div>
            </div>
            <div className="home-vibe-copy">
              Easy meetup, fixed pricing, ride there + guaranteed ride home.
            </div>
            <Link className="btn btn-primary" href={href("/shuttles")}>
              Buy tickets →
            </Link>
          </div>

          <div className="card home-vibe-card">
            <div className="home-vibe-top">
              <div className="home-vibe-title">Suburban / SUV</div>
              <div className="home-vibe-best">Best for: groups of 6 or fewer</div>
            </div>
            <div className="home-vibe-copy">Door-to-door. Your schedule, your playlist, your crew.</div>
            <Link className="btn btn-secondary" href={href("/suv")}>
              Reserve SUV →
            </Link>
          </div>

          <div className="card home-vibe-card">
            <div className="home-vibe-top">
              <div className="home-vibe-title">10–14 passenger vans</div>
              <div className="home-vibe-best">Best for: the whole squad</div>
            </div>
            <div className="home-vibe-copy">
              More room, same clean ops. Great for groups that want to roll together.
            </div>
            <Link className="btn btn-secondary" href={href("/private-van")}>
              Reserve van →
            </Link>
          </div>

          <div className="card home-vibe-card">
            <div className="home-vibe-top">
              <div className="home-vibe-title">Party bus</div>
              <div className="home-vibe-best">Best for: celebrations + big groups</div>
            </div>
            <div className="home-vibe-copy">Turn the ride into the pregame. Big energy, everyone together.</div>
            <Link className="btn btn-secondary" href={href("/party-bus")}>
              Get a quote →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
