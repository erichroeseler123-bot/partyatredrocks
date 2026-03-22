export type SocialPlatform =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "x"
  | "youtube"
  | "linkedin"
  | "threads"
  | "spotify";

export type SocialStatus = "live" | "planned" | "hidden";

export type SocialLink = {
  platform: SocialPlatform;
  url: string;
  handle?: string;
  active?: boolean;
  primary?: boolean;
  status?: SocialStatus;
};

export type BrandSocialProfile = {
  brandKey: string;
  brandName: string;
  mode?: "brand" | "inherit-dcc" | "mixed";
  sameAs?: string[];
  socials: SocialLink[];
  shareDefaults?: {
    xHandle?: string;
    hashtags?: string[];
  };
};

export const socialRegistry: Record<string, BrandSocialProfile> = {
  dcc: {
    brandKey: "dcc",
    brandName: "Destination Command Center",
    mode: "brand",
    sameAs: [],
    socials: [],
    shareDefaults: {
      hashtags: ["DestinationCommandCenter", "TravelPlanning", "TravelIntel"],
    },
  },
  partyatredrocks: {
    brandKey: "partyatredrocks",
    brandName: "Party At Red Rocks",
    mode: "brand",
    sameAs: [
      "https://www.instagram.com/partyatredrocks",
      "https://www.facebook.com/redrockstransportation/",
      "https://x.com/partyatredrocks",
    ],
    socials: [
      {
        platform: "instagram",
        url: "https://www.instagram.com/partyatredrocks",
        handle: "@partyatredrocks",
        active: true,
        primary: true,
        status: "live",
      },
      {
        platform: "facebook",
        url: "https://www.facebook.com/redrockstransportation/",
        active: true,
        status: "live",
      },
      {
        platform: "x",
        url: "https://x.com/partyatredrocks",
        handle: "@partyatredrocks",
        active: true,
        status: "live",
      },
    ],
    shareDefaults: {
      xHandle: "@partyatredrocks",
      hashtags: ["RedRocks", "DenverConcerts", "ColoradoNightlife"],
    },
  },
  wta: {
    brandKey: "wta",
    brandName: "Welcome to Alaska Tours",
    mode: "inherit-dcc",
    sameAs: [],
    socials: [],
    shareDefaults: {
      hashtags: ["AlaskaTravel", "AlaskaTours", "CruiseExcursions"],
    },
  },
};
