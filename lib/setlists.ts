const API_KEY = process.env.SETLIST_FM_API_KEY;

export async function getProbableSetlist(artistName: string) {
  const url = `https://api.setlist.fm/rest/1.0/search/setlists?artistName=${encodeURIComponent(artistName)}&p=1`;
  const res = await fetch(url, {
    headers: { 'x-api-key': API_KEY || '', 'Accept': 'application/json' },
    next: { revalidate: 86400 } // Cache for 24 hours
  });
  
  if (!res.ok) return null;
  const data = await res.json();
  return data.setlist?.[0]?.sets?.set?.[0]?.song || [];
}
