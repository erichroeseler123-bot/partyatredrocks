import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get('artist');
  const apiKey = process.env.SETLIST_FM_API_KEY || process.env.SETLIST_API_KEY;

  if (!artist || !apiKey) {
    return NextResponse.json({ error: 'Missing Required Intelligence' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.setlist.fm/rest/1.0/search/setlists?artistName=${encodeURIComponent(artist)}`,
      {
        headers: {
          'x-api-key': apiKey,
          'Accept': 'application/json'
        }
      }
    );

    if (!res.ok) throw new Error('DCC Access Denied');

    const data = await res.json();
    // Pulls the most recent setlist from the archives
    const songs = data.setlist?.[0]?.sets?.set?.[0]?.song || [];
    return NextResponse.json({ setlist: songs });
  } catch (error) {
    return NextResponse.json({ error: 'Archive Sync Failed' }, { status: 500 });
  }
}
