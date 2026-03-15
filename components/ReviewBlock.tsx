import Link from "next/link";
import { Star } from "lucide-react";

const GOOGLE_REVIEW_URL = "https://g.page/r/CUj1yszU_RHbEAE/review";

const reviews = [
  {
    title: "Drivers",
    body: "Read recent feedback about timing, communication, and the ride back after the show.",
  },
  {
    title: "Pickup details",
    body: "See what riders say about meetup instructions, departure timing, and post-show pickup.",
  },
  {
    title: "Groups",
    body: "See how riders describe shared shuttle seats, private rides, and group nights at Red Rocks.",
  },
];

function stars() {
  return Array.from({ length: 5 }, (_, idx) => (
    <Star key={idx} className="h-3.5 w-3.5 fill-[#ffb07c] text-[#ffb07c]" />
  ));
}

export function ReviewBlock({ className = "" }: { className?: string }) {
  return (
    <section
      className={[
        "rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,21,38,0.96),rgba(8,12,24,0.96))] p-6 sm:p-8",
        className,
      ].join(" ").trim()}
    >
      <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
        Google Reviews
      </div>
      <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">
        What riders say
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
        Recent feedback from Red Rocks shuttle riders.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-[22px] border border-white/10 bg-[#0b1224] px-5 py-4">
        <div className="flex items-center gap-1">{stars()}</div>
        <div className="text-sm font-bold text-white">Google Reviews</div>
        <div className="text-sm text-white/64">See recent public feedback before you book.</div>
        <Link
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex text-xs font-black uppercase tracking-[0.16em] text-[#8fd0ff] hover:text-white"
        >
          See Google Reviews
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {reviews.map((review) => (
          <article
            key={review.title}
            className="rounded-[24px] border border-white/10 bg-[#0b1224] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
          >
            <div className="flex items-center gap-1">{stars()}</div>
            <div className="mt-4 text-sm font-bold text-white">{review.title}</div>
            <p className="mt-2 text-sm leading-6 text-white/78">{review.body}</p>
            <Link
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex text-xs font-black uppercase tracking-[0.16em] text-[#8fd0ff] hover:text-white"
            >
              Google Reviews
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
