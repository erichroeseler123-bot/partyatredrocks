import { BOOKING_COPY } from "@/lib/bookingCopy";
import { curatedImages } from "@/lib/curatedImages";

export const bookingVisuals = {
  shared: {
    imageSrc: curatedImages.sharedShuttle,
    imageAlt: "Red Rocks Amphitheatre sandstone seating bowl and foothills vista",
    eyebrow: BOOKING_COPY.labels.sharedBookingEyebrow,
    title: BOOKING_COPY.labels.sharedBookingTitle,
    copy: BOOKING_COPY.copy.sharedRide,
  },
  private: {
    imageSrc: curatedImages.privateSUV,
    imageAlt: "Illuminated Red Rocks Amphitheatre concert night view above Morrison",
    eyebrow: BOOKING_COPY.labels.privateBookingEyebrow,
    title: BOOKING_COPY.labels.privateBookingTitle,
    copy: BOOKING_COPY.copy.privateRide,
  },
  privateOptions: {
    suv: {
      imageSrc: "/fleet/fleet-suburban.jpg",
      imageAlt: "Full-size Chevrolet Suburban SUV for private Red Rocks group transportation",
    },
    van: {
      imageSrc: curatedImages.sprinterVan,
      imageAlt: "Red Rocks Amphitheatre seating bowl for private 10-passenger group van rides",
    },
    sprinter: {
      imageSrc: curatedImages.sprinterVan,
      imageAlt: "Red Rocks Amphitheatre group van transportation",
    },
    "party-bus": {
      imageSrc: curatedImages.partyBus,
      imageAlt: "Large group private concert transportation vehicle",
    },
  },
} as const;
