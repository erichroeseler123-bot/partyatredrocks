"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";

export type ScheduleExplorerEvent = {
  id: string;
  month: string;
  name: string;
  dateLabel: string;
  timeLabel: string | null;
  support: string | null;
  image: string;
  shuttleHref: string;
  showHref: string;
  showLabel: string;
  showExternal: boolean;
};

export default function ScheduleExplorer({ events }: { events: ScheduleExplorerEvent[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(events[0]?.id ?? null);

  const grouped = useMemo(() => {
    const map = new Map<string, ScheduleExplorerEvent[]>();
    for (const event of events) {
      const list = map.get(event.month) || [];
      list.push(event);
      map.set(event.month, list);
    }
    return Array.from(map.entries());
  }, [events]);

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedId) || null,
    [events, selectedId],
  );

  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-2 xl:items-start">
      <div className="space-y-10 xl:max-h-[80vh] xl:overflow-y-auto xl:pr-6 xl:border-r xl:border-white/12">
        {grouped.map(([month, monthEvents]) => (
          <section key={month}>
            <div className="flex items-end justify-between gap-3 border-b border-[#f5c66c]/26 pb-3">
              <h2 className="text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">{month}</h2>
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/56">{monthEvents.length} shows</div>
            </div>

            <div className="mt-5 space-y-3">
              {monthEvents.map((event) => {
                const isActive = selectedEvent?.id === event.id;
                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => setSelectedId(event.id)}
                    className={`w-full min-h-[176px] rounded-[24px] border p-5 text-left transition ${
                      isActive
                        ? "border-[#f5c66c]/65 bg-[rgba(245,198,108,0.12)] shadow-[0_12px_34px_rgba(245,198,108,0.18)]"
                        : "border-white/12 bg-[linear-gradient(180deg,rgba(14,20,38,0.9),rgba(8,12,24,0.95))] hover:-translate-y-0.5 hover:border-white/24"
                    }`}
                  >
                    <div className="flex items-start gap-5">
                      <div className="relative h-32 w-36 shrink-0 overflow-hidden rounded-xl border border-white/12">
                        <Image
                          src={event.image}
                          alt={`${event.name} schedule image`}
                          fill
                          className="object-cover"
                          sizes="144px"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <h3 className="text-lg font-black uppercase tracking-[-0.02em] text-white sm:text-[1.35rem]">{event.name}</h3>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-semibold text-[#8fd0ff]">
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {event.dateLabel}
                          </span>
                          {event.timeLabel ? (
                            <span className="inline-flex items-center gap-1 text-white/72">
                              <Clock3 className="h-3.5 w-3.5" />
                              {event.timeLabel}
                            </span>
                          ) : null}
                        </div>
                        {event.support ? (
                          <p className="mt-3 text-sm leading-6 text-white/72">
                            <span className="font-semibold text-white/82">Support:</span> {event.support}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <aside className="xl:sticky xl:top-24 xl:self-start xl:pl-2">
        <div className="rounded-[24px] border border-white/12 bg-[linear-gradient(180deg,rgba(14,20,38,0.96),rgba(8,12,24,0.98))] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.38)] sm:p-6">
          {selectedEvent ? (
            <>
              <div className="relative mb-5 h-52 w-full overflow-hidden rounded-xl border border-white/12 sm:h-60">
                <Image
                  src={selectedEvent.image}
                  alt={`${selectedEvent.name} detail visual`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 420px, 100vw"
                />
              </div>

              <h3 className="text-2xl font-black uppercase tracking-[-0.03em] text-white">{selectedEvent.name}</h3>
              <p className="mt-3 text-sm font-semibold text-[#8fd0ff]">{selectedEvent.dateLabel}</p>
              {selectedEvent.timeLabel ? (
                <p className="mt-1 inline-flex items-center gap-1 text-sm text-white/74">
                  <Clock3 className="h-3.5 w-3.5" />
                  {selectedEvent.timeLabel}
                </p>
              ) : null}
              {selectedEvent.support ? (
                <p className="mt-3 text-sm leading-6 text-white/72">
                  <span className="font-semibold text-white/84">Support:</span> {selectedEvent.support}
                </p>
              ) : null}

              <div className="mt-5 rounded-[20px] border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/72">
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f5c66c]">Show Preview</div>
                <p className="mt-2">Use this panel to confirm the date, support, and ride plan before you jump into booking.</p>
              </div>

              <div className="mt-5 space-y-2">
                <Link
                  href={selectedEvent.shuttleHref}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[#ffd6a3]/26 bg-[linear-gradient(180deg,#a95f28_0%,#8d4f20_100%)] px-4 text-xs font-black uppercase tracking-[0.16em] text-[#120f0b] transition hover:bg-[linear-gradient(180deg,#b66c31_0%,#975321_100%)]"
                >
                  Book Shuttle
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Link>
                <Link
                  href={selectedEvent.showHref}
                  target={selectedEvent.showExternal ? "_blank" : undefined}
                  rel={selectedEvent.showExternal ? "noreferrer noopener" : undefined}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/18 bg-white px-4 text-xs font-black uppercase tracking-[0.16em] text-[#120f0b] transition hover:bg-[#f5f5f5]"
                >
                  {selectedEvent.showLabel}
                </Link>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-white/20 bg-black/20 p-8 text-center text-sm text-white/70">
              Select a show to see details and booking options.
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
