import { buildUnsplashImageSrc } from "@/lib/unsplash";

export type GuideVisualKey =
  | "transportation"
  | "parking"
  | "pickup"
  | "policy"
  | "tailgating"
  | "general";

type GuideVisual = {
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
};

export const guideVisuals: Record<GuideVisualKey, GuideVisual> = {
  transportation: {
    imageSrc: buildUnsplashImageSrc({ query: "concert shuttle boarding denver night" }),
    imageAlt: "Concert riders on a shuttle heading to Red Rocks",
    eyebrow: "Transportation Guide",
  },
  parking: {
    imageSrc: buildUnsplashImageSrc({ query: "red rocks amphitheatre arrival parking night" }),
    imageAlt: "Red Rocks venue atmosphere at night for parking and arrival planning",
    eyebrow: "Parking Guide",
  },
  pickup: {
    imageSrc: buildUnsplashImageSrc({ query: "private suv pickup concert night denver" }),
    imageAlt: "Private ride meetup and post-show pickup planning for Red Rocks",
    eyebrow: "Pickup Planning",
  },
  policy: {
    imageSrc: buildUnsplashImageSrc({ query: "concert gate entry planning red rocks" }),
    imageAlt: "Red Rocks concert guide visual for policies and show-night rules",
    eyebrow: "Policy Guide",
  },
  tailgating: {
    imageSrc: buildUnsplashImageSrc({ query: "tailgate group concert transportation red rocks" }),
    imageAlt: "Group transportation and tailgating setup for Red Rocks",
    eyebrow: "Tailgating Guide",
  },
  general: {
    imageSrc: buildUnsplashImageSrc({ query: "red rocks concert planning denver" }),
    imageAlt: "Red Rocks guide and logistics planning visual",
    eyebrow: "Guide",
  },
};
