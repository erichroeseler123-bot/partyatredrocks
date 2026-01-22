import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const spotifyUrl = searchParams.get('url');

  if (!spotifyUrl || spotifyUrl === 'undefined') {
    return NextResponse.json({ error: 'Valid URL required' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(spotifyUrl)}&userCountry=US`,
      {
        headers: { 'User-Agent': 'PartyAtRedRocks-Bot/1.0' }, // Identifies the request to avoid blocks
        next: { revalidate: 3600 } // Caches the result on Vercel for 1 hour to save resources
      }
    );

    if (!res.ok) throw new Error(`Odesli responded with ${res.status}`);

    const data = await res.json();
    
    // Safety check: ensure the platform and URL exist before splitting
    const youtubeUrl = data.linksByPlatform?.youtube?.url;
    const youtubeId = youtubeUrl ? youtubeUrl.split('v=')[1] : null;

    if (!youtubeId) {
      return NextResponse.json({ error: 'No YouTube match found' }, { status: 404 });
    }

    return NextResponse.json({ youtubeId });
  } catch (error: any) {
    console.error("Vercel Function Crash:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
