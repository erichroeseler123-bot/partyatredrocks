"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { getBookingVenueImage } from "@/data/media";
import { upcomingRedRocksShows, type RedRocksShow } from "@/data/red-rocks-events";

type TransportMode = "shared" | "suv" | "van" | "sprinter" | "party-bus";

const transportOptions: Array<{
  key: TransportMode;
  title: string;
  price: string;
  description: string;
}> = [
  {
    key: "shared",
    title: "Shared Shuttle",
    price: "$59 / seat",
    description: "Fastest option for most show nights.",
  },
  {
    key: "suv",
    title: "Private SUV",
    price: "$499",
    description: "Up to 6 guests with one clean pickup plan.",
  },
  {
    key: "van",
    title: "10 Passenger Van",
    price: "$599",
    description: "Best for groups who want one vehicle all night.",
  },
  {
    key: "sprinter",
    title: "14 Passenger Sprinter",
    price: "$799",
    description: "Extra room for bigger groups and gear.",
  },
  {
    key: "party-bus",
    title: "24 Passenger Party Bus",
    price: "$1199",
    description: "Largest private option for full-group arrivals.",
  },
];

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function StepDone({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-4">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-sm font-black text-black">
        ✓
      </div>
      <div className="text-sm font-semibold text-emerald-100 sm:text-base">{children}</div>
    </div>
  );
}

function isoToDate(isoDate: string) {
  return new Date(`${isoDate}T12:00:00`);
}

