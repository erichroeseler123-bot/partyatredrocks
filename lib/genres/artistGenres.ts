import type { NormalizedEvent } from "@/lib/events/schema";

const ARTIST_GENRE_TAGS: Record<string, string[]> = {
  odesza: ["edm", "electronic"],
  illenium: ["edm", "electronic"],
  subtronics: ["edm", "dubstep", "bass"],
  excision: ["edm", "dubstep", "bass"],
  rezz: ["edm", "electronic"],
  "zeds dead": ["edm", "electronic", "bass"],
  "widespread panic": ["jam", "jam-band", "psychedelic"],
  phish: ["jam", "jam-band", "psychedelic"],
  goose: ["jam", "jam-band"],
  "string cheese incident": ["jam", "jam-band", "bluegrass"],
  "leftover salmon": ["bluegrass", "jam", "americana"],
  "yonder mountain string band": ["bluegrass", "americana", "jam"],
  "greensky bluegrass": ["bluegrass", "americana"],
  "zach bryan": ["country", "americana"],
  "turnpike troubadours": ["country", "red-dirt", "americana"],
  "ty segall": ["indie", "alternative", "rock"],
  "snail mail": ["indie", "alternative"],
  "the wonder years": ["indie", "alternative", "rock"],
  "thy art is murder": ["metal", "deathcore"],
  sepultura: ["metal", "heavy"],
  melvins: ["metal", "heavy", "rock"],
  "knuckle puck": ["punk", "pop-punk", "emo"],
  "hot mulligan": ["punk", "pop-punk", "emo"],
  "origami angel": ["punk", "emo"],
  "spanish love songs": ["punk", "emo"],
  "bad bunny": ["latin", "reggaeton"],
  "karol g": ["latin", "reggaeton"],
  "j balvin": ["latin", "reggaeton"],
  shakira: ["latin", "latin-pop"],
  ozuna: ["latin", "reggaeton"],
  feid: ["latin", "reggaeton"],
};

const GENRE_KEYWORDS: Record<string, string[]> = {
  metal: ["metal", "heavy", "hard rock", "deathcore", "metalcore", "nu metal", "thrash"],
  hiphop: ["hip hop", "hip-hop", "rap", "trap", "r&b", "rnb"],
  edm: ["edm", "electronic", "dubstep", "bass", "techno", "house", "dnb", "drum and bass"],
  jam: ["jam", "jamtronica", "psychedelic", "improv"],
  bluegrass: ["bluegrass", "americana", "roots", "folk"],
  indie: ["indie", "alternative", "post-punk", "rock"],
  country: ["country", "red dirt", "outlaw country", "americana"],
  reggae: ["reggae", "dub", "world", "afrobeat"],
  punk: ["punk", "post-punk", "hardcore", "emo", "pop punk", "pop-punk", "skate punk"],
  latin: ["latin", "reggaeton", "salsa", "cumbia", "bachata", "tropical", "latin pop", "latin-pop"],
};

const SCENE_ALIASES: Record<string, string[]> = {
  hiphop: ["hip-hop", "hip hop", "rap"],
  punk: ["post-punk", "hardcore", "emo"],
  latin: ["reggaeton", "salsa"],
};

const VENUE_HINTS = [
  "red-rocks-amphitheatre",
  "mission-ballroom",
  "ogden-theatre",
  "gothic-theatre",
  "fillmore-auditorium",
  "bluebird-theater",
  "ball-arena",
  "fiddlers-green-amphitheatre",
  "summit-music-hall",
  "paramount-theatre",
];

function normalize(input: string): string {
  return input.toLowerCase().trim();
}

function tokensForScene(scene: string): string[] {
  const key = normalize(scene);
  const aliases = SCENE_ALIASES[key] ?? [];
  const keywords = GENRE_KEYWORDS[key] ?? [];
  return Array.from(new Set([key, ...aliases, ...keywords]));
}

export function artistMatchesGenre(artistName: string, scene: string): boolean {
  const name = normalize(artistName);
  const tags = ARTIST_GENRE_TAGS[name];
  if (!tags?.length) return false;
  const sceneTokens = tokensForScene(scene);
  return tags.some((tag) => sceneTokens.some((token) => tag.includes(token) || token.includes(tag)));
}

export function eventMatchesGenre(event: NormalizedEvent, scene: string): boolean {
  const text = normalize(`${event.name} ${event.artistNames.join(" ")}`);
  const sceneTokens = tokensForScene(scene);

  const artistTagMatch = event.artistNames.some((artist) => artistMatchesGenre(artist, scene));
  const keywordMatch = sceneTokens.some((token) => text.includes(token));
  const venueBias = VENUE_HINTS.some((slug) => normalize(event.venueId).includes(slug));

  return artistTagMatch || (keywordMatch && venueBias);
}
