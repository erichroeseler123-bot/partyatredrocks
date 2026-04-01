import { curatedImages } from "@/lib/curatedImages";

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
    imageSrc: curatedImages.guideTransportation,
    imageAlt: "Concert riders on a shuttle heading to Red Rocks",
    eyebrow: "Transportation Guide",
  },
  parking: {
    imageSrc: curatedImages.guideParking,
    imageAlt: "Red Rocks venue atmosphere at night for parking and arrival planning",
    eyebrow: "Parking Guide",
  },
  pickup: {
    imageSrc: curatedImages.guidePickup,
    imageAlt: "Private ride meetup and post-show pickup planning for Red Rocks",
    eyebrow: "Pickup Planning",
  },
  policy: {
    imageSrc: curatedImages.guidePolicy,
    imageAlt: "Red Rocks concert guide visual for policies and show-night rules",
    eyebrow: "Policy Guide",
  },
  tailgating: {
    imageSrc: curatedImages.guideTailgating,
    imageAlt: "Group transportation and tailgating setup for Red Rocks",
    eyebrow: "Tailgating Guide",
  },
  general: {
    imageSrc: curatedImages.guideGeneral,
    imageAlt: "Red Rocks guide and logistics planning visual",
    eyebrow: "Guide",
  },
};
