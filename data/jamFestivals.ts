export type JamFestival = {
  slug: string;
  name: string;
  whenText: string;
  whereText: string;
  onsiteCamping: boolean;
  campingTypes: string[];
  notes: string[];
  officialUrl: string;
  bookHref: string;
  lastVerified: string; // YYYY-MM-DD
};

export const JAM_FESTIVALS: JamFestival[] = [
  {
    slug: "beanstalk",
    name: "Beanstalk Music & Mountains",
    whenText: "August (verify exact dates on official site)",
    whereText: "Bond, CO (Rancho Del Rio area)",
    onsiteCamping: true,
    campingTypes: ["Primitive tent camping", "Car camping (varies)", "RV options (if offered)"],
    notes: ["Mountain nights get cold fast — pack real layers.", "Confirm glass/fire rules on the official page."],
    officialUrl: "https://beanstalkfestival.com",
    bookHref: "/book?festival=beanstalk&scene=jam",
    lastVerified: "2026-02-21",
  },
  {
    slug: "winterwondergrass",
    name: "WinterWonderGrass (Steamboat)",
    whenText: "Late Feb / early Mar (verify on official site)",
    whereText: "Steamboat Springs, CO",
    onsiteCamping: false,
    campingTypes: ["Lodging-focused", "Nearby camping varies by season/rules"],
    notes: ["Snow + I-70 fatigue is real — plan your ride early.", "Most attendees book lodging; confirm local options."],
    officialUrl: "https://winterwondergrass.com",
    bookHref: "/book?festival=winterwondergrass&scene=jam",
    lastVerified: "2026-02-21",
  },
];
