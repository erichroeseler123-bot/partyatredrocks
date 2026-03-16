export const bookingVisuals = {
  shared: {
    imageSrc: "/images/marketing/shuttle.jpg",
    imageAlt: "Passengers boarding a concert shuttle for Red Rocks",
    eyebrow: "Per-Person Shuttle",
    title: "Book Shuttle Seats",
    copy: "Shared round-trip shuttle seats from Denver and Golden with one clear ride plan for show night.",
  },
  private: {
    imageSrc: "/images/marketing/vip-suv.jpg",
    imageAlt: "Private SUV transportation for a Red Rocks concert night",
    eyebrow: "Private Ride",
    title: "Choose Your Private Vehicle",
    copy: "Private Red Rocks transportation for groups that want one vehicle, one pickup plan, and a cleaner night.",
  },
  privateOptions: {
    suv: {
      imageSrc: "/images/marketing/vip-suv.jpg",
      imageAlt: "Private SUV for Red Rocks transportation",
    },
    van: {
      imageSrc: "/images/marketing/shuttle.jpg",
      imageAlt: "Passenger van transportation for Red Rocks groups",
    },
    sprinter: {
      imageSrc: "/fleet/fleet-sprinter.jpg",
      imageAlt: "Sprinter van transportation for larger Red Rocks groups",
    },
    "party-bus": {
      imageSrc: "/hero/hero-home.jpg",
      imageAlt: "Party bus style group transportation for a concert night",
    },
  },
} as const;

