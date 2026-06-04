import Link from "next/link";

export default function BookingCTA({ text = "Book Private Suburban — $399–$499" }) {
  return (
    <div className="mx-auto max-w-7xl px-6 my-12">
      <div className="rounded-3xl border border-soft pill p-8 text-center shadow-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <Link
          href="/book-shuttle"
          className="btn-primary"
        >
          {text}
        </Link>
        <div className="mt-3 text-sm text-soft">
          Private vehicle availability tightens on sold-out shows. Lock it in now.
        </div>
      </div>
    </div>
  );
}
