import Link from "next/link";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";

export const metadata = {
  title: "Post-Show Pickup Strategy (Red Rocks)",
  description:
    "Where to meet, best pickup windows, and how to avoid the chaos after the encore.",
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
          Red Rocks has choke points and controlled flow. Pickup works differently than a normal venue.
        </p>

        <section className="mt-10 grid gap-6">
          <div className="panel rounded-2xl p-6">
            <h3 className="text-xl font-bold">Best windows</h3>
            <p className="mt-2 text-soft">
              Leaving immediately can mean gridlock. Waiting 15–25 minutes can make pickup faster and cheaper.
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
              Crowds strain networks. Agree on a fallback plan before the encore ends.
            </p>
          </div>
        </section>

        <div className="mt-12">
          <Link href={buildBookingHref({ target: "book", venue: "red-rocks-amphitheatre", searchParams: sp })} className="btn-primary">
            Guaranteed return — Book the shuttle →
          </Link>
        </div>
      </div>
    </main>
  );
}
