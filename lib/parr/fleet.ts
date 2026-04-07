import type { InternalOrderRow } from "@/lib/orders";
import { PRIVATE_RIDE_OPTIONS } from "@/lib/rideCatalog";

export type FleetOwner = "parr" | "friend_fleet";

export type PrivateInventoryPool = {
  owner: FleetOwner;
  label: string;
  productCode: string;
  capacity: number;
  priority: number;
};

export const FLEET_OWNER_LABELS: Record<FleetOwner, string> = {
  parr: "PARR",
  friend_fleet: "Friend Fleet",
};

export const SHARED_DAILY_CAPACITY: Record<"denver" | "golden", number> = {
  denver: 20,
  golden: 20,
};

export const PRIVATE_INVENTORY_POOLS: PrivateInventoryPool[] = [
  {
    owner: "parr",
    label: "PARR Suburban",
    productCode: "parr-suburban",
    capacity: 3,
    priority: 1,
  },
  {
    owner: "friend_fleet",
    label: "Friend Suburban",
    productCode: "parr-suburban",
    capacity: 1,
    priority: 2,
  },
  {
    owner: "friend_fleet",
    label: "Friend Sprinter",
    productCode: "parr-sprinter-14",
    capacity: 1,
    priority: 1,
  },
];

const SHARED_LANE_BY_PRODUCT: Record<string, "denver" | "golden"> = {
  "shared-denver": "denver",
  "shared-golden": "golden",
};

const PRIVATE_PRODUCT_CODES = new Set<string>(PRIVATE_RIDE_OPTIONS.map((option) => option.dccProduct));

export type ReassignmentReview = {
  malformedReason: string | null;
  warnings: string[];
  serviceDate: string | null;
  sharedLane: "denver" | "golden" | null;
};

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function parseScheduleKey(sessionKey: string | null | undefined) {
  const trimmed = stringValue(sessionKey);
  if (!trimmed) {
    return { serviceDate: null, lane: null as "denver" | "golden" | null, rawLane: null as string | null };
  }
  const match = trimmed.match(/^(\d{4}-\d{2}-\d{2})(?::([a-z0-9-]+))?$/i);
  if (!match) {
    return { serviceDate: null, lane: null as "denver" | "golden" | null, rawLane: null as string | null };
  }
  const rawLane = typeof match[2] === "string" && match[2].trim() ? match[2].trim().toLowerCase() : null;
  const lane: "denver" | "golden" | null =
    rawLane === "denver" || rawLane === "golden" ? rawLane : null;
  return { serviceDate: match[1], lane, rawLane };
}

export function reviewReassignmentDraft(input: {
  productCode: string | null | undefined;
  sessionKey: string | null | undefined;
  pickupLabel?: string | null | undefined;
  fallbackServiceDate?: string | null | undefined;
}): ReassignmentReview {
  const warnings: string[] = [];
  const productCode = stringValue(input.productCode);
  const pickupLabel = stringValue(input.pickupLabel)?.toLowerCase() || null;
  const parsedSchedule = parseScheduleKey(input.sessionKey);
  const fallbackServiceDate = stringValue(input.fallbackServiceDate);
  const expectedSharedLane = productCode ? SHARED_LANE_BY_PRODUCT[productCode] || null : null;
  const isShared = !!expectedSharedLane;
  const isKnownPrivate = !!productCode && PRIVATE_PRODUCT_CODES.has(productCode);

  if (!productCode) {
    return {
      malformedReason: "Choose a product before saving reassignment.",
      warnings,
      serviceDate: parsedSchedule.serviceDate || fallbackServiceDate,
      sharedLane: parsedSchedule.lane,
    };
  }

  if (!isShared && !isKnownPrivate) {
    return {
      malformedReason: `Unknown product code "${productCode}".`,
      warnings,
      serviceDate: parsedSchedule.serviceDate || fallbackServiceDate,
      sharedLane: parsedSchedule.lane,
    };
  }

  if (isShared) {
    if (!parsedSchedule.serviceDate || !parsedSchedule.rawLane) {
      warnings.push("Shared shuttle reassignment should use a session like 2026-04-18:denver or 2026-04-18:golden.");
    } else if (parsedSchedule.lane !== expectedSharedLane) {
      warnings.push(`Session lane ${parsedSchedule.rawLane} does not match ${expectedSharedLane} shuttle inventory.`);
    }
    if (pickupLabel && !pickupLabel.includes(expectedSharedLane)) {
      warnings.push(`Pickup label does not mention ${expectedSharedLane}. Review before trusting this shuttle assignment.`);
    }
  } else {
    if (parsedSchedule.rawLane === "denver" || parsedSchedule.rawLane === "golden") {
      warnings.push("Private rides should not use a Denver or Golden shuttle lane session key.");
    }
    if (!parsedSchedule.serviceDate && !fallbackServiceDate) {
      warnings.push("Private reassignment has no service date. It will stay preserved but should be reviewed.");
    }
    if (!PRIVATE_INVENTORY_POOLS.some((pool) => pool.productCode === productCode)) {
      warnings.push("This private product does not have a fleet pool configured yet. Review owner assignment before operations.");
    }
  }

  return {
    malformedReason: null,
    warnings,
    serviceDate: parsedSchedule.serviceDate || fallbackServiceDate,
    sharedLane: parsedSchedule.lane,
  };
}

