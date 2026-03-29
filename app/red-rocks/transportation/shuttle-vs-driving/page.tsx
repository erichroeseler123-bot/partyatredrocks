import Link from "next/link";

const SHARED_HREF = "/book/red-rocks-amphitheatre/custom/shared";
const PRIVATE_HREF = "/book/red-rocks-amphitheatre/private";

export const metadata = {
  title: "Shuttle vs Driving at Red Rocks",
  description: "Parking, post-show exits, cost, and when it makes more sense to book a shuttle instead of driving.",
  alternates: { canonical: "/red-rocks/transportation/shuttle-vs-driving" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-surface px-6 py-24 text-white">
      <div className="mx-auto max-w-4xl">
        <nav className="text-sm text-muted">
          <Link className="hover:text-white" href="/red-rocks/transportation">Transportation</Link>{" "}
          <span className="text-faint">/</span> Shuttle vs Driving
        </nav>

        <h1 className="mt-4 text-5xl font-black tracking-tight">Shuttle vs Driving</h1>
        <p className="mt-4 text-lg text-soft">
          Driving can look cheaper until you count parking-lot stress, post-show traffic, and the fact that someone in your group has to handle the whole ride home.
        </p>

        <section className="mt-10 grid gap-6">
          <div className="panel rounded-2xl p-6">
            <h2 className="text-xl font-bold">Driving wins if you want total control</h2>
            <p className="mt-2 text-soft">If your group insists on its own timing and does not mind parking, stairs, and the exit queue, driving can work.</p>
          </div>
          <div className="panel rounded-2xl p-6">
            <h2 className="text-xl font-bold">The shuttle wins if you want the cleaner night</h2>
            <p className="mt-2 text-soft">Fixed pricing, no lot strategy, no one stuck driving, and a real ride home after the show.</p>
          </div>
          <div className="panel rounded-2xl p-6">
            <h2 className="text-xl font-bold">Best move</h2>
            <p className="mt-2 text-soft">If you are comparing because you want less friction, book the shuttle. If you need one vehicle for a full group, book the private ride.</p>
          </div>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href={SHARED_HREF} className="btn-primary">Book $59 Shuttle Seats</Link>
          <Link href={PRIVATE_HREF} className="btn-ghost">Book Private Ride</Link>
        </div>
      </div>
    </main>
  );
}
