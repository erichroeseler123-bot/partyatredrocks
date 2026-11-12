import "server-only";

import { getInternalOrderByAnyReference, type InternalOrderRow } from "@/lib/orders";
import { normalizePhoneNumber } from "@/lib/phone";
import { PARR_PUBLIC_FACTS } from "@/lib/publicOperatorFacts";

const MAX_RAW_INPUT_LENGTH = 240;
const MAX_REFERENCE_LENGTH = 160;
const MAX_CONTACT_LENGTH = 160;
const REFERENCE_FORMAT_PATTERN = /^[A-Za-z0-9._-]+$/;

export type BookingLookupInput = {
  reference?: unknown;
  contact?: unknown;
};

export type BookingLookupResult =
  | {
      ok: true;
      bookingPath: string;
    }
  | {
      ok: false;
      status: 400 | 404;
      error: string;
    };

const UNIFORM_NOT_VERIFIED_ERROR = `We could not verify a booking with those details. Double-check your confirmation code and checkout email or phone number, or text ${PARR_PUBLIC_FACTS.support.phoneDisplay} for help.`;

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function extractReferenceToken(raw: string): string {
  const trimmed = raw.trim().replace(/^#/, "").trim();
  if (!trimmed || trimmed.length > MAX_RAW_INPUT_LENGTH) return "";

  const bookingPathMatch = trimmed.match(/\/booking\/([A-Za-z0-9._%-]+)/i);
  if (bookingPathMatch?.[1]) {
    try {
      return decodeURIComponent(bookingPathMatch[1]).trim();
    } catch {
      return bookingPathMatch[1].trim();
    }
  }

  return trimmed;
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function matchesOrderContact(order: InternalOrderRow, rawContact: string): boolean {
  const contact = rawContact.trim();
  if (!contact) return false;

  const customer =
    order.customer && typeof order.customer === "object"
      ? (order.customer as Record<string, unknown>)
      : null;
  if (!customer) return false;

  const storedEmail = typeof customer.email === "string" ? normalizeEmail(customer.email) : "";
  if (contact.includes("@")) {
    return Boolean(storedEmail) && storedEmail === normalizeEmail(contact);
  }

  const storedPhones = [
    typeof customer.phone === "string" ? customer.phone : "",
    typeof customer.phoneDisplay === "string" ? customer.phoneDisplay : "",
  ].filter(Boolean);

  if (!storedPhones.length) return false;

  const parsedInput = normalizePhoneNumber(contact, "US");
  const inputDigits = digitsOnly(contact);
  const inputLast10 = inputDigits.length >= 10 ? inputDigits.slice(-10) : "";

  for (const stored of storedPhones) {
    const parsedStored = normalizePhoneNumber(stored, "US");
    if (parsedInput && parsedStored && parsedInput.e164 === parsedStored.e164) {
      return true;
    }
    const storedDigits = digitsOnly(stored);
    if (inputLast10 && storedDigits.length >= 10 && storedDigits.slice(-10) === inputLast10) {
      return true;
    }
  }

  return false;
}

export async function lookupVerifiedBooking(
  input: BookingLookupInput,
): Promise<BookingLookupResult> {
  const rawRefInput = cleanString(input?.reference);
  const rawContact = cleanString(input?.contact);

  if (!rawRefInput || !rawContact) {
    return {
      ok: false,
      status: 400,
      error:
        "Enter both your booking reference (or confirmation code) and the email or phone number used at checkout.",
    };
  }

  const cleanReference = extractReferenceToken(rawRefInput);
  if (
    !cleanReference ||
    cleanReference.length > MAX_REFERENCE_LENGTH ||
    rawContact.length > MAX_CONTACT_LENGTH ||
    !REFERENCE_FORMAT_PATTERN.test(cleanReference)
  ) {
    return {
      ok: false,
      status: 400,
      error: "Please check your booking reference and contact details and try again.",
    };
  }

  const order = await getInternalOrderByAnyReference(cleanReference);

  // Return identical error message whether reference is unknown or contact verification fails so unverified guesses never leak PII.
  if (!order || !matchesOrderContact(order, rawContact)) {
    return {
      ok: false,
      status: 404,
      error: UNIFORM_NOT_VERIFIED_ERROR,
    };
  }

  const resolvedToken =
    (typeof order.bookingToken === "string" && order.bookingToken.trim()) ||
    order.internalOrderId;

  return {
    ok: true,
    bookingPath: `/booking/${encodeURIComponent(resolvedToken)}`,
  };
}
