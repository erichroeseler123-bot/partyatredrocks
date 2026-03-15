import Link from "next/link";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";

export const metadata = {
  title: "Shuttle vs Uber at Red Rocks",
  description:
    "Cost, reliability, surge pricing, and the best return strategy after the encore.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;
  return (
    <main className="min-h-screen bg-surface text-white px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <nav className="text-sm text-muted">
          <Link className="hover:text-white" href="/red-rocks/transportation">
            Transportation
          </Link>{" "}
          <span className="text-faint">/</span> Shuttle vs Uber
        </nav>

        <h1 className="mt-4 text-5xl font-black tracking-tight">Shuttle vs Uber</h1>
        <p className="mt-4 text-lg text-soft">
          Shuttles are predictable. Rideshares can be fine—or a complete mess—depending on
          surges, queue control, and driver availability.
        </p>

        <section className="mt-10 grid gap-6">
          <div className="panel rounded-2xl p-6">
            <h3 className="text-xl font-bold">Cost</h3>
            <p className="mt-2 text-soft">
              Shuttles are fixed. Rideshares spike post-show and can exceed expectations on
              sold-out nights.
            </p>
          </div>

          <div className="panel rounded-2xl p-6">
            <h3 className="text-xl font-bold">Reliability</h3>
            <p className="mt-2 text-soft">
              Pickup depends on lot control, queue length, and driver availability. Shuttles run
              on schedule.
            </p>
          </div>

          <div className="panel rounded-2xl p-6">
            <h3 className="text-xl font-bold">Best strategy</h3>
            <p className="mt-2 text-soft">
              If you rideshare, leave slightly before the final rush or wait it out. If you shuttle,
              treat it like a reservation.
            </p>
          </div>
        </section>

        <div className="mt-12">
          <Link href={buildBookingHref({ target: "book", venue: "red-rocks-amphitheatre", searchParams: sp })} className="btn-primary">
            Book the $59 shuttle →
          </Link>
        </div>
      </div>
    </main>
  );
}
