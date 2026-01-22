const CLIENT_ID = process.env.SEATGEEK_CLIENT_ID;
const BASE_URL = 'https://api.seatgeek.com/2';

// 1. All Red Rocks Events
export async function getEvents() {
  const res = await fetch(`${BASE_URL}/events?venue.id=196&client_id=${CLIENT_ID}&per_page=50`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.events;
}

// 2. Single Event Detail
export async function getEvent(id: string) {
  const res = await fetch(`${BASE_URL}/events/${id}?client_id=${CLIENT_ID}`);
  if (!res.ok) return null;
  return await res.json();
}

// 3. Artist Specific Shows (Fixes Error #1)
export async function getArtistShows(artistSlug: string) {
  const res = await fetch(`${BASE_URL}/events?performers.slug=${artistSlug}&venue.id=196&client_id=${CLIENT_ID}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.events;
}

// 4. Venue Specific Events (Fixes Error #2 and #3)
export async function getVenueEvents(venueId: string) {
  const res = await fetch(`${BASE_URL}/events?venue.id=${venueId}&client_id=${CLIENT_ID}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.events;
}
