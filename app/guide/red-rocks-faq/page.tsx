import Link from "next/link";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";

export const metadata = {
  title: "Red Rocks FAQ | Party at Red Rocks",
  description:
    "Everything people actually need: pickup timing, return plan, what to bring, cancellation rules, and common questions.",
};

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <details className="rounded-2xl border border-soft bg-surface/30 p-5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <summary className="cursor-pointer list-none text-base font-black tracking-tight">
        {q}
      </summary>
      <p className="mt-3 text-white/70">{a}</p>
    </details>
  );
}

export default async function RedRocksFAQ({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;
  return (
    <main className="min-h-screen bg-surface px-6 py-20 text-white">
      <section>
        <div className="mx-auto max-w-5xl">
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-muted">
            Red Rocks Essentials
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight md:text-6xl">
            Red Rocks FAQ
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-soft">
            Pickup timing, return rides, what to bring, cancellation rules, and the questions people usually ask first.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/book" className="btn-primary">
              Book a Ride
            </Link>
            <Link href={buildBookingHref({ target: "shared", venue: "red-rocks-amphitheatre", searchParams: sp })} className="btn-ghost">
              Book Shuttle Seats
            </Link>
            <Link href={buildBookingHref({ target: "private-option", venue: "red-rocks-amphitheatre", option: "suv", searchParams: sp })} className="btn-ghost">
              Private SUV
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-soft bg-surface-strong p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              Quick answers
            </h2>

            <div className="mt-5 grid gap-4">
              <FAQ
                q="How does pickup work?"
                a="You pick your ride (shuttle seats or private). After booking, you’ll receive confirmation details and the pickup instructions. For shuttle seats, pickups are in defined windows. For private, timing is flexible."
              />
              <FAQ
                q="What happens after the show?"
                a="We run a real return plan. Shuttle: meet point + departure cadence. Private: your driver coordinates a clean pickup and return after the encore."
              />
              <FAQ
                q="Can I cancel?"
                a="Yes — cancel up to 3 days in advance. After that, bookings are non-cancellable."
              />
              <FAQ
                q="We’re known for Suburbans — why?"
                a="Because it’s the cleanest experience: door-to-door, no strangers, premium timing, and an easier post-show exit."
              />
              <FAQ
                q="What should I bring?"
                a="Plan for temperature swings. A light layer for after sunset is smart. Closed-toe shoes help on rocky paths. Empty water bottle (under venue size rules) is a win."
              />
              <FAQ
                q="Is the shuttle worth it?"
                a="If you want the best value: yes. Fixed pricing, pro driver, no parking stress, and a reliable return plan."
              />
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/book" className="btn-primary">
                Book a Ride
              </Link>
              <Link href={buildBookingHref({ target: "shared", venue: "red-rocks-amphitheatre", searchParams: sp })} className="btn-ghost">
                Book Shuttle Seats
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
