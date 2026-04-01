import { BOOKING_COPY } from "@/lib/bookingCopy";
import { curatedImages } from "@/lib/curatedImages";

export const bookingVisuals = {
  shared: {
    imageSrc: curatedImages.sharedShuttle,
    imageAlt: "Passengers boarding a concert shuttle for Red Rocks",
    eyebrow: BOOKING_COPY.labels.sharedBookingEyebrow,
    title: BOOKING_COPY.labels.sharedBookingTitle,
    copy: BOOKING_COPY.copy.sharedRide,
  },
  private: {
    imageSrc: curatedImages.privateSUV,
    imageAlt: "Private SUV transportation for a Red Rocks concert night",
    eyebrow: BOOKING_COPY.labels.privateBookingEyebrow,
    title: BOOKING_COPY.labels.privateBookingTitle,
    copy: BOOKING_COPY.copy.privateRide,
  },
  privateOptions: {
    suv: {
      imageSrc: curatedImages.privateSUV,
      imageAlt: "Private SUV for Red Rocks transportation",
    },
    van: {
      imageSrc: curatedImages.sprinterVan,
      imageAlt: "Passenger van transportation for Red Rocks groups",
    },
    sprinter: {
      imageSrc: curatedImages.sprinterVan,
      imageAlt: "Sprinter van transportation for larger Red Rocks groups",
    },
    "party-bus": {
      imageSrc: curatedImages.partyBus,
      imageAlt: "Party bus style group transportation for a concert night",
    },
  },
} as const;
