export const VENUES = [
  { name: "Red Rocks Amphitheatre", slug: "red-rocks-amphitheatre", id: "1220" },
  { name: "Mission Ballroom", slug: "mission-ballroom", id: "428753" },
  { name: "Fiddler's Green Amphitheatre", slug: "fiddlers-green-amphitheatre", id: "1221" },
  { name: "Fillmore Auditorium", slug: "fillmore-auditorium", id: "424" },
  { name: "Ogden Theatre", slug: "ogden-theatre", id: "422" },
  { name: "Bluebird Theater", slug: "bluebird-theater", id: "423" },
  { name: "Gothic Theatre", slug: "gothic-theatre", id: "1218" },
  { name: "Summit Denver", slug: "summit-denver", id: "14757" },
  { name: "Cervantes' Masterpiece", slug: "cervantes-masterpiece", id: "10094" },
  { name: "Dillon Amphitheater", slug: "dillon-amphitheater", id: "341857" },
  { name: "Gerald R. Ford Amphitheater", slug: "vail-amp", id: "2795" }, 
  { name: "Mishawaka Amphitheatre", slug: "mishawaka-amphitheatre", id: "1864" },
] as const;

export const VENUE_SLUGS = VENUES.map(v => v.slug);

export type VenueSlug = (typeof VENUES)[number]["slug"];
