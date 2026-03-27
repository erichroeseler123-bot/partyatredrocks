import { getGuideCardImage } from "@/data/media";

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
    imageSrc: getGuideCardImage("transportation-guide"),
    imageAlt: "Concert riders on a shuttle heading to Red Rocks",
    eyebrow: "Transportation Guide",
  },
  parking: {
    imageSrc: getGuideCardImage("parking-reality"),
    imageAlt: "Red Rocks venue atmosphere at night for parking and arrival planning",
    eyebrow: "Parking Guide",
  },
  pickup: {
    imageSrc: getGuideCardImage("local-pickups"),
    imageAlt: "Private ride meetup and post-show pickup planning for Red Rocks",
    eyebrow: "Pickup Planning",
  },
  policy: {
    imageSrc: getGuideCardImage("policies"),
    imageAlt: "Red Rocks concert guide visual for policies and show-night rules",
    eyebrow: "Policy Guide",
  },
  tailgating: {
    imageSrc: getGuideCardImage("tailgating-guide"),
    imageAlt: "Group transportation and tailgating setup for Red Rocks",
    eyebrow: "Tailgating Guide",
  },
  general: {
    imageSrc: getGuideCardImage("red-rocks-visiting-guide"),
    imageAlt: "Red Rocks guide and logistics planning visual",
    eyebrow: "Guide",
  },
};
