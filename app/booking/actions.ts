"use server";

import { lookupVerifiedBooking, type BookingLookupResult } from "@/lib/bookingLookup";

export async function lookupVerifiedBookingAction(input: {
  reference: string;
  contact: string;
}): Promise<BookingLookupResult> {
  return lookupVerifiedBooking(input);
}
