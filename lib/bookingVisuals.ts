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
    imageSrc: "/images/redesign/red-rocks-sunset-crowd.webp",
    imageAlt: "Illuminated Red Rocks Amphitheatre concert night view above Morrison",
    eyebrow: BOOKING_COPY.labels.privateBookingEyebrow,
    title: BOOKING_COPY.labels.privateBookingTitle,
    copy: BOOKING_COPY.copy.privateRide,
  },
  privateOptions: {
    suv: {
      imageSrc: "/images/redesign/private-suburban-black.webp",
      imageAlt: "Black Chevrolet Suburban SUV for private Red Rocks group transportation",
    },
    van: {
      imageSrc: "/images/redesign/private-van-black.webp",
      imageAlt: "Black 10-passenger Ford Transit van for private Red Rocks group rides",
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
