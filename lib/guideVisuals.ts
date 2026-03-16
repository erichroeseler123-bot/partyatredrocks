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
    imageSrc: "/images/marketing/shuttle.jpg",
    imageAlt: "Concert riders on a shuttle heading to Red Rocks",
    eyebrow: "Transportation Guide",
  },
  parking: {
    imageSrc: "/hero/hero-home.jpg",
    imageAlt: "Red Rocks venue atmosphere at night for parking and arrival planning",
    eyebrow: "Parking Guide",
  },
  pickup: {
    imageSrc: "/images/marketing/vip-suv.jpg",
    imageAlt: "Private ride meetup and post-show pickup planning for Red Rocks",
    eyebrow: "Pickup Planning",
  },
  policy: {
    imageSrc: "/hero/hero-guides.jpg",
    imageAlt: "Red Rocks concert guide visual for policies and show-night rules",
    eyebrow: "Policy Guide",
  },
  tailgating: {
    imageSrc: "/fleet/fleet-sprinter.jpg",
    imageAlt: "Group transportation and tailgating setup for Red Rocks",
    eyebrow: "Tailgating Guide",
  },
  general: {
    imageSrc: "/hero/hero-guides.jpg",
    imageAlt: "Red Rocks guide and logistics planning visual",
    eyebrow: "Guide",
  },
};

