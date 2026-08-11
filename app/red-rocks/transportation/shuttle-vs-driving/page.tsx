import Link from "next/link";

const PRIVATE_HREF = "/book/red-rocks-amphitheatre/private";

export const metadata = {
  title: "Private Ride vs Driving at Red Rocks",
  description:
    "Parking, post-show exits, group logistics, and when it makes more sense to book private Red Rocks transportation instead of driving yourself.",
  alternates: { canonical: "/red-rocks/transportation/shuttle-vs-driving" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-surface px-6 py-24 text-white">
      <div className="mx-auto max-w-4xl">
        <nav className="text-sm text-muted">
          <Link className="hover:text-white" href="/red-rocks/transportation">Transportation</Link>{" "}
          <span className="text-faint">/</span> Private Ride vs Driving
        </nav>

        <h1 className="mt-4 text-5xl font-black tracking-tight">Private Ride vs Driving</h1>
        <p className="mt-4 text-lg text-soft">
          Driving can be the simplest choice when someone in your group wants full control. A private ride removes parking decisions, keeps the group together, and gives you a vehicle waiting for the ride home after the show.
        </p>

        <section className="mt-10 grid gap-6">
          <div className="panel rounded-2xl p-6">
            <h2 className="text-xl font-bold">Driving wins if you want total control</h2>
            <p className="mt-2 text-soft">If your group is comfortable with parking, walking, and the post-show drive, taking your own vehicle can work well.</p>
          </div>
          <div className="panel rounded-2xl p-6">
            <h2 className="text-xl font-bold">Private transportation wins if you want the cleaner night</h2>
            <p className="mt-2 text-soft">Door-to-door service, no shared passengers, no parking strategy to manage, and the same vehicle waiting through the show for your return.</p>
          </div>
          <div className="panel rounded-2xl p-6">
            <h2 className="text-xl font-bold">Current Party at Red Rocks option</h2>
            <p className="mt-2 text-soft">Private Suburban $399 or private van $599. Shared shuttle seats are not currently offered.</p>
          </div>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href={PRIVATE_HREF} className="btn-primary">Book Private Ride</Link>
          <Link href="/red-rocks/parking" className="btn-ghost">See Parking Guide</Link>
        </div>
      </div>
    </main>
  );
}
