import Link from "next/link";
import { Star } from "lucide-react";

const GOOGLE_REVIEW_URL = "https://g.page/r/CUj1yszU_RHbEAE/review";
const featuredQuotes = [
  {
    quote:
      "We never would have been able to experience Red Rocks this on our own. Party at Red Rocks took care of everything.",
    name: "Jean Mundt",
    location: "Eau Claire, WI",
  },
  {
    quote:
      "Simply unforgettable tailgating experience at Red Rocks in the upper north lot. It was the perfect way to kick off an amazing show.",
    name: "Kirsten Gerlach",
    location: "Melbourne, Australia",
  },
  {
    quote:
      "Tailgating at Red Rocks was an unforgettable experience. We let loose amidst the excitement and energy.",
    name: "Lisa Driver",
    location: "Michigan",
  },
];

function stars() {
  return Array.from({ length: 5 }, (_, idx) => (
    <Star key={idx} className="h-3.5 w-3.5 fill-[var(--brand-orange)] text-[var(--brand-orange)]" />
  ));
}

export function ReviewBlock({ className = "" }: { className?: string }) {
  return (
    <section
      className={[
        "brand-panel rounded-[30px] p-6 sm:p-8",
        className,
      ].join(" ").trim()}
    >
      <div className="brand-kicker text-[11px] font-black uppercase tracking-[0.22em]">
        Rider Feedback
      </div>
      <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">
        What riders say
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
        Real rider feedback up front, with the live Google review profile one tap away.
      </p>

      <div className="brand-card mt-5 flex flex-wrap items-center gap-3 rounded-[22px] px-5 py-4">
        <div className="flex items-center gap-1">{stars()}</div>
        <div className="text-sm font-bold text-white">Google Reviews</div>
        <div className="text-sm text-white/64">Check the live Google profile after scanning the rider highlights below.</div>
        <Link
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex text-xs font-black uppercase tracking-[0.16em] text-[var(--brand-cyan)] hover:text-white"
        >
          See Google Reviews
        </Link>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {featuredQuotes.map((item) => (
          <article
            key={item.name}
            className="brand-card rounded-[24px] p-5"
          >
            <div className="flex items-center gap-1">{stars()}</div>
            <p className="mt-4 text-sm leading-6 text-white/82">"{item.quote}"</p>
            <div className="mt-4 text-sm font-black text-white">{item.name}</div>
            <div className="text-xs uppercase tracking-[0.16em] text-white/48">{item.location}</div>
          </article>
        ))}
      </div>

    </section>
  );
}
