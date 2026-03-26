import { buildUnsplashImageSrc } from "@/lib/unsplash";
import { BOOKING_COPY } from "@/lib/bookingCopy";

export const bookingVisuals = {
  shared: {
    imageSrc: buildUnsplashImageSrc({ query: "concert riders boarding passenger shuttle van colorado night" }),
    imageAlt: "Passengers boarding a concert shuttle for Red Rocks",
    eyebrow: BOOKING_COPY.labels.sharedBookingEyebrow,
    title: BOOKING_COPY.labels.sharedBookingTitle,
    copy: BOOKING_COPY.copy.sharedRide,
  },
  private: {
    imageSrc: buildUnsplashImageSrc({ query: "black luxury suv concert pickup red rocks night" }),
    imageAlt: "Private SUV transportation for a Red Rocks concert night",
    eyebrow: BOOKING_COPY.labels.privateBookingEyebrow,
    title: BOOKING_COPY.labels.privateBookingTitle,
    copy: BOOKING_COPY.copy.privateRide,
  },
  privateOptions: {
    suv: {
      imageSrc: buildUnsplashImageSrc({ query: "black luxury suv concert pickup denver night" }),
      imageAlt: "Private SUV for Red Rocks transportation",
    },
    van: {
      imageSrc: buildUnsplashImageSrc({ query: "passenger van concert group pickup colorado night" }),
      imageAlt: "Passenger van transportation for Red Rocks groups",
    },
    sprinter: {
      imageSrc: buildUnsplashImageSrc({ query: "sprinter van concert group transport colorado night" }),
      imageAlt: "Sprinter van transportation for larger Red Rocks groups",
    },
    "party-bus": {
      imageSrc: buildUnsplashImageSrc({ query: "party bus group nightlife concert pickup" }),
      imageAlt: "Party bus style group transportation for a concert night",
    },
  },
} as const;
