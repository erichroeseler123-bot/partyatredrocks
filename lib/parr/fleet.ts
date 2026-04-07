import type { InternalOrderRow } from "@/lib/orders";

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

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
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
