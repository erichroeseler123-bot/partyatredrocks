export type SeatGeekEvent = {
  id: number;
  title: string;
  datetime_local: string;
  url: string;
  performers?: {
    name: string;
    image?: string;
  }[];
};

const BASE_URL = "https://api.seatgeek.com/2/events";

export async function fetchSeatGeekEventsByVenue(
  venueId: number
): Promise<SeatGeekEvent[]> {
  const clientId = process.env.SEATGEEK_CLIENT_ID;
  if (!clientId) return [];

  const now = new Date();
  const future = new Date();
  future.setDate(now.getDate() + 90);

  const url =
    `${BASE_URL}?venue.id=${venueId}` +
    `&datetime_local.gte=${now.toISOString()}` +
    `&datetime_local.lte=${future.toISOString()}` +
    `&sort=datetime_local.asc` +
    `&per_page=50` +
    `&client_id=${clientId}`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return [];

  const data = await res.json();
  return data.events ?? [];
}
