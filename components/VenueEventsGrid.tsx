type Props = {
  events: any[];
  venueSlug: string;
};

export default function VenueEventsGrid({ events, venueSlug }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {events.map((event) => {
        const performerImage =
          event.performers?.find((p: any) => p.image)?.image ?? null;

        return (
          <a
            key={event.id}
            href={`/shows/${event.slug ?? event.id}`}
            className="relative h-48 rounded-2xl bg-black border border-white/5 overflow-hidden hover:border-white/20 transition hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* IMAGE ONLY IF IT IS A REAL PERFORMER IMAGE */}
            {performerImage && (
              <img
                src={performerImage}
                alt={event.title}
                className="absolute inset-0 h-full w-full object-cover opacity-30"
              />
            )}

            <div className="relative z-10 p-6">
              <div className="text-xs tracking-widest text-zinc-400 mb-1">
                {new Date(event.datetime_local).toLocaleDateString()}
              </div>

              <h3 className="text-lg font-black uppercase leading-tight">
                {event.title}
              </h3>

              {event.performers?.length > 0 && (
                <p className="text-xs text-zinc-400 mt-1">
                  {event.performers.map((p: any) => p.name).join(", ")}
                </p>
              )}
            </div>
          </a>
        );
      })}
    </div>
  );
}
