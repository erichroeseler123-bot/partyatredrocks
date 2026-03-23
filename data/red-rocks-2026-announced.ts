export type AnnouncedRedRocksShow = {
  id: string;
  dateKey: string;
  name: string;
  headliner: string;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function headlinerFromName(name: string) {
  const split = name
    .split(/\bwith\b|\band\b|\bAnd\b|\bAND\b|\b&\b|,/)
    .map((part) => part.trim())
    .filter(Boolean);
  return split[0] || name;
}

const ANNOUNCED_BY_MONTH: Record<number, string[]> = {
  3: [
    "27: CRANKDAT",
    "28: Ravenscoon & Jantsen",
  ],
  4: [
    "3: INZO",
    "4: it’s murph",
    "5: DAYBREAKER",
    "10: ZINGARA & LEVEL UP",
    "11: Liquid Stranger",
    "15: John Mulaney",
    "16: bbno$ with Oliver Tree",
    "17: Sublime",
    "18: Sublime",
    "19: Wiz Khalifa",
    "20: Ice Cube",
    "21: Ethel Cain",
    "22: Dustin Lynch & Chase Rice",
    "23: Subtronics",
    "24: Subtronics",
    "25: Alesso",
    "26: Bob Moses and Cannons",
    "28: Lewis Capaldi",
    "29: Lewis Capaldi",
    "30: Electric Callboy",
  ],
  5: [
    "1: Two Friends",
    "2: Jason Isbell and the 400 Unit",
    "3: Puscifer",
    "5: David Guetta",
    "6: Bright Eyes",
    "7: Alejandro Fernández",
    "8: ALLEYCVT",
    "9: Cloonee",
    "10: Hippie Sabotage",
    "11: YUNGBLUD",
    "13: Russell Dickerson",
    "16: LSDREAM",
    "17: THE ELOVATERS",
    "18: Khalid",
    "19: Kevin Gates",
    "21: flipturn",
    "22: Seven Lions",
    "23: FISHER",
    "24: Alabama Shakes",
    "25: Alabama Shakes",
    "27: Santana",
    "28: Santana",
    "29: Michael Franti & Spearhead",
    "30: Alan Walker",
  ],
  6: [
    "2: Alex Warren",
    "3: Yo-Yo Ma with the Colorado Symphony",
    "4: Brit Floyd",
    "5: Brit Floyd",
    "6: Big Head Todd and the Monsters",
    "7: Trey Anastasio with Colorado Symphony",
    "9: Jimmy Eat World",
    "10: Lord Huron",
    "11: Jon Bellion",
    "12: Paul Simon",
    "13: Paul Simon",
    "14: Lenny Pearce",
    "14: Trevor Hall, Thievery Corporation, & Dirtwire",
    "15: Rod Stewart",
    "16: Rod Stewart",
    "17: Amyl and The Sniffers",
    "18: THIRD DAY 30th Anniversary",
    "19: Louis Tomlinson",
    "20: O.A.R.",
    "23: Weird Al Yankovic",
    "24: Ziggy Marley & Stephen Marley",
    "25: Dirty Heads",
    "26: Widespread Panic",
    "27: Widespread Panic",
    "28: Widespread Panic",
    "29: AJR",
    "30: AJR",
  ],
  7: [
    "1: Treaty Oak Revival",
    "2: DEADROCKS XII with Zeds Dead",
    "3: DEADROCKS XII with Zeds Dead",
    "4: Blues Traveler",
    "10: The Avett Brothers",
    "11: The Avett Brothers",
    "12: The Avett Brothers",
    "14: KALEO with Elle King",
    "15: The Head And The Heart with the Colorado Symphony",
    "16: The Head And The Heart with the Colorado Symphony",
    "17: The String Cheese Incident",
    "18: The String Cheese Incident",
    "20: Hilary Duff",
    "24: Cross Canadian Ragweed",
    "25: Darius Rucker",
    "28: Sarah McLachlan",
    "29: Parker McCollum",
    "30: Killer Queen",
    "31: Tedeschi Trucks Band",
  ],
  8: [
    "1: Tedeschi Trucks Band",
    "2: Wynonna Judd & Melissa Etheridge with the Colorado Symphony",
    "4: K-Love Live",
    "5: K-Love Live",
    "8: Slightly Stoopid",
    "9: Motionless In White",
    "11: EMPIRE OF THE SUN",
    "13: Mt. Joy",
    "14: Mt. Joy",
    "17: Train",
    "20: Tori Amos",
    "21: Grupo Frontera",
    "22: Reggae on the Rocks",
    "23: Joe Bonamassa",
    "25: Ian Munsick",
    "26: Ray LaMontagne",
    "27: Goose",
    "28: Goose",
  ],
  9: [
    "4: Maná",
    "5: Maná",
    "6: Gregory Alan Isakov",
    "7: Gregory Alan Isakov",
    "8: Five Finger Death Punch",
    "9: Cole Swindell",
    "11: Brandi Carlile",
    "12: Brandi Carlile",
    "13: Brandi Carlile",
    "14: NEEDTOBREATHE",
    "17: Get The Led Out",
    "20: Andrea Bocelli",
    "21: Andrea Bocelli",
    "23: Bleachers",
    "25: The Revivalists",
    "26: Big Gigantic",
  ],
  10: [
    "2: Levity",
    "3: REZZ ROCKS VIII",
    "6: Big Thief",
    "8: Tape B",
    "9: Tape B",
    "12: Rise Against",
    "16: Sammy Virji",
    "18: Matt Rife",
    "19: Zac Brown Band",
    "20: Zac Brown Band",
    "23: Mersiv",
    "25: Stardew Valley",
    "26: Evanescence",
    "27: Tucker Wetmore",
    "28: Koe Wetzel",
    "29: Cypress Hill & Method Man & Redman: Haunted Rocks",
  ],
  11: [
    "14: mike.",
    "15: mike.",
  ],
};

export const ANNOUNCED_RED_ROCKS_2026: AnnouncedRedRocksShow[] = Object.entries(ANNOUNCED_BY_MONTH)
  .flatMap(([monthRaw, lines]) => {
    const month = Number(monthRaw);
    return lines
      .map((line) => {
        const match = line.match(/^(\d{1,2})\s*:\s*(.+)$/);
        if (!match) return null;
        const day = Number(match[1]);
        const name = match[2].trim();
        const dateKey = `2026-${pad(month)}-${pad(day)}`;
        const id = `ann-${dateKey}-${slugify(name).slice(0, 80)}`;

        return {
          id,
          dateKey,
          name,
          headliner: headlinerFromName(name),
        } satisfies AnnouncedRedRocksShow;
      })
      .filter((item): item is AnnouncedRedRocksShow => Boolean(item));
  })
  .sort((a, b) => {
    if (a.dateKey !== b.dateKey) return a.dateKey.localeCompare(b.dateKey);
    return a.name.localeCompare(b.name);
  });
