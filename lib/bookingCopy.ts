import { PARR_VALUE_PROPOSITION, SUBURBAN_2027_USD, VAN_2027_USD } from "@/lib/pricing";

export const BOOKING_COPY = {
  meta: {
    layoutDescription:
      `Book private Red Rocks transportation with published flat vehicle pricing ($${SUBURBAN_2027_USD} Private Suburban, $${VAN_2027_USD} Private Van), Upper North Lot tailgating setup, and a coordinated return after the show.`,
    homeDescription:
      `Dedicated private SUV ($${SUBURBAN_2027_USD}) & Van ($${VAN_2027_USD}) flat round-trip for your group: Denver-area pickup, Upper North Lot tailgating setup, on-site wait, & return ride.`,
    businessDescription:
      "Independent Colorado concert transportation provider with 24/7 scheduled service subject to live vehicle and schedule availability. The same Colorado transportation operation runs Party at Red Rocks during the summer concert season and GoSno during the winter ski season.",
    sharedBookingDescription:
      "Private Red Rocks transportation is available with published vehicle pricing, pickup planning, secure checkout, and a coordinated return plan after the show.",
    privateBookingDescription:
      `Private Red Rocks transportation from Denver. Private Suburban $${SUBURBAN_2027_USD}, private van $${VAN_2027_USD} flat round-trip—${PARR_VALUE_PROPOSITION.summary}`,
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
    fixedPricing: "Published private-vehicle pricing",
    guaranteedReturn: "Planned return ride",
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
      "Yes. Private rides include a planned return after the show, with the vehicle and pickup details coordinated for your group before show night.",
    privatePickupTime:
      "Most private Red Rocks rides use a 4:30 PM pickup window from Denver, with the exact pickup details confirmed before the event.",
    liquorStop:
      "Yes. Most private rides can include a quick stop if the request is added before the ride.",
  },
} as const;
