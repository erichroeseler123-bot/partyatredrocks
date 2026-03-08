import type { Metadata } from "next";
import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Colorado Bluegrass Festivals 2026 | Telluride, RockyGrass, Palisade",
  description:
    "Major Colorado bluegrass festivals in 2026: Telluride Bluegrass, RockyGrass, and Palisade Bluegrass & Roots, with planning and shuttle tips.",
  alternates: { canonical: `${SITE}/scene/bluegrass/festivals` },
};

export default function BluegrassFestivalsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <section className="rounded-[32px] border border-soft panel p-8">
        <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/70">Colorado Festival Guide</div>
        <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tight">Bluegrass Festivals 2026</h1>
        <p className="mt-4 max-w-4xl text-white/70">
          The biggest Colorado bluegrass weekends for 2026, plus practical transport planning for group travel and late-night exits.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link href="/find" className="comic-btn comic-btn-primary">Find Shuttle Ride</Link>
          <Link href="/scene/bluegrass" className="comic-btn comic-btn-secondary">Back to Bluegrass Scene</Link>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-3">
        <article className="rounded-3xl border border-soft panel p-6">
          <div className="comic-tag">June 18–21, 2026</div>
          <h2 className="mt-3 text-2xl font-black">Telluride Bluegrass Festival</h2>
          <p className="mt-2 text-white/70">Telluride Town Park • Planet Bluegrass • flagship mountain festival weekend.</p>
          <p className="mt-3 text-white/60 text-sm">Expected mix: bluegrass, folk, americana, jam-adjacent acts. Remote location means transport planning matters.</p>
        </article>

        <article className="rounded-3xl border border-soft panel p-6">
          <div className="comic-tag">July 24–26, 2026</div>
          <h2 className="mt-3 text-2xl font-black">RockyGrass</h2>
          <p className="mt-2 text-white/70">Planet Bluegrass Ranch, Lyons • traditional-leaning bluegrass focus.</p>
          <p className="mt-3 text-white/60 text-sm">Riverfront setting with strong instrument-forward lineups and dense late-night traffic windows.</p>
        </article>

        <article className="rounded-3xl border border-soft panel p-6">
          <div className="comic-tag">June 5–7, 2026</div>
          <h2 className="mt-3 text-2xl font-black">Palisade Bluegrass & Roots</h2>
          <p className="mt-2 text-white/70">Riverbend Park, Palisade • intimate roots + bluegrass weekend.</p>
          <p className="mt-3 text-white/60 text-sm">Strong community festival with regional draw and high group-travel demand from Front Range markets.</p>
        </article>
      </section>

      <section className="mt-8 rounded-3xl border border-soft panel p-6">
        <h2 className="text-2xl font-black">Planning Notes</h2>
        <ul className="mt-4 list-disc pl-6 text-white/70 space-y-2">
          <li>Festival lineups and camping inventory update in phases; confirm details on official event sites.</li>
          <li>For mountain and remote venues, pre-book return transport to avoid post-show bottlenecks.</li>
          <li>Group bookings typically convert best for bluegrass weekends due to shared travel behavior.</li>
        </ul>
      </section>
    </main>
  );
}
