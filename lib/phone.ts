import { parsePhoneNumberFromString } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";

export type SupportedPhoneCountry = "US" | "CA" | "GB" | "AU";

export const PHONE_COUNTRY_OPTIONS: Array<{
  code: SupportedPhoneCountry;
  label: string;
  example: string;
}> = [
  { code: "US", label: "United States", example: "720-369-6292" },
  { code: "CA", label: "Canada", example: "604-555-0123" },
  { code: "GB", label: "United Kingdom", example: "07700 900123" },
  { code: "AU", label: "Australia", example: "0412 345 678" },
];

export function isSupportedPhoneCountry(value: unknown): value is SupportedPhoneCountry {
  return value === "US" || value === "CA" || value === "GB" || value === "AU";
}

export function normalizePhoneNumber(rawPhone: string, country: SupportedPhoneCountry = "US") {
  const input = rawPhone.trim();
  if (!input) return null;

  const parsed = input.startsWith("+")
    ? parsePhoneNumberFromString(input)
    : parsePhoneNumberFromString(input, country as CountryCode);

  if (!parsed || !parsed.isValid()) return null;

  return {
    country: parsed.country ?? country,
    e164: parsed.number,
    national: parsed.formatNational(),
    international: parsed.formatInternational(),
  };
}
