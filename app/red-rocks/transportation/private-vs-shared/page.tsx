import Link from "next/link";

const SHARED_HREF = "/book/red-rocks-amphitheatre/custom/shared";
const PRIVATE_HREF = "/book/red-rocks-amphitheatre/private";

export const metadata = {
  title: "Private vs Shared Red Rocks Transportation",
  description: "When to book a private SUV or van, when shared shuttle seats are enough, and how to choose the right Red Rocks ride.",
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

        <h1 className="mt-4 text-5xl font-black tracking-tight">Private vs Shared</h1>
        <p className="mt-4 text-lg text-soft">
          Shared is the best value. Private is the cleanest group experience. The right choice depends on how many people you have and how much coordination you want to avoid.
        </p>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="panel rounded-2xl p-6">
            <h2 className="text-xl font-bold">Shared shuttle</h2>
            <p className="mt-2 text-soft">Best for solo riders, couples, and small groups that want fixed pricing and do not need their own vehicle.</p>
            <Link href={SHARED_HREF} className="btn-primary mt-6 inline-flex">Book Shuttle Seats</Link>
          </div>
          <div className="panel rounded-2xl p-6">
            <h2 className="text-xl font-bold">Private SUV or van</h2>
            <p className="mt-2 text-soft">Best for groups that want one pickup plan, one vehicle, and one clean ride home without splitting up.</p>
            <Link href={PRIVATE_HREF} className="btn-ghost mt-6 inline-flex">Book Private Ride</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
