import Link from "next/link";

export default function ShuttleCTA({
  title = "Ready for Your Red Rocks Show?",
  blurb = "Skip parking and surges—book our $59 round-trip shuttle.",
  href = "/book-shuttle",
  button = "Book Shuttle → $59",
}: {
  title?: string;
  blurb?: string;
  href?: string;
  button?: string;
}) {
  return (
    <div className="my-10 p-6 bg-surface/50 border border-red-600/40 rounded-2xl text-center rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <h3 className="text-2xl font-black text-red-500 mb-3">{title}</h3>
      <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">{blurb}</p>
      <Link
        href={href}
        className="btn-primary"
      >
        {button}
      </Link>
    </div>
  );
}
