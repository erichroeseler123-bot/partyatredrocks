import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const spotifyUrl = searchParams.get('url');

  if (!spotifyUrl) {
    return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
  }

  try {
    // Vercel handles this fetch server-side, bypassing browser CORS
    const res = await fetch(`https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(spotifyUrl)}&userCountry=US`);
    
    if (!res.ok) throw new Error('Odesli API unreachable');
    
    const data = await res.json();
    const youtubeId = data.linksByPlatform?.youtube?.url?.split('v=')[1];

    return NextResponse.json({ youtubeId });
  } catch (error) {
    console.error("Vercel Function Error:", error);
    return NextResponse.json({ error: 'Server-side Dispatch Failed' }, { status: 500 });
  }
}
