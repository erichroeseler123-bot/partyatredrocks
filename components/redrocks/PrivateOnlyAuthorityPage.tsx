import Link from "next/link";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";

type Props = {
  eyebrow: string;
  title: string;
  intro: string;
  points: Array<{ title: string; body: string }>;
  searchParams: HandoffSearchParams;
};

export function PrivateOnlyAuthorityPage({ eyebrow, title, intro, points, searchParams }: Props) {
  const bookingHref = buildBookingHref({
    target: "book",
    venue: "red-rocks-amphitheatre",
    searchParams,
  });

  return (
    <main className="min-h-screen bg-surface px-6 py-24 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-muted">{eyebrow}</p>
        <h1 className="mt-4 text-5xl font-black tracking-tight">{title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-soft">{intro}</p>

        <div className="mt-8 rounded-3xl border border-soft bg-surface-strong p-6 md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-muted">Current Party at Red Rocks service</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">Private transportation only</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-soft">
            Party at Red Rocks currently offers private transportation: a private Suburban for $399 or a private van for $599. There are no shared shuttle seats. Your group gets one vehicle, one pickup plan, and the vehicle waits through the show for the return ride.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={bookingHref} className="btn-primary">Book Private Ride</Link>
            <Link href="/red-rocks/transportation" className="btn-ghost">Transportation Guide</Link>
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {points.map((point) => (
            <article key={point.title} className="rounded-3xl border border-soft bg-surface-strong p-6">
              <h2 className="text-xl font-black tracking-tight">{point.title}</h2>
              <p className="mt-3 leading-relaxed text-soft">{point.body}</p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
