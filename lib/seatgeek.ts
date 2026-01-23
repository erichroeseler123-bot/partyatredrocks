const CLIENT_ID = process.env.SEATGEEK_CLIENT_ID;
const BASE_URL = 'https://api.seatgeek.com/2';

// 1. All Red Rocks Events
export async function getEvents() {
  const res = await fetch(`${BASE_URL}/events?venue.id=196&client_id=${CLIENT_ID}&per_page=50`);
  const data = await res.json();
  return data.events || [];
}

// 2. Single Event Detail
export async function getEvent(id: string) {
  const res = await fetch(`${BASE_URL}/events/${id}?client_id=${CLIENT_ID}`);
  return res.ok ? await res.json() : null;
}

// 3. Artist Specific Shows
export async function getArtistShows(artistSlug: string) {
  const res = await fetch(`${BASE_URL}/events?performers.slug=${artistSlug}&venue.id=196&client_id=${CLIENT_ID}`);
  const data = await res.json();
  return data.events || [];
}

// 4. Venue Specific Events
export async function getVenueEvents(venueId: string) {
  const res = await fetch(`${BASE_URL}/events?venue.id=${venueId}&client_id=${CLIENT_ID}`);
  const data = await res.json();
  return data.events || [];
}
// Add this to lib/seatgeek.ts
export async function getSetlist(artistName: string) {
  try {
    const res = await fetch(
      `https://api.setlist.fm/rest/1.0/search/setlists?artistName=${encodeURIComponent(artistName)}&p=1`,
      {
        headers: {
          'x-api-key': process.env.SETLIST_API_KEY || '', // You'll need a free key from setlist.fm
          'Accept': 'application/json'
        }
      }
    );
    const data = await res.json();
    return data.setlist?.[0] || null; // Returns the most recent setlist
  } catch (e) {
    return null;
  }
}
