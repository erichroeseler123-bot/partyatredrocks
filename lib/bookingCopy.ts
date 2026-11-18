import {
  PARR_2027_OPTION_B_PRICING_AUTHORITY,
  PARR_COMPLETE_TOTAL_DISCLOSURE,
  PARR_VALUE_PROPOSITION,
} from "@/lib/pricing";

const SUV = PARR_2027_OPTION_B_PRICING_AUTHORITY.suv;
const VAN = PARR_2027_OPTION_B_PRICING_AUTHORITY.van;

export const BOOKING_COPY = {
  meta: {
    layoutDescription:
      `Book private Red Rocks transportation with upfront all-in totals (${SUV.allInTotalFormatted} Private Suburban: ${SUV.itemizedSummary}; ${VAN.allInTotalFormatted} Private Van: ${VAN.itemizedSummary}), Upper North Lot tailgating setup, and a coordinated return after the show.`,
    homeDescription:
      `Dedicated private SUV (${SUV.allInTotalFormatted} total: ${SUV.itemizedSummary}) & Van (${VAN.allInTotalFormatted} total: ${VAN.itemizedSummary}) round-trip for your group: Denver-area pickup, Upper North Lot tailgating setup, on-site wait, & return ride.`,
    businessDescription:
      "Independent Colorado concert transportation provider with 24/7 scheduled service subject to live vehicle and schedule availability. The same Colorado transportation operation runs Party at Red Rocks during the summer concert season and GoSno during the winter ski season.",
    sharedBookingDescription:
      `Private Red Rocks transportation with upfront all-in totals (${PARR_COMPLETE_TOTAL_DISCLOSURE}), pickup planning, secure checkout, and a coordinated return plan after the show.`,
    privateBookingDescription:
      `Private Red Rocks transportation from Denver. Private Suburban ${SUV.allInTotalFormatted} total (${SUV.itemizedSummary}), Private Van ${VAN.allInTotalFormatted} total (${VAN.itemizedSummary})—${PARR_VALUE_PROPOSITION.summary}`,
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
