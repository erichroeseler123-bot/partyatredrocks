const SEATGEEK_CLIENT_ID = process.env.SEATGEEK_CLIENT_ID;

export async function getEvent(id: string) {
  // Fetches the specific event details, including venue and performer info
  const url = `https://api.seatgeek.com/2/events/${id}?client_id=${SEATGEEK_CLIENT_ID}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch event from SeatGeek");
  return res.json();
}

export async function getVenueEvents(venueId: string) {
  const url = `https://api.seatgeek.com/2/events?venue.id=${venueId}&client_id=${SEATGEEK_CLIENT_ID}&per_page=15&sort=datetime_local.asc`;
  const res = await fetch(url);
  const data = await res.json();
  return data.events || [];
}
