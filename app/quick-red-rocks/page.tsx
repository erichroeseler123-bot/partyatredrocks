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

export default function QuickRedRocksPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedShow, setSelectedShow] = useState<RedRocksShow | null>(null);
  const [transportMode, setTransportMode] = useState<TransportMode | null>(null);
  const [qty, setQty] = useState(2);
  const [specialRequests, setSpecialRequests] = useState("");
  const hero = getBookingVenueImage("red-rocks-amphitheatre");

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
            One question at a time. Pick your show, choose your ride, and launch straight into checkout.
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
              <h2 className="text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
                Which show are you catching?
              </h2>
              <p className="mt-2 text-sm text-white/72">
                Select your night first so the booking pages preload the right artist and date.
              </p>

              <div className="mt-6 grid gap-3">
                {upcomingRedRocksShows.map((show) => (
                  <button
                    key={`${show.isoDate}-${show.artist}`}
                    type="button"
                    onClick={() => {
                      setSelectedShow(show);
                      setStep(2);
                    }}
                    className="rounded-2xl border border-white/12 bg-white/5 p-5 text-left transition hover:-translate-y-[1px] hover:border-[#f5c66c]/40 hover:bg-white/[0.08]"
                  >
                    <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8fd0ff]">{show.formattedDate}</div>
                    <div className="mt-2 text-xl font-black uppercase tracking-[-0.02em] text-white">{show.artist}</div>
                    <div className="mt-2 text-sm leading-6 text-white/72">{show.support}</div>
                    <div className="mt-1 text-xs text-white/55">Show time: {show.time}</div>
                  </button>
                ))}
              </div>
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
              <StepDone>{`${selectedShow.formattedDate} • ${selectedShow.artist}`}</StepDone>

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
              <StepDone>{`${selectedShow.formattedDate} • ${selectedShow.artist}`}</StepDone>
              <StepDone>{transportOptions.find((option) => option.key === transportMode)?.title || transportMode}</StepDone>

              <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] p-5 sm:p-6">
                <h2 className="text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">Final details</h2>

                <div className="mt-5">
                  <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8fd0ff]">Group size</div>
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
                      onClick={() => setQty((current) => Math.min(24, current + 1))}
                      className="h-10 w-10 rounded-full border border-white/14 bg-white/6 text-xl font-black text-white transition hover:bg-white/12"
                    >
                      +
                    </button>
                  </div>
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
