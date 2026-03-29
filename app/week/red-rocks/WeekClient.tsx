"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import CardGrid from "@/components/CardGrid";
import EventCard from "@/components/EventCard";
import MusicWave from "@/components/MusicWave";
import PageHero from "@/components/PageHero";
import PrimaryCTASection from "@/components/PrimaryCTASection";
import type { DisplayEvent } from "@/lib/events/presentation";
import FAQBlock from "@/components/FAQBlock";
import type { FaqRow } from "@/lib/faqs/schema";

export type WeekEvent = DisplayEvent;

function parseDate(raw: string) {
  return new Date(raw);
}

function monthKey(raw: string) {
  const d = parseDate(raw);
  if (Number.isNaN(d.getTime())) return "unknown";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  if (key === "all") return "All Months";
  const [y, m] = key.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}

export default function WeekClient({
  initialEvents,
  faqRows = [],
  faqJsonLd,
  schemaJsonLd = [],
}: {
  initialEvents: WeekEvent[];
  faqRows?: FaqRow[];
  faqJsonLd?: unknown;
  schemaJsonLd?: unknown[];
}) {
  const [q, setQ] = useState("");
  const [month, setMonth] = useState("all");

  const sorted = useMemo(() => {
    return [...initialEvents].sort(
      (a, b) => parseDate(a.datetimeLocal).getTime() - parseDate(b.datetimeLocal).getTime()
    );
  }, [initialEvents]);

  const monthOptions = useMemo(() => {
    const keys = Array.from(new Set(sorted.map((e) => monthKey(e.datetimeLocal)).filter((k) => k !== "unknown")));
    return ["all", ...keys];
  }, [sorted]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return sorted.filter((e) => {
      const mOk = month === "all" || monthKey(e.datetimeLocal) === month;
      if (!mOk) return false;
      if (!needle) return true;
      return e.title.toLowerCase().includes(needle) || (e.performerName || "").toLowerCase().includes(needle);
    });
  }, [sorted, month, q]);

  return (
    <main className="brand-page px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-[var(--brand-max-page)]">
        {schemaJsonLd.map((item, index) => (
          <script key={`schema-${index}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
        ))}
        {faqRows.length > 0 && faqJsonLd ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        ) : null}
        <PageHero
          kicker="Upcoming Shows"
          title="Red Rocks Lineup"
          description="Already have tickets? Search by artist, filter by month, and plan your ride before show night."
          actions={[
            { href: "/book", label: "Book a Ride" },
            { href: "/guide", label: "Guides", variant: "secondary" },
          ]}
          footer={<MusicWave bars={24} />}
        />

        <section className="brand-card mt-6 rounded-[28px] p-6 sm:p-7">
          <div className="brand-kicker text-[12px] sm:text-[13px] font-black uppercase tracking-[0.22em]">Filters</div>
          <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_240px]">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search artist or event title"
              className="w-full rounded-[18px] border border-white/14 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--brand-border-strong)]"
            />
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full rounded-[18px] border border-white/14 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--brand-border-strong)]"
            >
              {monthOptions.map((key) => (
                <option key={key} value={key}>
                  {monthLabel(key)}
                </option>
              ))}
            </select>
          </div>
        </section>

        <PrimaryCTASection
          kicker="Before Show Night"
          body="Search the lineup by artist or month, open the show page, then choose the ride that fits the night."
          secondaryBody="Round-trip rides cover the full concert night, and pickup details are sent before the show."
          actions={[
            { href: "/book", label: "Book a Ride" },
            { href: "/venues/red-rocks-amphitheatre", label: "Venue Details", variant: "secondary" },
            { href: "/guide/show-night-strategy/post-show-pickup-plan", label: "Pickup Guide", variant: "secondary" },
            { href: "/guide/logistics/parking-lots", label: "Parking Guide", variant: "secondary" },
          ]}
        />

        <section className="mt-6">
          {filtered.length === 0 ? (
            <div className="brand-card rounded-[26px] p-6 text-sm text-white/72">No events match your current filter.</div>
          ) : (
            <CardGrid className="comic-grid mt-0">
              {filtered.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </CardGrid>
          )}
        </section>

        <section className="brand-card mt-6 rounded-[28px] p-6 sm:p-7">
          <div className="brand-kicker text-[12px] sm:text-[13px] font-black uppercase tracking-[0.22em]">Before You Go</div>
          <p className="mt-3 text-sm leading-7 text-white/72 sm:text-base">
            Check venue notices and road conditions before you leave for the show.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white/10 hover:no-underline"
              href="https://www.redrocksonline.com"
              target="_blank"
              rel="noreferrer"
            >
              Venue Updates
            </a>
            <a
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white/10 hover:no-underline"
              href="https://www.cotrip.org"
              target="_blank"
              rel="noreferrer"
            >
              Road Conditions
            </a>
          </div>
        </section>

        <div className="comic-mobile-cta">
          <Link className="comic-btn comic-btn-primary" href="/book">
            Book a Ride
          </Link>
        </div>

        <FAQBlock title="Red Rocks Week FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
