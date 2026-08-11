import Link from "next/link";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";

export const metadata = {
  title: "Red Rocks FAQ | Party at Red Rocks",
  description:
    "Everything people actually need: private pickup timing, return plan, what to bring, cancellation rules, and common Red Rocks transportation questions.",
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
  const privateHref = buildBookingHref({
    target: "private",
    venue: "red-rocks-amphitheatre",
    searchParams: sp,
  });
  const suvHref = buildBookingHref({
    target: "private-option",
    venue: "red-rocks-amphitheatre",
    option: "suv",
    searchParams: sp,
  });

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
            Private pickup timing, your return ride, what to bring, cancellation rules, and the questions people usually ask first.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={privateHref} className="btn-primary">
              Book Private Ride
            </Link>
            <Link href={suvHref} className="btn-ghost">
              Private Suburban — $399
            </Link>
            <Link href="/book/red-rocks-amphitheatre/private/van" className="btn-ghost">
              Private Van — $599
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
                a="Choose your private Suburban or van and complete your reservation. Your ride is door-to-door, and pickup details are confirmed for your group before show night."
              />
              <FAQ
                q="What happens after the show?"
                a="Your private vehicle waits through the show, so your group already has a return plan instead of searching for a new ride after the encore."
              />
              <FAQ
                q="Can I cancel?"
                a="Yes — cancel up to 3 days in advance. After that, bookings are non-cancellable."
              />
              <FAQ
                q="Why a private Suburban?"
                a="It keeps the night simple: door-to-door service, no shared passengers, one vehicle for your group, and a planned ride home after the show."
              />
              <FAQ
                q="What should I bring?"
                a="Plan for temperature swings. A light layer for after sunset is smart. Closed-toe shoes help on rocky paths. Check current venue rules before you go."
              />
              <FAQ
                q="What does private Red Rocks transportation cost?"
                a="Party at Red Rocks currently offers a private Suburban for $399 and a private van for $599."
              />
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href={privateHref} className="btn-primary">
                Book Private Ride
              </Link>
              <Link href="/red-rocks/transportation" className="btn-ghost">
                Transportation Guide
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
