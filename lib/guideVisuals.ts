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
    imageAlt: "Red Rocks Park South approach road and sandstone monoliths",
    eyebrow: "Transportation Guide",
  },
  parking: {
    imageSrc: curatedImages.guideParking,
    imageAlt: "Red Rocks Park and Amphitheatre entrance wall and lot approach",
    eyebrow: "Parking Guide",
  },
  pickup: {
    imageSrc: curatedImages.guidePickup,
    imageAlt: "Downtown Denver Union Station pickup corridor for Red Rocks concert nights",
    eyebrow: "Pickup Planning",
  },
  policy: {
    imageSrc: curatedImages.guidePolicy,
    imageAlt: "Red Rocks Park Trading Post Trail signage and concert entry corridor",
    eyebrow: "Policy Guide",
  },
  tailgating: {
    imageSrc: curatedImages.guideTailgating,
    imageAlt: "Historic Red Rocks Trading Post and sandstone pre-show gathering area",
    eyebrow: "Tailgating Guide",
  },
  general: {
    imageSrc: curatedImages.guideGeneral,
    imageAlt: "Wide daytime panorama of Red Rocks Amphitheatre seating rows and stage",
    eyebrow: "Guide",
  },
};
