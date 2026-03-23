export type MediaSource =
  | "local"
  | "spotify"
  | "ticketmaster"
  | "seatgeek"
  | "unsplash";

export type NodeImageAsset = {
  src: string;
  alt: string;
  source: MediaSource;
};

export type MediaEntityType =
  | "artist"
  | "show"
  | "venue"
  | "scene"
  | "guide"
  | "transport"
  | "marketing";

export type MediaRequest = {
  entityType: MediaEntityType;
  slug: string;
  sourceHints?: Record<string, string | null | undefined>;
};
