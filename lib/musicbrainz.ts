export const runtime = "nodejs";

const BASE_URL = "https://musicbrainz.org/ws/2";

type ArtistSearchResponse = {
  artists: {
    id: string;
    name: string;
  }[];
};

type ReleaseGroup = {
  title: string;
  "primary-type"?: string;
};

type ArtistDetailsResponse = {
  "release-groups"?: ReleaseGroup[];
};

export async function fetchMusicBrainzArtist(artistName: string) {
  try {
    const res = await fetch(
      `${BASE_URL}/artist/?query=${encodeURIComponent(artistName)}&fmt=json`,
      {
        headers: {
          "User-Agent": "PartyAtRedRocks/1.0 (hello@partyatredrocks.com)",
        },
        cache: "force-cache",
      }
    );

    if (!res.ok) return null;

    const data = (await res.json()) as ArtistSearchResponse;

    const artist = data.artists?.[0];
    if (!artist) return null;

    const relRes = await fetch(
      `${BASE_URL}/artist/${artist.id}?inc=release-groups&fmt=json`,
      {
        headers: {
          "User-Agent": "PartyAtRedRocks/1.0 (hello@partyatredrocks.com)",
        },
        cache: "force-cache",
      }
    );

    if (!relRes.ok) return { artist, releases: [] };

    const relData = (await relRes.json()) as ArtistDetailsResponse;

    return {
      artist,
      releases: relData["release-groups"] ?? [],
    };
  } catch {
    return null;
  }
}
