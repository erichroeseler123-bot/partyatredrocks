export const BOOKING_COPY = {
  meta: {
    layoutDescription:
      "Book Red Rocks shuttle transportation from Denver and Golden. Fixed pricing, pickup details before the ride, and a return plan after the show. Shuttle seats from $59/pp or Private SUV from $499.",
    homeDescription:
      "Shared and private Red Rocks shuttles from Denver, Golden, and Morrison. Fixed pricing, guaranteed return, private SUVs, vans, Sprinters, and group ride planning.",
    businessDescription:
      "Fixed-price Red Rocks shuttles and private rides with pickup planning and guaranteed return service.",
    sharedBookingDescription:
      "Book Red Rocks shared shuttle seats from Denver or Golden. Fixed pricing, one-hour-before-doors pickup timing, secure checkout, and a guaranteed ride home after the show.",
    privateBookingDescription:
      "Private shuttle from Denver to Red Rocks. SUV $499, 10-pass van $599, Sprinter $799, guaranteed return, limo-lane access, and optional liquor stop planning.",
  },
  labels: {
    sharedRideTitle: "Shared Shuttle",
    privateRideTitle: "Private Vehicle",
    sharedBookingTitle: "Book Shuttle Seats",
    privateBookingTitle: "Choose Your Private Vehicle",
    sharedBookingEyebrow: "Per-Person Shuttle",
    privateBookingEyebrow: "Private Ride",
    bookSharedSeats: "Book Shared Seats",
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
      "Shared round-trip shuttle seats from Denver and Golden with one clear ride plan for show night.",
    privateRide:
      "Private Red Rocks transportation for groups that want one vehicle, one pickup plan, and a cleaner night.",
    sharedRideCard: "Seat-based shuttle options with round-trip service and online booking.",
    privateRideOptions:
      "Private SUVs, vans, Sprinters, and party buses with one vehicle for the full night.",
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
