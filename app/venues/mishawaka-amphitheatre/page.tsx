import Link from "next/link";
import RezdyWidget from "@/components/RezdyWidget";

export const revalidate = 3600;

export default function MishawakaRezdyPage() {
  const REZDY_BASE = "https://gosnotransportation58.rezdy.com";
  const PRODUCT_ID = 725838;

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-600">
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-24">
        {/* Header */}
        <div className="mb-12">
          <div className="text-blue-400 font-bold uppercase tracking-[0.35em] text-[10px] mb-4 font-mono">
            Shared Shuttle // Poudre Canyon
          </div>

          <h1 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
            Mishawaka Shuttle
          </h1>

          <p className="mt-6 text-zinc-300 text-lg max-w-2xl leading-relaxed">
            $65 round trip per person. Shared shuttle service to shows at Mishawaka
            Amphitheatre — we handle the canyon logistics so you don’t have to.
          </p>

          {/* Pricing chips */}
          <div className="mt-8 flex flex-wrap gap-3">
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] uppercase tracking-widest font-bold font-mono text-zinc-200">
              $65 RT / person
            </div>
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] uppercase tracking-widest font-bold font-mono text-zinc-200">
              Shared shuttle
            </div>
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] uppercase tracking-widest font-bold font-mono text-zinc-200">
              Reserve below
            </div>
          </div>

          {/* Back link */}
          <div className="mt-10">
            <Link
              href="/"
              className="inline-block text-[10px] uppercase tracking-[0.35em] font-bold font-mono text-zinc-400 hover:text-white transition-colors"
            >
              ← Back to Dispatch Home
            </Link>
          </div>
        </div>

        {/* Widget */}
        <section className="rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl p-4 md:p-6">
          <div className="mb-4 md:mb-6 flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.35em] font-bold font-mono text-zinc-400">
                Booking Console
              </div>
              <div className="text-xl font-black uppercase italic tracking-tight">
                Select Date & Tickets
              </div>
            </div>

            <a
              href="tel:7203696292"
              className="hidden md:inline-flex items-center justify-center px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors text-[10px] uppercase tracking-[0.35em] font-black"
            >
              Call (720) 369-6292
            </a>
          </div>

<RezdyWidget accountBaseUrl={REZDY_BASE} productId={PRODUCT_ID} height="1150" />
        </section>

        {/* Footer note */}
        <div className="mt-10 text-zinc-400 text-sm max-w-3xl leading-relaxed">
          Tip: If the widget looks tall on mobile, that’s normal — Rezdy’s calendar expands
          based on availability. If you want, we can add a “compact mode” with a toggle.
        </div>
      </div>
    </main>
  );
}