export function getFleetOwnerLabel(owner: FleetOwner | null | undefined) {
  if (!owner) return "Unassigned";
  return FLEET_OWNER_LABELS[owner] || owner;
}

export function getOrderServiceDate(order: InternalOrderRow): string | null {
  return (
    stringValue(order.booking?.date) ||
    stringValue(order.booking?.eventDate) ||
    stringValue(order.rezdyBookingPayload?.date) ||
    stringValue(order.rezdyBookingPayload?.eventDate)
  );
}

export function getOrderFleetOwner(order: InternalOrderRow): FleetOwner | null {
  const raw =
    stringValue(order.booking?.inventoryOwner) ||
    stringValue(order.pickup?.inventoryOwner) ||
    stringValue(order.rezdyBookingPayload?.inventoryOwner) ||
    stringValue(order.payment?.inventoryOwner);
  if (raw === "parr" || raw === "friend_fleet") return raw;
  if ((order.productCode || "").startsWith("shared-")) return "parr";
  if (order.productCode) return "parr";
  return null;
}

function isOrderCanceled(order: InternalOrderRow) {
  return stringValue(order.booking?.status) === "canceled";
}

function countActivePrivateAllocations(
  orders: InternalOrderRow[],
  input: { serviceDate: string; productCode: string; owner: FleetOwner; excludeInternalOrderId?: string | null }
) {
  return orders.filter((order) => {
    if (input.excludeInternalOrderId && order.internalOrderId === input.excludeInternalOrderId) return false;
    if (isOrderCanceled(order)) return false;
    if ((order.productCode || null) !== input.productCode) return false;
    if (getOrderFleetOwner(order) !== input.owner) return false;
    return getOrderServiceDate(order) === input.serviceDate;
  }).length;
}

export function assignPrivateInventory(
  orders: InternalOrderRow[],
  input: { serviceDate: string | null; productCode: string; excludeInternalOrderId?: string | null }
) {
  const pools = PRIVATE_INVENTORY_POOLS
    .filter((pool) => pool.productCode === input.productCode)
    .sort((a, b) => a.priority - b.priority);

  if (!input.serviceDate || pools.length === 0) {
    return {
      owner: "parr" as FleetOwner,
      label: pools[0]?.label || "PARR Fleet",
      capacity: pools[0]?.capacity || null,
      overflow: false,
    };
  }

  for (const pool of pools) {
    const allocated = countActivePrivateAllocations(orders, {
      serviceDate: input.serviceDate,
      productCode: input.productCode,
      owner: pool.owner,
      excludeInternalOrderId: input.excludeInternalOrderId,
    });
    if (allocated < pool.capacity) {
      return {
        owner: pool.owner,
        label: pool.label,
        capacity: pool.capacity,
        overflow: false,
      };
    }
  }

  const fallback = pools[pools.length - 1] || null;
  return {
    owner: fallback?.owner || ("parr" as FleetOwner),
    label: fallback?.label || "PARR Fleet",
    capacity: fallback?.capacity || null,
    overflow: true,
  };
}
