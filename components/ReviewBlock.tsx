import Link from "next/link";
import { Star } from "lucide-react";

const reviews = [
  {
    quote: "Driver Andy was awesome and the whole ride plan felt dialed from pickup to return.",
    name: "Recent Red Rocks rider",
    source: "Yelp",
    href: "https://www.yelp.com/",
  },
  {
    quote: "The easiest part of the night was getting to and from the venue. Clear instructions and no confusion after the show.",
    name: "Concert group booking",
    source: "Tripadvisor",
    href: "https://www.tripadvisor.com/",
  },
  {
    quote: "We booked for a group and everything stayed simple. One plan in, one plan out, and no scrambling at close.",
    name: "Private ride customer",
    source: "Google Reviews",
    href: "https://www.google.com/search?q=party+at+red+rocks+reviews",
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
        Review Signals
      </div>
      <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">
        Real riders, not generic booking copy.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
        Keep this block small and human. A few real quotes do more for credibility than another wall of features.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {reviews.map((review) => (
          <article
            key={`${review.source}-${review.name}`}
            className="rounded-[24px] border border-white/10 bg-[#0b1224] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
          >
            <div className="flex items-center gap-1">{stars()}</div>
            <p className="mt-4 text-sm leading-6 text-white/78">&ldquo;{review.quote}&rdquo;</p>
            <div className="mt-4 text-sm font-bold text-white">{review.name}</div>
            <Link
              href={review.href}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex text-xs font-black uppercase tracking-[0.16em] text-[#8fd0ff] hover:text-white"
            >
              {review.source}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
