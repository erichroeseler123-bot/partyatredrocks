export interface SeatGeekEvent {
  id: number;
  title: string;
  datetime_local: string;
  url: string;
  performers: any[];
  venue: any;
}

const CLIENT_ID = process.env.SEATGEEK_CLIENT_ID;

export async function getVenueEvents(venueId: string): Promise<SeatGeekEvent[]> {
  const url = `https://api.seatgeek.com/2/events?venue.id=${venueId}&client_id=${CLIENT_ID}&per_page=15&sort=datetime_local.asc`;
  const res = await fetch(url, { cache: 'no-store' });
  const data = await res.json();
  return data.events || [];
}

export async function getEvent(id: string): Promise<SeatGeekEvent | null> {
  const url = `https://api.seatgeek.com/2/events/${id}?client_id=${CLIENT_ID}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return null;
  return await res.json();
}

export async function getArtistShows(artistSlug: string): Promise<SeatGeekEvent[]> {
  const url = `https://api.seatgeek.com/2/events?performers.slug=${artistSlug}&client_id=${CLIENT_ID}&per_page=10&sort=datetime_local.asc`;
  const res = await fetch(url, { cache: 'no-store' });
  const data = await res.json();
  return data.events || [];
}
