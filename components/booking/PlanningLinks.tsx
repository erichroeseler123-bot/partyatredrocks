import Link from "next/link";
import { DCC_ORIGIN, normalizeVenueSlug } from "@/lib/parrHandoff";
import { getCrossSiteVenue } from "@/lib/crossSiteMap";

type Props = {
  venue: string;
  className?: string;
  source?: string;
  lead?: string;
};

export function PlanningLinks({
  venue,
  className = "",
  source,
  lead,
}: Props) {
  const entry = getCrossSiteVenue(normalizeVenueSlug(venue) || "");
  const links =
    entry?.slug === "red-rocks-amphitheatre"
      ? [
          { label: "Red Rocks Guide", href: `${DCC_ORIGIN}/red-rocks` },
          { label: "Parking Guide", href: `${DCC_ORIGIN}/red-rocks/parking` },
          { label: "Transportation Guide", href: `${DCC_ORIGIN}/red-rocks/transportation` },
        ]
      : entry
        ? [{ label: "Venue Guide", href: entry.dccAuthorityPath }]
        : [];

  if (!links.length) return null;

  const helperLead =
    lead || (source === "dcc" ? "Ready to book your ride?" : "Need planning details?");

  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/64 ${className}`.trim()}
    >
      <span>{helperLead}</span>
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
