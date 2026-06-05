export const BOOKING_COPY = {
  meta: {
    layoutDescription:
      "Book private Red Rocks transportation with fixed pricing, private pickup details before the ride, and a return plan after the show. Private Suburban is $399 with a private van upgrade available.",
    homeDescription:
      "Private Red Rocks transportation from Denver, Golden, and Morrison. Fixed pricing, guaranteed return, Private Suburban, private van upgrade, and group ride planning.",
    businessDescription:
      "Fixed-price private Red Rocks transportation with pickup planning and guaranteed return service.",
    sharedBookingDescription:
      "Private Red Rocks transportation is available online with fixed pricing, pickup timing, secure checkout, and a guaranteed ride home after the show.",
    privateBookingDescription:
      "Private Red Rocks transportation from Denver. Private Suburban $399, private van $599, guaranteed return, limo-lane access, and optional liquor stop planning.",
  },
  labels: {
    sharedRideTitle: "Private Ride",
    privateRideTitle: "Private Vehicle",
    sharedBookingTitle: "Book Private Transportation",
    privateBookingTitle: "Choose Your Private Vehicle",
    sharedBookingEyebrow: "Private Ride",
    privateBookingEyebrow: "Private Ride",
    bookSharedSeats: "Book Private Ride",
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
    sharedRideCard: "Private vehicle options with round-trip service and online booking.",
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
