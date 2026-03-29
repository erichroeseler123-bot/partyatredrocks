type MusicBrainzSearchResponse = {
  artists?: {
    id: string;
  }[];
};

export async function fetchArtistMBID(query: string): Promise<string | null> {
  try {
    const searchRes = await fetch(
      `https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(
        query
      )}&fmt=json`,
      {
        headers: {
          "User-Agent": "PartyAtRedRocks/1.0 (hello@partyatredrocks.com)",
        },
      }
    );

    if (!searchRes.ok) return null;

    const searchData = (await searchRes.json()) as MusicBrainzSearchResponse;

    const mbid = searchData.artists?.[0]?.id;
    if (!mbid) return null;

    return mbid;
  } catch {
    return null;
  }
}
