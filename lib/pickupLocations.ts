import { getParrPickupFacts } from "@/lib/publicOperatorFacts";

export type PickupLocationDetails = {
  name: string;
  address: string;
  description: string;
  instructions: string;
  arrivalNote: string;
  googleMapsUrl: string;
  mapsEmbedUrl: string;
  websiteUrl?: string | null;
  websiteLabel?: string | null;
  menuUrl?: string | null;
  menuLabel?: string | null;
  amenities?: readonly string[];
  meetup: {
    landmark: string;
    bestWaitSpot: string;
    waitInstructions: string;
    checkIn: string;
    arrivalText: string;
    boardingCue: string;
  };
};

export function getPickupLocationDetails(pickup: string | null | undefined): PickupLocationDetails {
  return getParrPickupFacts(pickup);
}
