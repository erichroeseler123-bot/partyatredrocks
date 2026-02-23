export const VENUE_SLUGS = [
  "red-rocks-amphitheatre",
  "mishawaka-amphitheatre",
] as const;

export type VenueSlug = (typeof VENUE_SLUGS)[number];
