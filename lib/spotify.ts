// lib/spotify.ts
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

type SpotifyArtistProfile = {
  id: string;
  name: string;
  image: string | null;
  spotifyUrl: string | null;
};

async function getAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });
  const data = await response.json();
  return data.access_token;
}

export async function getArtistProfile(artistName: string): Promise<SpotifyArtistProfile | null> {
  if (!client_id || !client_secret) return null;

  const token = await getAccessToken();
  const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  const artist = data.artists?.items?.[0];
  if (!artist?.id) return null;

  return {
    id: artist.id,
    name: typeof artist.name === 'string' ? artist.name : artistName,
    image: Array.isArray(artist.images) && artist.images[0]?.url ? artist.images[0].url : null,
    spotifyUrl: typeof artist.external_urls?.spotify === 'string' ? artist.external_urls.spotify : null,
  };
}

export async function getArtistId(artistName: string) {
  const profile = await getArtistProfile(artistName);
  return profile?.id || null;
}
