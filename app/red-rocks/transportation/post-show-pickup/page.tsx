import Link from "next/link";

export const metadata = {
  title: "Post-Show Pickup Strategy (Red Rocks)",
  description:
    "Where to meet, best pickup windows, and how to avoid the chaos after the encore.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-surface text-white px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <nav className="text-sm text-zinc-400">
          <Link className="hover:text-white" href="/red-rocks/transportation">
            Transportation
          </Link>{" "}
          <span className="text-zinc-600">/</span> Post-Show Pickup
        </nav>

        <h1 className="mt-4 text-5xl font-black tracking-tight">Post-Show Pickup</h1>
        <p className="mt-4 text-lg text-zinc-300">
          Red Rocks has choke points and controlled flow. Pickup works differently than a normal venue.
        </p>

        <section className="mt-10 grid gap-6">
          <div className="bg-surface-strong border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold">Best windows</h3>
            <p className="mt-2 text-zinc-300">
              Leaving immediately can mean gridlock. Waiting 15–25 minutes can make pickup faster and cheaper.
            </p>
          </div>

          <div className="bg-surface-strong border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold">Meeting points</h3>
            <p className="mt-2 text-zinc-300">
              Pick a specific landmark and communicate it. “I’m by the stairs” is not a plan.
            </p>
          </div>

          <div className="bg-surface-strong border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold">Don’t rely on cell service</h3>
            <p className="mt-2 text-zinc-300">
              Crowds strain networks. Agree on a fallback plan before the encore ends.
            </p>
          </div>
        </section>

        <div className="mt-12">
          <Link href="/book-shuttle" className="btn-primary">
            Guaranteed return — Book the shuttle →
          </Link>
        </div>
      </div>
    </main>
  );
}
