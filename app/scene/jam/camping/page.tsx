import Link from "next/link";
import { JAM_FESTIVALS } from "@/data/jamFestivals";

export const runtime = "nodejs";

export default function JamCampingGuide() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="rounded-[32px] border border-soft panel p-8 shadow-[0_22px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="inline-flex items-center gap-2 rounded-full pill px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/80">
          Jam • Festivals • Camping
        </div>

        <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tight">
          Festival Camping Guide
        </h1>
        <p className="mt-4 text-white/70 max-w-3xl">
          Colorado jam festivals are legendary — and so are the cold nights, long drives, and post-show fatigue.
          Here’s a clean cheat sheet + ride strategy.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/scene/jam"
            className="inline-flex items-center justify-center rounded-full pill px-7 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-white/90 hover:pill-soft transition"
          >
            Back to Jam Hub →
          </Link>
          <Link
            href="/book?scene=jam"
            className="inline-flex items-center justify-center rounded-full bg-neon-blue px-7 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-black hover:bg-surface/40 transition"
          >
            Plan Your Ride
          </Link>
        </div>
      </div>

      <section className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {JAM_FESTIVALS.map((f) => (
          <div key={f.slug} className="rounded-3xl border border-soft panel p-6 hover:bg-surface/40 transition">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">
              {f.whenText}
            </div>
            <h2 className="mt-2 text-xl font-black">{f.name}</h2>
            <p className="mt-2 text-sm text-white/70">{f.whereText}</p>

            <div className="mt-4 text-sm text-white/80">
              <span className="font-black">On-site camping:</span>{" "}
              {f.onsiteCamping ? "Yes" : "Not typically"}
            </div>

            <ul className="mt-3 space-y-1 text-sm text-white/75 list-disc pl-5">
              {f.campingTypes.map((t) => <li key={t}>{t}</li>)}
            </ul>

            <ul className="mt-4 space-y-1 text-sm text-white/70">
              {f.notes.map((n) => <li key={n}>• {n}</li>)}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={f.bookHref}
                className="inline-flex items-center justify-center rounded-full bg-neon-blue px-5 py-2.5 text-[12px] font-black uppercase tracking-[0.22em] text-black hover:bg-surface/40 transition"
              >
                Shuttle Plan
              </Link>
              <a
                href={f.officialUrl}
                target="_blank"
                rel="nofollow noopener"
                className="inline-flex items-center justify-center rounded-full pill px-5 py-2.5 text-[12px] font-black uppercase tracking-[0.22em] text-white/85 hover:pill-soft transition"
              >
                Official Info →
              </a>
            </div>

            <div className="mt-4 text-xs text-white/45">
              Last verified: {f.lastVerified}
            </div>
          </div>
        ))}
      </section>

      <section className="mt-12 rounded-3xl border border-soft panel p-8">
        <h3 className="text-2xl font-black">Colorado jam camping basics</h3>
        <ul className="mt-4 space-y-2 text-white/75">
          <li>• Nights drop fast — bring a warm bag + real layers.</li>
          <li>• Check fire bans + glass rules before you pack.</li>
          <li>• Post-fest tired driving is risky — plan a guaranteed ride home.</li>
        </ul>
      </section>
    </main>
  );
}
