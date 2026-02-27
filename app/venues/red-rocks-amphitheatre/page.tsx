import Link from "next/link";
import { getRedRocksEvents } from "@/lib/redrocksEvents";
import RedRocksShowsGrid from "@/components/RedRocksShowsGrid";

type SP = Record<string, string | string[] | undefined>;

function first(sp: SP, key: string) {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

function buildQs(sp: SP) {
  const qs = new URLSearchParams();
  const pickup = first(sp, "pickup");
  const date = first(sp, "date");
  const qty = first(sp, "qty");
  const venue = first(sp, "venue");


  if (pickup) qs.set("pickup", pickup);
  if (date) qs.set("date", date);
  if (qty) qs.set("qty", qty);
  if (venue) qs.set("venue", venue);

  const q = qs.toString();
  return q ? `?${q}` : "";
}

export default async function RedRocksPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;

  const pickup = first(sp, "pickup") || "";
  const date = first(sp, "date") || "";
  const qty = first(sp, "qty") || "";

  const qs = buildQs(sp);

  const events = getRedRocksEvents();

  // NOTE: pick the real booking endpoint you want.
  // If /book-shuttle exists and is the actual Red Rocks booking flow, use it:
  const bookTarget = `/book-shuttle${qs}`;

  return (
    <main className="min-h-screen bg-surface text-white px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
  <Link href="/book?venue=red-rocks-amphitheatre" className="btn-primary text-2xl px-10 py-5 mb-8 inline-block">
    Book Shuttle to This Venue →
  </Link>
            Red Rocks Amphitheatre
          </h1>
          <p className="text-muted max-w-2xl">
            Morrison, CO · Live events pulled from SeatGeek · Venue ID 196
          </p>
        </header>

        {/* Prefill banner (only shows when params exist) */}
        {(pickup || date || qty) ? (
          <section className="panel-soft p-6 mb-10">
            <div className="text-[11px] font-black uppercase tracking-[.22em] text-white/60">
              Booking Prefill
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {pickup ? (
                <span className="pill px-4 py-2 text-white/85">
                  Pickup: <span className="text-white/95 font-black">{pickup}</span>
                </span>
              ) : null}
              {date ? (
                <span className="pill px-4 py-2 text-white/85">
                  Date: <span className="text-white/95 font-black">{date}</span>
                </span>
              ) : null}
              {qty ? (
                <span className="pill px-4 py-2 text-white/85">
                  Party: <span className="text-white/95 font-black">{qty}</span>
                </span>
              ) : null}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link className="btn-primary" href={bookTarget}>
                Continue to booking
              </Link>
              <Link className="btn-secondary" href="/book?venue=red-rocks">
                Change destination
              </Link>
            </div>

            <div className="mt-3 text-xs text-white/55">
              Tip: if your device shows “mm/dd/yyyy” for date inputs, that’s just the browser UI.
              We still pass an ISO date (YYYY-MM-DD) when selected.
            </div>
          </section>
        ) : (
          <section className="panel-soft p-6 mb-10">
            <div className="text-[11px] font-black uppercase tracking-[.22em] text-white/60">
              Booking
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link className="btn-primary" href="/book?venue=red-rocks">
                Start booking
              </Link>
              <Link className="btn-secondary" href="/week">
                See events this week
              </Link>
            </div>
          </section>
        )}

        <section>
          <h2 className="text-3xl font-bold mb-8">Upcoming Shows</h2>
          <RedRocksShowsGrid events={events} />
        </section>
      </div>
    </main>
  );
}