export default function QuickRedRocksPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedShow, setSelectedShow] = useState<RedRocksShow | null>(null);
  const [transportMode, setTransportMode] = useState<TransportMode | null>(null);
  const [qty, setQty] = useState(2);
  const [specialRequests, setSpecialRequests] = useState("");

  const hero = getBookingVenueImage("red-rocks-amphitheatre");

  const sortedShows = useMemo(
    () => [...upcomingRedRocksShows].sort((a, b) => a.isoDate.localeCompare(b.isoDate)),
    [],
  );

  const monthStarts = useMemo(() => {
    const unique = new Map<string, Date>();
    for (const show of sortedShows) {
      const date = isoToDate(show.isoDate);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!unique.has(key)) unique.set(key, new Date(date.getFullYear(), date.getMonth(), 1));
    }
    return Array.from(unique.values()).sort((a, b) => a.getTime() - b.getTime());
  }, [sortedShows]);

  const [calendarMonthIndex, setCalendarMonthIndex] = useState(0);
  const activeMonth = monthStarts[calendarMonthIndex] || new Date();

  const showsByDate = useMemo(() => {
    const map = new Map<string, RedRocksShow[]>();
    for (const show of sortedShows) {
      const bucket = map.get(show.isoDate) || [];
      bucket.push(show);
      map.set(show.isoDate, bucket);
    }
    return map;
  }, [sortedShows]);

  const activeMonthShows = useMemo(
    () =>
      sortedShows.filter((show) => {
        const date = isoToDate(show.isoDate);
        return date.getFullYear() === activeMonth.getFullYear() && date.getMonth() === activeMonth.getMonth();
      }),
    [activeMonth, sortedShows],
  );

  const firstWeekday = new Date(activeMonth.getFullYear(), activeMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 0).getDate();

  const isPrivateMode = transportMode !== null && transportMode !== "shared";

  const checkoutHref = useMemo(() => {
    if (!selectedShow || !transportMode) return "";

    const params = new URLSearchParams({
      date: selectedShow.isoDate,
      artist: selectedShow.artist,
      mode: transportMode,
      qty: String(qty),
      requests: specialRequests.trim(),
    });

    if (transportMode === "shared") {
      return `/book/red-rocks-amphitheatre/shared?${params.toString()}`;
    }

    params.set("vehicle", transportMode);
    params.set("vehicle_qty", String(qty));
    return `/book/red-rocks-amphitheatre/private?${params.toString()}`;
  }, [qty, selectedShow, specialRequests, transportMode]);

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="relative h-[380px] overflow-hidden border-b border-white/10">
        <Image src={hero.hero} alt={hero.heroAlt} fill priority className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,9,18,0.45),rgba(6,9,18,0.92))]" />
        <div className="relative mx-auto flex h-full w-full max-w-[1240px] flex-col justify-end px-4 pb-10 sm:px-6 lg:px-8">
          <div className="inline-flex w-fit items-center rounded-full border border-white/14 bg-black/35 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Quick Ride Wizard
          </div>
          <h1 className="mt-4 max-w-4xl text-[2.15rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[3.25rem]">
            Your Red Rocks Ride in 60 Seconds
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/78 sm:text-[15px]">
            Pick your date from the calendar, choose your ride, and launch straight into checkout.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[900px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6 inline-flex items-center rounded-full border border-white/12 bg-white/5 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/80">
          Step {step} of 3
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.section
              key="step-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.28 }}
            >
              <h2 className="text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">Choose your show date</h2>
              <p className="mt-2 text-sm text-white/72">Tap a highlighted day to select that Red Rocks show.</p>

              <div className="mt-6 rounded-[24px] border border-white/10 bg-[#0b1224] p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCalendarMonthIndex((current) => Math.max(0, current - 1))}
                    disabled={calendarMonthIndex === 0}
                    className="rounded-full border border-white/14 bg-white/6 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-white transition disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Prev
                  </button>
                  <div className="text-sm font-black uppercase tracking-[0.16em] text-[#8fd0ff] sm:text-base">
                    {activeMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCalendarMonthIndex((current) => Math.min(monthStarts.length - 1, current + 1))}
                    disabled={calendarMonthIndex >= monthStarts.length - 1}
                    className="rounded-full border border-white/14 bg-white/6 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-white transition disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Next
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {weekdayLabels.map((label) => (
                    <div key={label} className="text-center text-[10px] font-black uppercase tracking-[0.18em] text-white/48">
                      {label}
                    </div>
                  ))}

                  {Array.from({ length: firstWeekday }).map((_, index) => (
                    <div key={`blank-${index}`} className="h-16 rounded-xl border border-transparent" />
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1;
                    const isoDate = `${activeMonth.getFullYear()}-${String(activeMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const dayShows = showsByDate.get(isoDate) || [];
                    const hasShow = dayShows.length > 0;
                    const firstShow = dayShows[0];

                    return (
                      <button
                        key={isoDate}
                        type="button"
                        disabled={!hasShow}
                        onClick={() => {
                          if (!firstShow) return;
                          setSelectedShow(firstShow);
                          setStep(2);
                        }}
                        className={[
                          "h-16 rounded-xl border p-2 text-left transition",
                          hasShow
                            ? "border-[#f5c66c]/45 bg-[#1b160f] hover:-translate-y-[1px] hover:border-[#f5c66c]/75"
                            : "cursor-not-allowed border-white/8 bg-white/[0.03] opacity-55",
                        ].join(" ")}
                      >
                        <div className="text-xs font-black text-white">{day}</div>
                        <div className="mt-1 line-clamp-2 text-[10px] leading-4 text-[#ffcc8a]">{firstShow ? firstShow.artist : ""}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {activeMonthShows.length ? (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/55">Shows this month</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeMonthShows.map((show) => (
                      <button
                        key={`${show.isoDate}-chip`}
                        type="button"
                        onClick={() => {
                          setSelectedShow(show);
                          setStep(2);
                        }}
                        className="rounded-full border border-white/14 bg-black/25 px-3 py-1.5 text-xs font-bold text-white/88 transition hover:border-[#f5c66c]/50"
                      >
                        {show.formattedDate} - {show.artist}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </motion.section>
          ) : null}

          {step === 2 && selectedShow ? (
            <motion.section
              key="step-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.28 }}
              className="space-y-6"
            >
              <StepDone>{`${selectedShow.formattedDate} - ${selectedShow.artist}`}</StepDone>

              <div>
                <h2 className="text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">How do you want to roll?</h2>
                <p className="mt-2 text-sm text-white/72">Choose your transport mode and we will route you to the right checkout path.</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {transportOptions.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => {
                      setTransportMode(option.key);
                      setQty(option.key === "shared" ? 2 : 1);
                      setStep(3);
                    }}
                    className="rounded-2xl border border-white/12 bg-white/5 p-5 text-left transition hover:-translate-y-[1px] hover:border-[#f5c66c]/40 hover:bg-white/[0.08]"
                  >
                    <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ffb07c]">{option.price}</div>
                    <div className="mt-2 text-lg font-black uppercase tracking-[-0.02em] text-white">{option.title}</div>
                    <div className="mt-2 text-sm leading-6 text-white/72">{option.description}</div>
                  </button>
                ))}
              </div>
            </motion.section>
          ) : null}

          {step === 3 && selectedShow && transportMode ? (
            <motion.section
              key="step-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.28 }}
              className="space-y-6"
            >
              <StepDone>{`${selectedShow.formattedDate} - ${selectedShow.artist}`}</StepDone>
              <StepDone>{transportOptions.find((option) => option.key === transportMode)?.title || transportMode}</StepDone>

              <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] p-5 sm:p-6">
                <h2 className="text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">Final details</h2>

                <div className="mt-5">
                  <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8fd0ff]">
                    {isPrivateMode ? "Number of vehicles" : "Number of riders"}
                  </div>
                  <div className="mt-3 inline-flex items-center gap-3 rounded-full border border-white/12 bg-black/25 p-2">
                    <button
                      type="button"
                      onClick={() => setQty((current) => Math.max(1, current - 1))}
                      className="h-10 w-10 rounded-full border border-white/14 bg-white/6 text-xl font-black text-white transition hover:bg-white/12"
                    >
                      -
                    </button>
                    <div className="min-w-10 text-center text-lg font-black">{qty}</div>
                    <button
                      type="button"
                      onClick={() => setQty((current) => Math.min(isPrivateMode ? 8 : 24, current + 1))}
                      className="h-10 w-10 rounded-full border border-white/14 bg-white/6 text-xl font-black text-white transition hover:bg-white/12"
                    >
                      +
                    </button>
                  </div>
                  {isPrivateMode ? (
                    <p className="mt-2 text-xs text-white/58">This value is vehicle count (Suburbans, vans, Sprinters, or party buses).</p>
                  ) : null}
                </div>

                <div className="mt-5">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8fd0ff]" htmlFor="quick-requests">
                    Special requests (optional)
                  </label>
                  <textarea
                    id="quick-requests"
                    value={specialRequests}
                    onChange={(event) => setSpecialRequests(event.target.value)}
                    placeholder="Pickup notes, timing preferences, group details..."
                    className="mt-3 min-h-28 w-full rounded-2xl border border-white/12 bg-black/25 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-[#f5c66c]/40"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!checkoutHref) return;
                    window.location.assign(checkoutHref);
                  }}
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#ffd6a3]/28 bg-[linear-gradient(180deg,#a95f28_0%,#8d4f20_100%)] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#fff4de] transition hover:bg-[linear-gradient(180deg,#b66c31_0%,#975321_100%)]"
                >
                  Go to checkout
                </button>
              </div>
            </motion.section>
          ) : null}
        </AnimatePresence>
      </section>
    </main>
  );
}
