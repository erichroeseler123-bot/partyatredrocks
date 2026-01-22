import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get('artist');
  const API_KEY = process.env.LASTFM_API_KEY;

  if (!artist) return NextResponse.json({ error: 'Missing artist' }, { status: 400 });

  try {
    const res = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${encodeURIComponent(artist)}&api_key=${API_KEY}&format=json&limit=1`
    );
    const data = await res.json();
    const topTrack = data.toptracks?.track?.[0];

    return NextResponse.json({
      artist: topTrack?.artist?.name || artist,
      song: topTrack?.name || ""
    });
  } catch (error) {
    return NextResponse.json({ artist, song: "" });
  }
}
