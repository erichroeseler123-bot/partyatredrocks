import Link from "next/link";
import { getPlanningLinksForVenue } from "@/lib/parrVenueMap";

type Props = {
  venue: string;
  className?: string;
};

export function PlanningLinks({ venue, className = "" }: Props) {
  const links = getPlanningLinksForVenue(venue);

  if (!links.length) return null;

  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/64 ${className}`.trim()}
    >
      <span>Need planning details?</span>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="font-bold text-[#8fd0ff] transition hover:text-white"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
