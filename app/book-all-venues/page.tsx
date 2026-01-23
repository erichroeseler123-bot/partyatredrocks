import Link from 'next/link';
import { VENUES } from '@/data/venues';

export default function BookAllVenuesPage() {
  const venues = Object.values(VENUES);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="pt-28 pb-10 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.35em]">
            Door-to-door concert transportation
          </p>

          <h1 className="mt-3 text-5xl md:text-7xl font-black italic uppercase tracking-tight">
            All Concert Venues
          </h1>

          <p className="mt-4 text-zinc-300 max-w-3xl">
            Shuttle + private SUV service across Denver &amp; the Front Range.
            Pickups anywhere in Denver/Boulder. One stop each way.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#rezdy"
              className="inline-flex items-center justify-center px-6 py-4 rounded-full bg-red-600 hover:bg-red-500 transition font-black uppercase tracking-widest text-[11px]"
            >
              Book via Rezdy
            </a>

            <a
              href="sms:+17203696292"
              className="inline-flex items-center justify-center px-6 py-4 rounded-full border border-zinc-700 hover:border-zinc-500 transition font-black uppercase tracking-widest text-[11px]"
            >
              Book via Text: (720) 369-6292
            </a>

            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-4 rounded-full border border-zinc-700 hover:border-zinc-500 transition font-black uppercase tracking-widest text-[11px]"
            >
              Back Home
            </Link>
          </div>
        </div>
      </section>

      {/* VENUE LIST (NO IMAGES) */}
      <section className="px-6 pb-10">
        <div className="max-w-6xl mx-auto rounded-[2.5rem] border border-zinc-800 bg-zinc-950/40 overflow-hidden">
          <div className="p-6 md:p-10 border-b border-zinc-800">
            <h2 className="text-2xl md:text-3xl font-black italic uppercase">
              Venues We Serve
            </h2>
            <p className="mt-2 text-zinc-400 text-sm">
              Tap a venue to see its show list and venue-specific page.
            </p>
          </div>

          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {venues.map((v) => (
                <Link
                  key={v.slug}
                  href={`/venues/${v.slug}`}
                  className="rounded-2xl border border-zinc-800 bg-black/30 hover:border-zinc-600 hover:bg-black/40 transition px-5 py-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-lg font-black italic uppercase">
                        {v.name}
                      </div>
                      <div className="text-[11px] uppercase tracking-widest text-zinc-500">
                        {v.city}, {v.state}
                      </div>
                    </div>
                    <div className="text-[11px] font-black uppercase tracking-widest text-white/80">
                      View →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REZDY: ALL VENUES CATALOG */}
      <section id="rezdy" className="px-6 pb-24">
        <div className="max-w-6xl mx-auto rounded-[2.5rem] overflow-hidden border border-zinc-800 bg-zinc-950/40">
          <div className="p-6 md:p-10 border-b border-zinc-800">
            <h2 className="text-2xl md:text-3xl font-black italic uppercase">
              Book All-Venues Shuttle
            </h2>
            <p className="mt-2 text-zinc-400 text-sm">
              Booking, pricing, and availability are managed in Rezdy.
            </p>
          </div>

          <div className="p-2 md:p-4">
            <script
              defer
              type="text/javascript"
              src="https://gosnotransportation58.rezdy.com/pluginJs"
            ></script>

            <iframe
              seamless
              width="100%"
              height="1100px"
              frameBorder="0"
              className="rezdy rounded-[2rem] bg-black"
              src="https://gosnotransportation58.rezdy.com/catalog/541037/party-at-red-rocks?iframe=true"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  );
}
