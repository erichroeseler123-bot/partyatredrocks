// data/scenes.ts
export type SceneDef = {
  slug: string;
  title: string;
  tagline: string;          // short hero line
  description: string;      // 150–300 chars (meta + UI)
  seeds: string[];          // matching keywords (keep these specific)
  keywords?: string[];      // extra SEO terms
  featured?: boolean;
  priority?: number;        // lower = earlier
  emoji?: string;
  accentColor?: string;
  ogImage?: string;         // optional per-scene OG image
};

export const SCENES: SceneDef[] = [
  {
    slug: "jam",
    title: "Colorado Jam Scene",
    tagline: "Late encores, mountain drives, multi-night runs.",
    description:
      "Colorado jam + jamgrass intel: upcoming shows, venue guides, and reliable Denver/Boulder/Colorado Springs rides so you get home after the last encore.",
    seeds: [
      // Core jam / jamgrass
      "string cheese incident",
      "umphrey's mcgee",
      "goose",
      "widespread panic",
      "phish",
      "disco biscuits",
      "lotus",
      "railroad earth",
      "leftover salmon",
      "infamous stringdusters",
      "yonder mountain",
      "greensky bluegrass",
      "the motet",
      "andy frasco",

      // Dead-adjacent (SPECIFIC — no generic "dead")
      "grateful dead",
      "dead & company",
      "dead and company",
      "joe russo's almost dead",
      "jrad",
      "dark star orchestra",
      "tedeschi trucks",
    ],
    keywords: [
      "colorado jam bands",
      "jamgrass concerts colorado",
      "denver jam shows",
      "red rocks jam show transportation",
    ],
    featured: true,
    priority: 1,
    emoji: "🎸",
    accentColor: "#00F2FF",
    ogImage: "/og-scene-jam.jpg",
  },

  {
    slug: "edm",
    title: "Colorado EDM + Bass",
    tagline: "Bass nights, late sets, zero-surge rides.",
    description:
      "Front Range electronic feed: upcoming bass, house, techno, and DnB shows—plus venue intel and clean ride options from Denver/Boulder/Colorado Springs.",
    seeds: [
      "illenium",
      "pretty lights",
      "griz",
      "big gigantic",
      "zeds dead",
      "subtronics",
      "rezz",
      "liquid stranger",
      "svdden death",
      "excision",
      "wooli",
      "lsdream",
      "peekaboo",

      // genre terms (keep multiword where possible)
      "drum and bass",
      "drum & bass",
      "dnb",
      "dubstep",
      "tech house",
      "melodic techno",
      "house music",
      "techno",
    ],
    keywords: [
      "denver edm shows",
      "colorado bass music",
      "mission ballroom edm",
      "denver edm shuttle",
    ],
    featured: true,
    priority: 2,
    emoji: "⚡️",
    accentColor: "#FF00AA",
    ogImage: "/og-scene-edm.jpg",
  },

  {
    slug: "hiphop",
    title: "Denver Hip-Hop",
    tagline: "Local heat + touring hitters.",
    description:
      "Denver hip-hop intel: upcoming shows, venue guides, and ride options from RiNo/Denver to the venue and back—no parking stress.",
    seeds: [
      "smino",
      "mick jenkins",
      "wale",
      "bigxthaplug",
      "wiz khalifa",
      "bone thugs",
      // add local seeds as you like:
      "ason yugen",
      "monica the great",
      "old man saxon",
      "trev rich",
    ],
    keywords: [
      "denver hip hop shows",
      "colorado rap concerts",
      "mission ballroom hip hop",
      "denver rap shuttle",
    ],
    featured: false,
    priority: 3,
    emoji: "🎤",
    accentColor: "#FF6600",
    ogImage: "/og-scene-hiphop.jpg",
  },
];
