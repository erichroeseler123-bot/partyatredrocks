import { getArtistInfo } from "@/lib/lastfm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get('artist');

  if (!artist) return NextResponse.json({ error: 'Artist required' }, { status: 400 });

  const info = await getArtistInfo(artist);
  return NextResponse.json(info);
}
