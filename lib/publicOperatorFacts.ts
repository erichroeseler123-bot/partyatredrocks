export const PARR_PUBLIC_FACTS = {
  operatorName: "Party at Red Rocks",
  support: {
    phoneE164: "+17203696292",
    phoneDisplay: "720-369-6292",
    email: "hello@partyatredrocks.com",
    smsLead: "Hey - I have a question about my Party At Red Rocks ride.",
    shortWording: "Questions about pickup, payment, or your ride? Text or email Party at Red Rocks.",
    longWording:
      "Questions about pickup, payment, or your ride? Text 720-369-6292 or email hello@partyatredrocks.com.",
  },
  trustPoints: [
    "Shared Denver and Golden pickup hubs",
    "Private SUV, van, Sprinter, and party bus options",
    "Return ride after the show",
  ],
  pickups: {
    denver: {
      hubId: "denver",
      cityLabel: "Denver",
      shortLabel: "Sheraton Denver Downtown",
      name: "Sheraton Denver Downtown Hotel",
      address: "1550 Court Place, Denver, CO 80202",
      shortAddress: "1550 Court Pl, Denver, CO 80202",
      description:
        "A central downtown pickup with easy rideshare access, hotel staff on-site, and plenty of room to meet your group before departure.",
      instructions:
        "Meet outside the main entrance unless we text you otherwise. Keep your phone on in case the exact curbside boarding spot shifts.",
      arrivalNote: "Arrive 10-15 minutes early so boarding stays smooth.",
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=39.7424135236667,-104.98926230317811",
      mapsEmbedUrl:
        "https://www.google.com/maps?q=39.7424135236667,-104.98926230317811&z=17&output=embed",
      websiteUrl:
        "https://www.marriott.com/en-us/hotels/dends-sheraton-denver-downtown-hotel/overview/",
      websiteLabel: "Visit Hotel",
      menuUrl: null,
      menuLabel: null,
      amenities: ["Bathrooms available inside", "Lobby seating nearby", "Easy rideshare drop-off"],
      meetup: {
        landmark: "the main entrance on Court Place",
        bestWaitSpot: "the Sheraton lobby bar or hotel lobby seating",
        waitInstructions: "Feel free to stay inside until the driver text lands, then head out to the main entrance.",
        checkIn: "Your driver will be wearing PARR gear and will check you in by the name on the booking.",
        arrivalText: "We will text a live pin and curbside note about 15 minutes before the shuttle arrives.",
        boardingCue: "Head to the main entrance curb when the status flips to boarding.",
      },
    },
    golden: {
      hubId: "golden",
      cityLabel: "Golden",
      shortLabel: "Trailhead Taphouse",
      name: "Trailhead Taphouse & Kitchen",
      address: "811 12th Street, Golden, CO 80401",
      shortAddress: "811 12th Street, Golden, CO 80401",
      description:
        "A casual Golden pickup spot where you can grab a drink or bite before heading to Red Rocks.",
      instructions:
        "Meet outside the front entrance unless we text you otherwise. Boarding is usually staged near the curb on 12th Street.",
      arrivalNote: "Best to arrive 10-15 minutes early to order and settle up before boarding.",
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Trailhead%20Taphouse%20%26%20Kitchen%20811%2012th%20Street%20Golden%20CO%2080401",
      mapsEmbedUrl:
        "https://www.google.com/maps?q=Trailhead%20Taphouse%20%26%20Kitchen%20811%2012th%20Street%20Golden%20CO%2080401&z=17&output=embed",
      websiteUrl: "https://trailheadtaphouse.com/",
      websiteLabel: "Visit Website",
      menuUrl: "https://trailheadtaphouse.com/menu/",
      menuLabel: "View Menu",
      amenities: ["Food and drinks on site", "Bathrooms inside", "Downtown Golden pickup"],
      meetup: {
        landmark: "the front entrance and curb on 12th Street",
        bestWaitSpot: "inside Trailhead Taphouse",
        waitInstructions: "Grab a drink or food inside and stay there until the driver text tells you to step outside.",
        checkIn: "Your driver will check you in by booking name, so you do not need to print anything.",
        arrivalText: "We will text a live pin and vehicle note about 15 minutes before arrival.",
        boardingCue: "When the shuttle is 5 minutes out, close out your tab and head to the front curb.",
      },
    },
  },
} as const;

export type ParrPickupHubId = keyof typeof PARR_PUBLIC_FACTS.pickups;

export function getParrPickupFacts(input: string | null | undefined) {
  const key = input === "Golden" || input === "golden" ? "golden" : "denver";
  return PARR_PUBLIC_FACTS.pickups[key];
}
