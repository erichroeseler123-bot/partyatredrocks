import { buildUnsplashImageSrc } from "@/lib/unsplash";

export const bookingVisuals = {
  shared: {
    imageSrc: buildUnsplashImageSrc({ query: "concert shuttle passengers denver night" }),
    imageAlt: "Passengers boarding a concert shuttle for Red Rocks",
    eyebrow: "Per-Person Shuttle",
    title: "Book Shuttle Seats",
    copy: "Shared round-trip shuttle seats from Denver and Golden with one clear ride plan for show night.",
  },
  private: {
    imageSrc: buildUnsplashImageSrc({ query: "private suv concert transportation denver" }),
    imageAlt: "Private SUV transportation for a Red Rocks concert night",
    eyebrow: "Private Ride",
    title: "Choose Your Private Vehicle",
    copy: "Private Red Rocks transportation for groups that want one vehicle, one pickup plan, and a cleaner night.",
  },
  privateOptions: {
    suv: {
      imageSrc: buildUnsplashImageSrc({ query: "private suv concert transportation" }),
      imageAlt: "Private SUV for Red Rocks transportation",
    },
    van: {
      imageSrc: buildUnsplashImageSrc({ query: "passenger van concert transportation" }),
      imageAlt: "Passenger van transportation for Red Rocks groups",
    },
    sprinter: {
      imageSrc: buildUnsplashImageSrc({ query: "sprinter van concert transportation" }),
      imageAlt: "Sprinter van transportation for larger Red Rocks groups",
    },
    "party-bus": {
      imageSrc: buildUnsplashImageSrc({ query: "party bus concert group transportation" }),
      imageAlt: "Party bus style group transportation for a concert night",
    },
  },
} as const;
