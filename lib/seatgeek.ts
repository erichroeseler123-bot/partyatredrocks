export interface SeatGeekEvent {
  id: number;
  title: string;
  datetime_local: string;
  url: string;
  performers: any[];
  venue: any;
}

const CLIENT_ID = process.env.SEATGEEK_CLIENT_ID;

export async function getVenueEvents(venueId: number): Promise<SeatGeekEvent[]> {
  const url = `https://api.seatgeek.com/2/events?venue.id=${venueId}&per_page=50&client_id=${CLIENT_ID}`;
  const res = await fetch(url, { cache: 'force-cache', next: { revalidate: 3600 } });
  const data = await res.json();
  return data.events || [];
}

export async function getEvent(id: string): Promise<SeatGeekEvent | null> {
  const url = `https://api.seatgeek.com/2/events/${id}?client_id=${CLIENT_ID}`;
  const res = await fetch(url, { cache: 'force-cache', next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return await res.json();
}

export async function getArtistShows(artistSlug: string): Promise<SeatGeekEvent[]> {
  const url = `https://api.seatgeek.com/2/events?performers.slug=${artistSlug}&per_page=10&client_id=${CLIENT_ID}`;
  const res = await fetch(url, { cache: 'force-cache', next: { revalidate: 3600 } });
  const data = await res.json();
  return data.events || [];
}
