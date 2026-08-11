import Link from "next/link";

const PRIVATE_HREF = "/book/red-rocks-amphitheatre/private";

export const metadata = {
  title: "Is Private Red Rocks Transportation Worth It?",
  description:
    "Compare private Red Rocks transportation with driving and rideshare. Party at Red Rocks currently offers private Suburban and van service, not shared shuttle seats.",
  alternates: { canonical: "/red-rocks/transportation/is-shuttle-worth-it" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-surface px-6 py-24 text-white">
      <div className="mx-auto max-w-4xl">
        <nav className="text-sm text-muted">
          <Link className="hover:text-white" href="/red-rocks/transportation">
            Transportation
          </Link>{" "}
          <span className="text-faint">/</span> Is Private Transportation Worth It?
        </nav>

        <h1 className="mt-4 text-5xl font-black tracking-tight">
          Is Private Red Rocks Transportation Worth It?
        </h1>
        <p className="mt-4 text-lg text-soft">
          If you are comparing a planned ride with driving, parking, or trying to find a rideshare after the show,
          private transportation buys your group a fixed plan for the entire night. Party at Red Rocks currently
          offers private rides only — no shared shuttle seats.
        </p>

        <section className="mt-10 grid gap-6">
          <div className="panel rounded-2xl p-6">
            <h2 className="text-xl font-bold">Worth it when your group wants one plan</h2>
            <p className="mt-2 text-soft">
              Your group rides together, gets door-to-door service, and has a vehicle waiting through the show so
              the return trip is already solved before the encore ends.
            </p>
          </div>
          <div className="panel rounded-2xl p-6">
            <h2 className="text-xl font-bold">Current private ride pricing</h2>
            <p className="mt-2 text-soft">
              Private Suburban service is $399. The private van upgrade is $599. Choose based on your group size
              and vehicle preference.
            </p>
          </div>
          <div className="panel rounded-2xl p-6">
            <h2 className="text-xl font-bold">When driving may make more sense</h2>
            <p className="mt-2 text-soft">
              If your group already has a designated driver, is comfortable with Red Rocks parking and exit traffic,
              and does not need a vehicle waiting through the concert, driving yourself may be the simpler choice.
            </p>
          </div>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href={PRIVATE_HREF} className="btn-primary">
            See Private Ride Options
          </Link>
          <Link href="/red-rocks/transportation" className="btn-ghost">
            Compare Transportation Options
          </Link>
        </div>
      </div>
    </main>
  );
}
