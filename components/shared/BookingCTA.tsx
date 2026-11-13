import Link from "next/link";

export default function BookingCTA({ text = "Book Private Red Rocks Transportation" }) {
  return (
    <div className="mx-auto max-w-7xl px-6 my-12">
      <div className="rounded-3xl border border-soft pill p-8 text-center shadow-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <Link
          href="/book/red-rocks-amphitheatre/private/suv"
          className="btn-primary"
        >
          {text}
        </Link>
        <div className="mt-3 text-sm text-soft">
          Private vehicle availability changes on sold-out shows. Lock in your ride plan now.
        </div>
        <div className="mt-4 text-xs text-soft">
          <a
            href="https://destinationcommandcenter.com/red-rocks?source=partyatredrocks&intent=red-rocks-concert-planning"
            className="underline underline-offset-4 hover:text-white transition"
          >
            Need concert-night timing, weather, and exit guidance? Plan your whole night on DCC →
          </a>
        </div>
      </div>
    </div>
  );
}
