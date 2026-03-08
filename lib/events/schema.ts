export type EventSource = "snapshot" | "seatgeek" | "ticketmaster";

export type NormalizedEvent = {
  id: string;
  source: EventSource;
  sourceId: string | null;
  name: string;
  startAt: string | null;
  startLocal: string | null;
  venueId: string;
  headliners: string[];
  artists: string[];
  artistNames: string[];
  image: string | null;
  ticketUrl: string | null;
  dateKey: string;
  slug: string;
};

export type NormalizedArtist = {
  id: string;
  name: string;
  eventIds?: string[];
  venueIds?: string[];
  dateKeys?: string[];
  showCount?: number;
  firstDate?: string | null;
  lastDate?: string | null;
  coArtists?: string[];
  spotifyId?: string;
  image?: string | null;
  genreHints?: string[];
  links?: {
    spotify?: string;
    instagram?: string;
    official?: string;
  };
};

export type EventsSnapshot = {
  generatedAt: string;
  year: number;
  events: NormalizedEvent[];
};

export type ArtistsSnapshot = {
  generatedAt: string;
  year: number;
  artists: NormalizedArtist[];
};
