import Link from "next/link";

export default function ShuttleCTA({
  title = "Ready for Your Red Rocks Show?",
  blurb = "Skip parking and surges—book private transportation: $518.96 total Suburban ($499.00 base + $19.96 Booking fee (4%)) or $726.96 total Van ($699.00 base + $27.96 Booking fee (4%)). Your complete total is shown before payment.",
  href = "/book/red-rocks-amphitheatre/private",
  button = "Book Private Ride — $518.96 Suburban / $726.96 Van Total",
}: {
  title?: string;
  blurb?: string;
  href?: string;
  button?: string;
}) {
  return (
    <div className="my-10 p-6 bg-surface/50 border border-red-600/40 rounded-2xl text-center rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <h3 className="text-2xl font-black text-red-500 mb-3">{title}</h3>
      <p className="text-soft mb-6 max-w-2xl mx-auto">{blurb}</p>
      <Link
        href={href}
        className="btn-primary"
      >
        {button}
      </Link>
    </div>
  );
}
