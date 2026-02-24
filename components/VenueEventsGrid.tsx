// components/VenueEventsGrid.tsx
import Link from "next/link";
import { venueImage } from "@/lib/display";

type Props = {
  events: any[];
  venueSlug: string;
};

function fmtDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function VenueEventsGrid({ events, venueSlug }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {events.map((event) => {
        const performerImage =
          event.performers?.find((p: any) => p.image)?.image ?? null;

        const bg = performerImage ?? venueImage(venueSlug);

        const href = `/shows/${event.slug ?? event.id}`;
        const title = event.title ?? "Show";
        const dateLabel = event.datetime_local ? fmtDate(event.datetime_local) : "";

        return (
          <Link
            key={event.id}
            href={href}
            className="group relative h-48 overflow-hidden rounded-2xl border border-soft bg-black transition-all duration-300 hover:-translate-y-1 hover:border-soft hover:shadow-2xl"
          >
            {/* Background image */}
            <img
              src={bg}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover opacity-35 transition-opacity duration-300 group-hover:opacity-45"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
            />

            {/* Readability overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/10" />

            <div className="relative z-10 p-6">
              {dateLabel && (
                <div className="text-xs font-semibold tracking-widest text-white/60 mb-1">
                  {dateLabel}
                </div>
              )}

              <h3 className="text-lg font-black uppercase leading-tight text-white">
                {title}
              </h3>

              {event.performers?.length > 0 && (
                <p className="text-xs text-white/65 mt-1 line-clamp-2">
                  {event.performers.map((p: any) => p.name).join(", ")}
                </p>
              )}

              {/* Subtle affordance */}
              <div className="mt-3 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/55">
                Ride Options <span aria-hidden>→</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
