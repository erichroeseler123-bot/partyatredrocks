const API_KEY = process.env.LASTFM_API_KEY;

export async function getArtistInfo(artistName: string) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${API_KEY}&format=json`;
  
  const res = await fetch(url, { next: { revalidate: 86400 } }); // Cache for 24 hours
  if (!res.ok) return null;
  
  const data = await res.json();
  return {
    bio: data.artist?.bio?.summary?.split('<a href')[0] || "No bio available for this artist.",
    image: data.artist?.image?.[3]?.['#text'] || null,
    tags: data.artist?.tags?.tag?.map((t: any) => t.name).slice(0, 3) || []
  };
}
