export type SeatGeekEvent = {
  id: number;
  title: string;
  datetime_local: string;
  url: string;
  performers: {
    image?: string | null;
    images?: {
      huge?: string;
    };
  }[];
};

export async function fetchSeatGeekEventsByVenueSlug(
  venueSlug: string
): Promise<{
  id: number;
  title: string;
  datetime: string;
  url: string;
  image: string | null;
}[]> {
  const res = await fetch(
    `https://api.seatgeek.com/2/events?venue.slug=${venueSlug}&sort=datetime_local.asc&per_page=100&client_id=${process.env.SEATGEEK_CLIENT_ID}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    console.error("SeatGeek error", res.status);
    return [];
  }

  const data = await res.json();

  return data.events.map((event: SeatGeekEvent) => ({
    id: event.id,
    title: event.title,
    datetime: event.datetime_local,
    url: event.url,
    image:
      event.performers?.[0]?.images?.huge ??
      event.performers?.[0]?.image ??
      null,
  }));
}
