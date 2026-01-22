import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const spotifyUrl = searchParams.get('url');

  if (!spotifyUrl || spotifyUrl === 'undefined' || spotifyUrl.includes('seatgeek.com')) {
    // If SeatGeek sends a non-music link, we return a clean error instead of crashing
    return NextResponse.json({ error: 'Valid music link required' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(spotifyUrl)}&userCountry=US`,
      { headers: { 'User-Agent': 'PartyAtRedRocks-Bot/1.0' } }
    );

    if (!res.ok) return NextResponse.json({ error: 'External API Error' }, { status: res.status });

    const data = await res.json();
    
    // CRITICAL FIX: Check if youtube property exists before accessing its URL
    const youtubeData = data.linksByPlatform?.youtube;
    
    if (!youtubeData || !youtubeData.url) {
      return NextResponse.json({ error: 'No YouTube match' }, { status: 404 });
    }

    const youtubeId = youtubeData.url.split('v=')[1]?.split('&')[0];
    return NextResponse.json({ youtubeId });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Crash' }, { status: 500 });
  }
}
