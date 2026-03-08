"use client";

import Link from "next/link";
import { DISPLAY, VENUE_PILLS, SCENE_PILLS, venueImage } from "@/lib/display";

type EventPreview = {
  id: number;
  title: string;
  datetime_local: string;
  venue?: { siteSlug?: string; siteName?: string };
};

type VenuePreview = {
  slug: string;
  name: string;
  area?: string;
};

export default function HomeSections({
  events = [],
  venues = [],
}: {
  events?: EventPreview[];
  venues?: VenuePreview[];
}) {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
      {/* 1) HERO */}
      <section className="comic-hero rounded-[36px] border border-soft p-8 md:p-12 shadow-[0_22px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="comic-kicker">
          {DISPLAY.ui.home.badge}
        </div>

        <h1 className="comic-title">
          {DISPLAY.ui.home.headline}
        </h1>

        <p className="comic-copy max-w-3xl">
          {DISPLAY.ui.home.subhead}
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/book"
            className="comic-btn comic-btn-primary"
          >
            Book Shuttle
          </Link>

          <Link
            href="/week"
            className="comic-btn comic-btn-secondary"
          >
            This Week →
          </Link>

          <Link
            href="/private-suburban"
            className="comic-btn comic-btn-secondary"
          >
            Private SUVs →
          </Link>
        </div>

        <div className="mt-5 text-xs text-white/55">
          {DISPLAY.ui.home.trustLine}
        </div>
      </section>

      {/* 2) FAST BOOK STRIP */}
      <section className="mt-8 rounded-3xl border border-soft panel p-6">
        <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">
          {DISPLAY.ui.home.quickBookLabel}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {VENUE_PILLS.map((v) => (
              <Link
                key={v.slug}
                href={`/book?venue=${v.slug}`}
                className="group relative overflow-hidden rounded-full border border-soft panel px-4 py-2 text-xs font-bold text-white/90 hover:border-soft transition"
              >
                <img
                  src={venueImage(v.slug)}
                  alt={v.name}
                  className="absolute inset-0 h-full w-full object-cover opacity-20 transition-opacity duration-300 group-hover:opacity-30"
                  loading="lazy"
                  decoding="async"
                />
                <span className="relative z-10">{v.name}</span>
              </Link>
            ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {SCENE_PILLS.map((s) => (
            <Link
              key={s.key}
              href={s.href}
              className="rounded-full border border-soft pill px-4 py-2 text-xs font-bold text-white/75 hover:pill-soft transition"
            >
              {s.label.toUpperCase()}
            </Link>
          ))}
        </div>

        <div className="mt-4 text-xs text-white/50">
          {DISPLAY.ui.home.tipPrefix} <Link className="underline" href="/week">{DISPLAY.ui.home.tipLinkText}</Link> {DISPLAY.ui.home.tipSuffix}
        </div>
      </section>

      {/* 3) THIS WEEK PREVIEW */}
      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-black">This Week</h2>
          <Link className="text-sm text-neon-blue font-bold" href="/week">
            View all →
          </Link>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(events ?? []).slice(0, 6).map((e) => (
            <div
              key={e.id}
              className="rounded-3xl border border-soft panel p-6 hover:bg-surface/40 transition"
            >
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">
                {new Date(e.datetime_local).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </div>

              <h3 className="mt-2 text-lg font-black">{e.title}</h3>

              <p className="mt-1 text-sm text-white/70">
                {e.venue?.siteName ?? "Venue"}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link className="text-neon-blue font-bold" href={`/shows/${e.id}`}>
                  Details →
                </Link>
                <Link className="text-white/70 underline" href={`/book?event=${e.id}`}>
                  Ride Options
                </Link>
              </div>
            </div>
          ))}

          {(events ?? []).length === 0 ? (
            <div className="rounded-3xl border border-soft panel p-6 text-white/70">
              No events loaded yet. Wire your events feed into the homepage preview.
            </div>
          ) : null}
        </div>
      </section>

      {/* 4) WHY SHUTTLE */}
      <section className="mt-10 rounded-3xl border border-soft panel p-8">
        <h2 className="text-2xl md:text-3xl font-black">Why shuttle beats parking / rideshare</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2 text-white/75">
          <li className="rounded-2xl border border-soft panel-soft p-4">
            <div className="font-black">Fixed pricing</div>
            <div className="text-sm text-white/70 mt-1">No surge, no mystery totals.</div>
          </li>
          <li className="rounded-2xl border border-soft panel-soft p-4">
            <div className="font-black">Guaranteed pickup plan</div>
            <div className="text-sm text-white/70 mt-1">Clear meetup, clean exit strategy.</div>
          </li>
          <li className="rounded-2xl border border-soft panel-soft p-4">
            <div className="font-black">Skip the lot chaos</div>
            <div className="text-sm text-white/70 mt-1">No stairs gamble, no lot roulette.</div>
          </li>
          <li className="rounded-2xl border border-soft panel-soft p-4">
            <div className="font-black">Safer nights out</div>
            <div className="text-sm text-white/70 mt-1">Pro drivers, group friendly, no stress.</div>
          </li>
        </ul>

        <div className="mt-4 text-sm">
          <Link className="text-neon-blue font-bold" href="/guide/parking-reality">
            Read Parking Reality →
          </Link>
        </div>
      </section>

      {/* 5) VENUES PREVIEW */}
      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-black">Venues</h2>
          <Link className="text-sm text-neon-blue font-bold" href="/venues">
            View all →
          </Link>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(venues ?? []).slice(0, 9).map((v) => (
            <Link
              key={v.slug}
              href={`/venues/${v.slug}`}
              className="rounded-3xl border border-soft panel p-6 hover:bg-surface/40 transition"
            >
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">
                Venue Intel
              </div>
              <div className="mt-2 text-xl font-black">{v.name}</div>
              {v.area ? <div className="mt-1 text-sm text-white/70">{v.area}</div> : null}
              <div className="mt-4 text-sm text-white/70 underline">
                Shuttle details →
              </div>
            </Link>
          ))}

          {(venues ?? []).length === 0 ? (
            <div className="rounded-3xl border border-soft panel p-6 text-white/70">
              No venues loaded yet. Wire your venue list into the homepage preview.
            </div>
          ) : null}
        </div>
      </section>

      {/* 6) GUIDES TEASER */}
      <section className="mt-10 rounded-3xl border border-soft panel p-8">
        <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">
          The Zine
        </div>
        <h2 className="mt-2 text-2xl md:text-3xl font-black">
          Red Rocks + Venue Strategy Guides
        </h2>
        <p className="mt-3 text-white/70 max-w-3xl">
          Parking reality, pickup hubs, post-encore timing, and the “don’t get stranded” plan.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Parking Reality", "/guide/parking-reality"],
            ["Sheraton Pickup", "/guide/sheraton-pickup"],
            ["Post-Encore Strategy", "/guide/post-encore-strategy"],
            ["Bag Policy 2026", "/guide/bag-policy-2026"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-2xl border border-soft panel-soft p-4 hover:bg-surface/40 transition"
            >
              <div className="font-black">{label}</div>
              <div className="mt-1 text-sm text-white/65">Read →</div>
            </Link>
          ))}
        </div>

        <div className="mt-6">
          <Link
            href="/guide"
            className="inline-flex items-center justify-center rounded-full pill px-7 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-white/90 hover:pill-soft transition"
          >
            Open Guides Hub →
          </Link>
        </div>
      </section>

      {/* 7) TRUST */}
      <section className="mt-10 rounded-3xl border border-soft panel p-8">
        <h2 className="text-2xl md:text-3xl font-black">Trust & support</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            ["Clear meetup plan", "Simple pickup, simple return."],
            ["Support line", "Text/call for help finding the shuttle."],
            ["Real drivers", "Professional, safe, consistent."],
          ].map(([h, p]) => (
            <div key={h} className="rounded-2xl border border-soft panel-soft p-4">
              <div className="font-black">{h}</div>
              <div className="mt-1 text-sm text-white/70">{p}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 8) FOOTER CTA */}
      <section className="mt-10 rounded-3xl border border-soft panel p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xl font-black">Ready?</div>
            <div className="text-sm text-white/70">Book your ride before the lots fill.</div>
          </div>
          <Link
            href="/book"
            className="comic-btn comic-btn-primary"
          >
            Book Shuttle
          </Link>
        </div>
      </section>
      </section>
    </main>
  );
}
