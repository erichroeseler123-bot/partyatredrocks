import Link from "next/link";
import { CarFront, MapPin, ShieldCheck } from "lucide-react";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";

export const metadata = {
  title: "Red Rocks Tailgating Guide",
  description:
    "Tailgating guide for Red Rocks with arrival timing, lot expectations, what to bring, and when a private ride is the better fit.",
  alternates: {
    canonical: "/guide/tailgating",
  },
};

const checklist = [
  "Arrive early enough to park, unload, and still make the walk in without rushing.",
  "Keep food and drinks simple and easy to pack back into the vehicle.",
  "Bring layers, water, and lighting for the walk back after the show.",
  "Set one regroup point before everyone heads toward the gates.",
];

const privateBenefits = [
  "Upper North limo-lane access for easier arrival",
  "Better fit for groups that want to tailgate before the show",
  "One vehicle for the full night",
  "Pickup details sent before your ride",
  "Return ride covered after the encore",
];

export default async function TailgatingGuidePage({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;
  return (
    <main className="bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1440px] flex-col gap-8">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,11,18,0.96),rgba(10,9,20,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,176,124,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(143,208,255,0.12),transparent_28%)]" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
              <MapPin className="h-3.5 w-3.5" />
              Red Rocks Tailgating
            </div>
            <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem] lg:text-[5rem]">
              Red Rocks Tailgating Guide
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/74 sm:text-lg">
              Tailgating at Red Rocks can be a great part of the night, but it works best when you plan your arrival, parking,
              and walk in ahead of time.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={buildBookingHref({ target: "private", venue: "red-rocks-amphitheatre", searchParams: sp })}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#3df3ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff]"
              >
                Book a Private Ride
              </Link>
              <Link
                href="/guide/tailgate-faq"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                Tailgate FAQ
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
              Before You Arrive
            </div>
            <div className="mt-4 space-y-4 text-sm leading-7 text-white/74">
              <p>
                Tailgating works best when you arrive early enough to park, settle in, and still have time to head through the
                gates without rushing.
              </p>
              <p>
                The biggest mistakes are arriving too late, carrying too much gear, or assuming the walk back after the show will
                feel easy. Red Rocks can turn a casual parking-lot plan into a long night if the timing is off.
              </p>
            </div>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
              Tailgating Checklist
            </div>
            <ul className="mt-4 space-y-3">
              {checklist.map((item) => (
                <li key={item} className="text-sm leading-7 text-white/74">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,26,0.96),rgba(6,9,18,0.96))] p-6 sm:p-8">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
            <CarFront className="h-4 w-4" />
            Private Ride Benefits
          </div>
          <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">
            Best for groups that want to tailgate before the show
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/72">
            Private rides use the Upper North limo lane and are the best fit for groups that want easier arrival, time to tailgate,
            and one vehicle for the full night.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {privateBenefits.map((item) => (
              <div key={item} className="rounded-[24px] border border-white/10 bg-[#0b1224] p-5">
                <div className="flex items-start gap-3 text-sm font-bold leading-6 text-white">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#ffb07c]" />
                  <span>{item}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={buildBookingHref({ target: "private", venue: "red-rocks-amphitheatre", searchParams: sp })}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#3df3ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff]"
            >
              Book Private Service
            </Link>
            <Link
              href="/red-rocks/parking"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
            >
              Parking Guide
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
