import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { venueImage } from "@/lib/display";
import { getServedVenueGroups } from "@/lib/servedVenues";
import { buildBookingHref, type HandoffSearchParams } from "@/lib/parrHandoff";

type Props = {
  mode: "book" | "venues";
  searchParams?: HandoffSearchParams;
};

function venueHref(
  slug: string,
  mode: "book" | "venues",
  searchParams?: HandoffSearchParams,
) {
  if (mode === "book") return buildBookingHref({ target: "venue", venue: slug, searchParams });
  return `/venues/${slug}`;
}

function venueCta(mode: "book" | "venues") {
  return mode === "book" ? "Choose venue" : "Venue Details";
}

function kindLabel(kind?: string) {
  return (kind || "venue").replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
}

export default function ServedVenueSections({ mode, searchParams }: Props) {
  const groups = getServedVenueGroups();

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section
          key={group.title}
          className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,26,0.96),rgba(6,9,18,0.96))] p-6 sm:p-8"
        >
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            {group.title}
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/68">{group.description}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {group.venues.map((venue) => (
              <Link
                key={venue.slug}
                href={venueHref(venue.slug, mode, searchParams)}
                className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-[#0b1224] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
              >
                <img
                  src={venueImage(venue.slug)}
                  alt={venue.name}
                  className="absolute inset-0 h-full w-full object-cover opacity-20 transition duration-500 group-hover:scale-105 group-hover:opacity-28"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,18,0.14),rgba(5,8,18,0.8)_78%,rgba(5,8,18,0.94)_100%)]" />
                <div className="relative z-10">
                  <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
                    {kindLabel(venue.kind)}
                  </div>
                  <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">
                    {venue.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    {[venue.city, venue.state].filter(Boolean).join(", ")}
                  </p>
                  <div className="mt-5 inline-flex items-center text-sm font-bold text-[#ffb07c]">
                    {venueCta(mode)} <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
