export const BOOKING_COPY = {
  meta: {
    layoutDescription:
      "Book private Red Rocks transportation with direct pickup, vehicle details before the ride, and a return plan after the show. Private Suburban pricing is $399–$499, with van upgrade availability online.",
    homeDescription:
      "Private Red Rocks transportation from Denver, Golden, and Morrison. Direct pickup, guaranteed return, Private Suburban service, and private van upgrade planning.",
    businessDescription:
      "Private Red Rocks transportation with pickup planning and guaranteed return service.",
    sharedBookingDescription:
      "Party at Red Rocks public booking is private-vehicle-only. Book a Private Suburban or upgrade to a private van.",
    privateBookingDescription:
      "Private Red Rocks transportation from Denver. Private Suburban $399–$499, private van upgrade available, guaranteed return, limo-lane access, and optional liquor stop planning.",
  },
  labels: {
    sharedRideTitle: "Private Vehicle",
    privateRideTitle: "Private Vehicle",
    sharedBookingTitle: "Book Private Transportation",
    privateBookingTitle: "Choose Your Private Vehicle",
    sharedBookingEyebrow: "Private Red Rocks Transportation",
    privateBookingEyebrow: "Private Ride",
    bookSharedSeats: "Book Private Suburban",
    viewPrivateVehicles: "View Private Vehicles",
  },
  trust: {
    fixedPricing: "Fixed pricing",
    guaranteedReturn: "Guaranteed return ride",
    denverGoldenPickups: "Denver + Golden departures",
    oneVehiclePlan: "One vehicle for the full night",
  },
  copy: {
    sharedRide:
      "Private round-trip Red Rocks transportation with one clear ride plan for show night.",
    privateRide:
      "Private Red Rocks transportation for groups that want one vehicle, one pickup plan, and a cleaner night.",
    sharedRideCard: "Private Red Rocks transportation with round-trip service and online booking.",
    privateRideOptions:
      "Private Suburban and private van options with one vehicle for the full night.",
  },
  pickupHubs: {
    denver: {
      label: "Denver",
      detail: "Sheraton Denver Downtown",
      helper: "Denver pickup boards at the Sheraton Denver Downtown.",
    },
    golden: {
      label: "Golden",
      detail: "Trailhead Taphouse",
      helper: "Golden pickup boards at Trailhead Taphouse in Golden.",
    },
  },
  faq: {
    privateReturn:
      "Yes. Private rides are planned around a guaranteed return after the show so your group stays on one vehicle for the full night.",
    privatePickupTime:
      "Most private Red Rocks rides use a 4:30 PM pickup window from Denver, with the exact pickup details confirmed before the event.",
    liquorStop:
      "Yes. Most private rides can include a quick stop if the request is added before the ride.",
  },
} as const;
