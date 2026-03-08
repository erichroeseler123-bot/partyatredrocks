/**
 * Rezdy helpers:
 * - booking URL shortcuts for existing UI usage
 * - typed Supplier API client utilities for server routes
 */

export const BOOKING_URLS = {
  SHUTTLE: "https://partyatredrocks.rezdy.com/calendarWidget/shuttle",
  SUV: "https://partyatredrocks.rezdy.com/calendarWidget/private-suv",
} as const;

export function getBookingUrl(type: "shuttle" | "suv") {
  return type === "shuttle" ? BOOKING_URLS.SHUTTLE : BOOKING_URLS.SUV;
}

const REZDY_API_BASE = process.env.REZDY_API_BASE_URL ?? "https://api.rezdy.com/v1";

export type RezdyProduct = {
  productCode?: string;
  name?: string;
  description?: string;
  [key: string]: unknown;
};

export type RezdySession = {
  startTimeLocal?: string;
  endTimeLocal?: string;
  seatsAvailable?: number;
  [key: string]: unknown;
};

export type RezdyBookingResponse = {
  bookingCode?: string;
  status?: string;
  [key: string]: unknown;
};

export type RezdyBookPayload = Record<string, unknown>;

type RezdyResponseEnvelope<T> = {
  requestStatus?: {
    success?: boolean;
    error?: {
      errorCode?: string;
      errorMessage?: string;
    };
  };
  products?: T[];
  sessions?: T[];
  booking?: T;
  [key: string]: unknown;
};

function getApiKey(): string {
  const apiKey = process.env.REZDY_API_KEY;
  if (!apiKey) {
    throw new Error("Missing REZDY_API_KEY");
  }
  return apiKey;
}

function withApiKey(pathname: string, query: URLSearchParams): URL {
  const url = new URL(pathname, REZDY_API_BASE.endsWith("/") ? REZDY_API_BASE : `${REZDY_API_BASE}/`);
  query.forEach((value, key) => {
    url.searchParams.set(key, value);
  });
  url.searchParams.set("apiKey", getApiKey());
  return url;
}

async function rezdyFetch<T>(
  pathname: string,
  init: RequestInit & { query?: URLSearchParams } = {}
): Promise<RezdyResponseEnvelope<T>> {
  const { query = new URLSearchParams(), ...requestInit } = init;
  const url = withApiKey(pathname, query);
  const res = await fetch(url.toString(), {
    cache: "no-store",
    ...requestInit,
    headers: {
      "Content-Type": "application/json",
      ...(requestInit.headers ?? {}),
    },
  });

  const body = (await res.json().catch(() => ({}))) as RezdyResponseEnvelope<T>;
  if (!res.ok) {
    const message =
      body?.requestStatus?.error?.errorMessage ??
      `Rezdy request failed (${res.status})`;
    throw new Error(message);
  }
  return body;
}

export async function rezdyListProducts(query?: URLSearchParams): Promise<RezdyProduct[]> {
  const data = await rezdyFetch<RezdyProduct>("products", { method: "GET", query });
  return Array.isArray(data.products) ? data.products : [];
}

export async function rezdyGetAvailability(query: URLSearchParams): Promise<RezdySession[]> {
  const data = await rezdyFetch<RezdySession>("availability", { method: "GET", query });
  return Array.isArray(data.sessions) ? data.sessions : [];
}

export async function rezdyCreateBooking(payload: RezdyBookPayload): Promise<RezdyBookingResponse> {
  const data = await rezdyFetch<RezdyBookingResponse>("bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (data.booking && typeof data.booking === "object") {
    return data.booking;
  }
  return data as RezdyBookingResponse;
}
