import Link from "next/link";

const SHARED_HREF = "/book/red-rocks-amphitheatre/custom/shared";
const PRIVATE_HREF = "/book/red-rocks-amphitheatre/private";

export const metadata = {
  title: "Is the Red Rocks Shuttle Worth It?",
  description: "What you actually get for the price, when the shuttle is the best move, and when private transport makes more sense.",
  alternates: { canonical: "/red-rocks/transportation/is-shuttle-worth-it" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-surface px-6 py-24 text-white">
      <div className="mx-auto max-w-4xl">
        <nav className="text-sm text-muted">
          <Link className="hover:text-white" href="/red-rocks/transportation">Transportation</Link>{" "}
          <span className="text-faint">/</span> Is the Shuttle Worth It?
        </nav>

        <h1 className="mt-4 text-5xl font-black tracking-tight">Is the Shuttle Worth It?</h1>
        <p className="mt-4 text-lg text-soft">
          If you are asking this, you are usually comparing it against parking stress, surge pricing, or the risk of a messy ride home. For most people, yes, the shuttle is worth it.
        </p>

        <section className="mt-10 grid gap-6">
          <div className="panel rounded-2xl p-6">
            <h2 className="text-xl font-bold">Worth it when you want less friction</h2>
            <p className="mt-2 text-soft">The shuttle removes parking decisions, avoids post-show rideshare chaos, and gives you a real return plan.</p>
          </div>
          <div className="panel rounded-2xl p-6">
            <h2 className="text-xl font-bold">Not the right fit if you need your own vehicle</h2>
            <p className="mt-2 text-soft">If your group wants private timing or one car all night, book the SUV or van instead.</p>
          </div>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href={SHARED_HREF} className="btn-primary">Book $59 Shuttle Seats</Link>
          <Link href={PRIVATE_HREF} className="btn-ghost">See Private Ride Option</Link>
        </div>
      </div>
    </main>
  );
}
