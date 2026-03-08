import Link from "next/link";
import { getRedRocksAssets } from "@/lib/events/getRedRocksAssets";
import { getRedRocksEvents } from "@/lib/events/getRedRocksEvents";
import EventCard from "@/components/EventCard";
import { toDisplayEvent, type DisplayEvent } from "@/lib/events/presentation";
import FAQBlock from "@/components/FAQBlock";
import MusicWave from "@/components/MusicWave";
import RezdySessionPicker from "@/components/RezdySessionPicker";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";

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

function headliner(e: DisplayEvent) {
  return e.performerName || e.title;
}

function toKey(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

async function fetchShowForDate(dateYYYYMMDD: string): Promise<DisplayEvent | null> {
  const year = dateYYYYMMDD.slice(0, 4);
  const [normalized, assets] = await Promise.all([
    getRedRocksEvents(Number(year)),
    getRedRocksAssets(Number(year)),
  ]);
  const events: DisplayEvent[] = normalized.map((event) => toDisplayEvent(event, { assets }));

  const matches = events
    .map((e) => ({ e, d: parseStartLocal(e.datetimeLocal) }))
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
  const faqRows = await getFaqRowsWithGlobal("shuttles/find.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);
  const date = qp(sp, "date") || "";
  const qty = qp(sp, "qty") || "2";

  const show = date ? await fetchShowForDate(date).catch(() => null) : null;
  const showStart = show ? parseStartLocal(show.datetimeLocal) : null;
  const doorsEst = showStart ? new Date(showStart.getTime() - 90 * 60 * 1000) : null;

  const base = new URLSearchParams();
  if (date) base.set("date", date);
  if (qty) base.set("qty", qty);

  const href = (path: string) => {
    const qs = base.toString();
    return qs ? `${path}?${qs}` : path;
  };

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        {faqRows.length > 0 ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        ) : null}
        <div className="comic-hero">
          <div className="comic-kicker">Ride Match</div>
          <div className="comic-title">Pick Your Red Rocks Ride</div>

          <p className="comic-copy">
            Compare shared shuttles, private SUVs, vans, and party bus options in one mobile-first flow.
          </p>
          <div style={{ marginTop: 18 }}>
            <MusicWave bars={24} />
          </div>
        </div>

        <p className="comic-copy" style={{ marginTop: 16, maxWidth: 760 }}>
          {date ? (
            <>
              Showing options for <b>{date}</b> ({qty} passenger{qty === "1" ? "" : "s"}).
            </>
          ) : (
            <>Choose a ride option below.</>
          )}
        </p>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">How This Page Works</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Use this page to match transportation type to your show night: shared shuttle for predictable return, private
            SUV/van for tighter schedule control, and larger group options when you need one vehicle for everyone.
          </p>
          <p className="comic-copy">
            Best for: first-time Red Rocks visitors, groups coordinating one pickup plan, and travelers avoiding post-show
            surge uncertainty.
          </p>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-secondary" href="/guide/transportation/shuttle-vs-uber">
              Shuttle vs Uber
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/guide/show-night-strategy/post-show-pickup-plan">
              Pickup Plan Guide
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/venues/red-rocks-amphitheatre">
              Red Rocks Venue Intel
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/week/red-rocks">
              Red Rocks Weekly Lineup
            </Link>
          </div>
        </section>

        <RezdySessionPicker initialDate={date} initialQty={Number(qty) || 2} />

        {show ? (
          <div style={{ marginTop: 16 }}>
            <div className="comic-tag">Tonight’s Show</div>
            <div className="comic-h3" style={{ marginTop: 8 }}>
              {headliner(show)}
            </div>
            <div style={{ marginTop: 10 }}>
              <EventCard event={show} showBookRide={false} />
            </div>
            <div style={{ marginTop: 8, opacity: 0.86, fontWeight: 800, fontSize: 14 }}>
              Red Rocks Amphitheatre • {doorsEst ? `Doors (est.) ${fmtTime(doorsEst)} • ` : ""}
              {showStart ? `Show ${fmtTime(showStart)}` : ""}
            </div>
            <div style={{ marginTop: 8, opacity: 0.74, fontSize: 12, fontWeight: 800 }}>
              Doors time is estimated unless otherwise posted by the venue/ticket.
            </div>
          </div>
        ) : date ? (
          <div className="comic-panel" style={{ marginTop: 16, opacity: 0.9 }}>
            No Red Rocks show detected for this date yet — still showing ride options.
          </div>
        ) : null}

        <div className="comic-grid" style={{ marginTop: 16 }}>
          <div className="comic-panel">
            <div className="comic-tag">Best Seller</div>
            <div className="comic-h3">Shuttle Tickets</div>
            <div className="comic-sub">Best for solo fans and small groups</div>
            <div className="comic-copy" style={{ marginTop: 10 }}>
              Easy meetup, fixed pricing, ride there plus guaranteed ride home.
            </div>
            <Link className="comic-btn comic-btn-primary" href={href("/shuttles")}>
              Buy tickets →
            </Link>
          </div>

          <div className="comic-panel">
            <div className="comic-tag">Private</div>
            <div className="comic-h3">Suburban / SUV</div>
            <div className="comic-sub">Best for groups of 6 or fewer</div>
            <div className="comic-copy" style={{ marginTop: 10 }}>
              Door-to-door. Your schedule, your playlist, your crew.
            </div>
            <Link className="comic-btn comic-btn-secondary" href={href("/suv")}>
              Reserve SUV →
            </Link>
          </div>

          <div className="comic-panel">
            <div className="comic-tag">Group Ride</div>
            <div className="comic-h3">10–14 Passenger Vans</div>
            <div className="comic-sub">Best for the whole squad</div>
            <div className="comic-copy" style={{ marginTop: 10 }}>
              More room, same clean ops. Great for groups rolling together.
            </div>
            <Link className="comic-btn comic-btn-secondary" href={href("/private-van")}>
              Reserve van →
            </Link>
          </div>

          <div className="comic-panel">
            <div className="comic-tag">Big Energy</div>
            <div className="comic-h3">Party Bus</div>
            <div className="comic-sub">Best for celebrations and large groups</div>
            <div className="comic-copy" style={{ marginTop: 10 }}>
              Turn the ride into the pregame and keep everyone together.
            </div>
            <Link className="comic-btn comic-btn-secondary" href={href("/party-bus")}>
              Get a quote →
            </Link>
          </div>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Venue Context</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Planning beyond Red Rocks? Use venue pages for Mission Ballroom and Fiddler&apos;s Green to align your pickup
            timing and post-show meetup expectations before booking.
          </p>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-secondary" href="/venues/mission-ballroom">
              Mission Ballroom
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/venues/fiddlers-green-amphitheatre">
              Fiddler&apos;s Green
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/guide/red-rocks-intelligence-hub">
              Red Rocks Intelligence Hub
            </Link>
          </div>
        </section>

        <div className="comic-mobile-cta">
          <Link className="comic-btn comic-btn-primary" href={href("/shuttles")}>
            Book Shuttle Seats
          </Link>
        </div>

        <FAQBlock title="Find Ride FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
