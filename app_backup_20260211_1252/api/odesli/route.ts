import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const spotifyUrl = searchParams.get('url');

  if (!spotifyUrl || spotifyUrl === 'undefined' || spotifyUrl.includes('seatgeek.com')) {
    return NextResponse.json({ error: 'Valid music URL required' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(spotifyUrl)}&userCountry=US`,
      {
        headers: { 'User-Agent': 'PartyAtRedRocks-Bot/1.0 (https://partyatredrocks.com)' },
        next: { revalidate: 3600 } 
      }
    );

    if (!res.ok) return NextResponse.json({ error: `Odesli error: ${res.status}` }, { status: res.status });

    const data = await res.json() as any; // Cast as any to bypass strict property checks
    let youtubeId: string | null = null;
    const ytData = data.linksByPlatform?.youtube;

    if (ytData?.url) {
      const match = ytData.url.match(/v=([^&]+)/);
      youtubeId = match ? match[1] : null;
    }

    // Artist Fallback: Detect if it's an artist link instead of a track link
    if (!youtubeId && data.entity?.type === 'artist') {
      const entities = data.entitiesByUniqueId;
      const artistName = data.entity.title || 
        (entities && Object.values(entities)[0] ? (Object.values(entities)[0] as any).title : null);
      
      if (artistName) {
        return NextResponse.json({ artistName, isArtistFallback: true });
      }
    }

    if (!youtubeId) return NextResponse.json({ error: 'No playable link found' }, { status: 404 });

    return NextResponse.json({ youtubeId });
  } catch (error: any) {
    console.error('Odesli Proxy Error:', error.message);
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 });
  }
}
