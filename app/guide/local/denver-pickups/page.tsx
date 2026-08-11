import Link from "next/link";
import type { Metadata } from "next";
import ShuttleCTA from "@/components/cta/ShuttleCTA";
import { buildPageIntentMetadata } from "@/lib/pageIntentMetadata";

const PRIVATE_BOOKING_PATH = "/book/red-rocks-amphitheatre/private";

export const metadata: Metadata = {
  ...buildPageIntentMetadata("/guide/local/denver-pickups"),
  title: "Denver Pickup Planning for Private Red Rocks Rides | Party at Red Rocks",
  description:
    "Plan your Denver pickup for private Red Rocks transportation. Party at Red Rocks currently offers private service only, with pickup details confirmed for your group before show night.",
  alternates: {
    canonical: "https://www.partyatredrocks.com/guide/local/denver-pickups",
  },
  openGraph: {
    title: "Denver Pickup Planning for Private Red Rocks Rides | Party at Red Rocks",
    description:
      "Private Denver pickup planning and direct booking for Red Rocks transportation.",
    url: "https://www.partyatredrocks.com/guide/local/denver-pickups",
    type: "article",
  },
};

export default function DenverPickups() {
  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1120px] flex-col gap-8">
        <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="inline-flex items-center rounded-full border border-[#8fd0ff]/30 bg-[#8fd0ff]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Denver Pickup Planning
          </div>
          <h1 className="mt-5 max-w-4xl text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem]">
            Private Denver Pickup for Red Rocks
          </h1>
          <p className="mt-5 max-w-3xl text-[15px] leading-7 text-white/80 sm:text-lg">
            Party at Red Rocks currently offers private transportation only. Your pickup is planned for your group rather than through a shared shuttle stop.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/72">
            Book the private vehicle that fits your group, provide the pickup details requested during booking, and use the confirmed ride information for show night.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={PRIVATE_BOOKING_PATH} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#62f6ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#8cf8ff]">
              View Private Vehicles
            </Link>
            <Link href="/week/red-rocks" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10">
              See This Week&apos;s Shows
            </Link>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <article className="rounded-[28px] border border-white/10 bg-[#0b1224] p-6">
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ffb07c]">1. Choose your vehicle</div>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em]">Keep the group together</h2>
            <p className="mt-3 text-sm leading-7 text-white/72">
              Select the private vehicle option that fits your party so the group has one transportation plan for the night.
            </p>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-[#0b1224] p-6">
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ffb07c]">2. Confirm pickup</div>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em]">Use your booking details</h2>
            <p className="mt-3 text-sm leading-7 text-white/72">
              Your pickup information is tied to the private booking. Follow the confirmed details sent for your ride rather than an old shared-shuttle pickup page.
            </p>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-[#0b1224] p-6">
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ffb07c]">3. Keep the return plan</div>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em]">Know the plan before the show</h2>
            <p className="mt-3 text-sm leading-7 text-white/72">
              The goal is one clear pickup and return plan for your group so you are not solving transportation after the concert ends.
            </p>
          </article>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
          <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Important</div>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em]">Old shared pickup information is retired</h2>
          <div className="mt-5 max-w-4xl space-y-4 text-sm leading-7 text-white/76">
            <p>
              If you reached this page from an older search result that mentioned shared shuttle seats or a fixed downtown shuttle stop, that information no longer describes the current service.
            </p>
            <p>
              Party at Red Rocks now provides private transportation only. Use your current booking confirmation for the exact pickup instructions for your group.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={PRIVATE_BOOKING_PATH} className="inline-flex min-h-11 items-center rounded-full bg-[#62f6ff] px-5 text-xs font-black uppercase tracking-[0.16em] text-[#07111d]">
              Book Private Transportation
            </Link>
            <Link href="/red-rocks/transportation" className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/6 px-4 text-xs font-black uppercase tracking-[0.16em] text-white/88 transition hover:bg-white/10">
              Transportation Guide
            </Link>
          </div>
        </section>

        <ShuttleCTA
          title="Private Denver Transportation to Red Rocks"
          blurb="One private vehicle, one pickup plan, and one return plan for your group."
          href={PRIVATE_BOOKING_PATH}
          button="View Private Vehicles"
        />
      </section>
    </main>
  );
}
