const CLIENT_ID = process.env.SEATGEEK_CLIENT_ID;
const BASE_URL = 'https://api.seatgeek.com/2';

export async function getEvents() {
  // Hardcoded to Red Rocks (196) so Mishawaka never shows up
  const res = await fetch(`${BASE_URL}/events?venue.id=196&client_id=${CLIENT_ID}&per_page=50`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.events;
}

export async function getEvent(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/events/${id}?client_id=${CLIENT_ID}`);
    if (!res.ok) return null;
    const show = await res.json();
    
    // Safety check: If for some reason the ID leads to a non-Red Rocks venue, kill it
    if (show.venue.id !== 196) return null;
    
    return show;
  } catch (e) {
    return null;
  }
}
