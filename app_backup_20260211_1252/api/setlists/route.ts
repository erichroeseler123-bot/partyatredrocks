import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get('artist');
  const apiKey = process.env.SETLIST_FM_API_KEY;

  if (!artist) return NextResponse.json({ error: 'Artist required' }, { status: 400 });

  const res = await fetch(`https://api.setlist.fm/rest/1.0/search/setlists?artistName=${encodeURIComponent(artist)}`, {
    headers: { 'x-api-key': apiKey!, 'Accept': 'application/json' }
  });

  const data = await res.json();
  const songs = data.setlist?.[0]?.sets?.set?.[0]?.song?.map((s: any) => s.name) || [];
  
  return NextResponse.json({ songs });
}
