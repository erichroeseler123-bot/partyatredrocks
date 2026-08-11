import Link from "next/link";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";

export const metadata = {
  title: "Post-Show Pickup Strategy (Red Rocks)",
  description:
    "Where to meet, how to plan pickup, and how to reduce confusion after the encore.",
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
          <span className="text-faint">/</span> Post-Show Pickup
        </nav>

        <h1 className="mt-4 text-5xl font-black tracking-tight">Post-Show Pickup</h1>
        <p className="mt-4 text-lg text-soft">
          Red Rocks has controlled traffic flow and large post-show crowds. A clear pickup plan matters more here than at a typical city venue.
        </p>

        <section className="mt-10 grid gap-6">
          <div className="panel rounded-2xl p-6">
            <h3 className="text-xl font-bold">Plan before the encore</h3>
            <p className="mt-2 text-soft">
              Know who you are riding with, where you will regroup, and what the fallback plan is before the venue starts emptying.
            </p>
          </div>

          <div className="panel rounded-2xl p-6">
            <h3 className="text-xl font-bold">Meeting points</h3>
            <p className="mt-2 text-soft">
              Pick a specific landmark and communicate it. “I’m by the stairs” is not a plan.
            </p>
          </div>

          <div className="panel rounded-2xl p-6">
            <h3 className="text-xl font-bold">Don’t rely on cell service</h3>
            <p className="mt-2 text-soft">
              Crowds can strain networks. Agree on a fallback plan before the encore ends.
            </p>
          </div>
        </section>

        <div className="mt-12">
          <Link href={buildBookingHref({ target: "private", venue: "red-rocks-amphitheatre", searchParams: sp })} className="btn-primary">
            Pre-arrange the return — Book Private Ride →
          </Link>
        </div>
      </div>
    </main>
  );
}
