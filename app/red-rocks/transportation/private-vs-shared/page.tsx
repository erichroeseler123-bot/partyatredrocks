import Link from "next/link";

const PRIVATE_HREF = "/book/red-rocks-amphitheatre/private";

export const metadata = {
  title: "Private vs Shared Red Rocks Transportation",
  description:
    "Comparing private and shared Red Rocks transportation. Party at Red Rocks currently offers private transportation only: $399 Suburban or $599 van.",
  alternates: { canonical: "/red-rocks/transportation/private-vs-shared" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-surface px-6 py-24 text-white">
      <div className="mx-auto max-w-4xl">
        <nav className="text-sm text-muted">
          <Link className="hover:text-white" href="/red-rocks/transportation">Transportation</Link>{" "}
          <span className="text-faint">/</span> Private vs Shared
        </nav>

        <h1 className="mt-4 text-5xl font-black tracking-tight">Private vs Shared Red Rocks Transportation</h1>
        <p className="mt-4 text-lg text-soft">
          Shared shuttle seats used to be part of the Party at Red Rocks offer. They are not currently sold. Today the service is private transportation for your group: a $399 Suburban or $599 van.
        </p>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="panel rounded-2xl p-6">
            <h2 className="text-xl font-bold">Shared shuttle seats</h2>
            <p className="mt-2 text-soft">
              Not currently offered by Party at Red Rocks. If you are comparing shared service because of price, factor in the tradeoff between a per-seat ride and having one dedicated vehicle for your whole concert night.
            </p>
            <Link href="/red-rocks/transportation" className="btn-ghost mt-6 inline-flex">Compare Transportation</Link>
          </div>
          <div className="panel rounded-2xl p-6">
            <h2 className="text-xl font-bold">Private Suburban or van</h2>
            <p className="mt-2 text-soft">
              Current Party at Red Rocks service: door-to-door for your group, no shared passengers, and the vehicle waits through the show so your return ride is already arranged.
            </p>
            <p className="mt-3 text-soft"><strong className="text-white">Suburban: $399 · Van: $599</strong></p>
            <Link href={PRIVATE_HREF} className="btn-primary mt-6 inline-flex">Book Private Ride</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
