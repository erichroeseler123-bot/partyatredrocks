export const MARRIOTT_WEST_PICKUP_LABEL = "Denver Marriott West";
export const MARRIOTT_WEST_PICKUP_ID = "marriott-west";
export const MARRIOTT_WEST_CAPACITY_HUB = "golden";
export const MARRIOTT_WEST_PICKUP_ALIASES = [
  MARRIOTT_WEST_PICKUP_LABEL,
  "Marriott Denver West",
  "Denver West Marriott",
];

function normalize(value: string | null | undefined) {
  return String(value || "").trim().toLowerCase();
}

export function isMarriottWestPickup(value: string | null | undefined) {
  const normalized = normalize(value);
  if (!normalized) return false;
  if (MARRIOTT_WEST_PICKUP_ALIASES.some((label) => normalize(label) === normalized)) return true;
  return normalized.includes("marriott") && normalized.includes("west") && normalized.includes("denver");
}

export function normalizeMarriottWestPickupLabel(value: string | null | undefined) {
  return isMarriottWestPickup(value) ? MARRIOTT_WEST_PICKUP_LABEL : value;
}

export function buildMarriottWestSharedBookingHref() {
  const query = new URLSearchParams({
    pickupHub: MARRIOTT_WEST_CAPACITY_HUB,
    pickupLabel: MARRIOTT_WEST_PICKUP_LABEL,
  });
  return `/book/red-rocks-amphitheatre/custom/shared?${query.toString()}`;
}

export function buildQrCodeUrl(targetUrl: string) {
  const params = new URLSearchParams({
    size: "220x220",
    data: targetUrl,
    qzone: "1",
    format: "png",
  });
  return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
}
