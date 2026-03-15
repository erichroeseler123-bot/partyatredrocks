export type RecentBooking = {
  city: string;
  rideType: "shared" | "private";
  productLabel?: string;
  quantity?: number;
  createdAt: string;
};

export function recentBookingKey(booking: RecentBooking) {
  return [
    booking.city,
    booking.rideType,
    booking.productLabel || "",
    booking.quantity || "",
    booking.createdAt,
  ].join("::");
}

export function recentBookingLabel(booking: RecentBooking) {
  const quantity = typeof booking.quantity === "number" && booking.quantity > 0 ? booking.quantity : null;
  const rideLabel =
    booking.rideType === "private"
      ? booking.productLabel || "private ride"
      : quantity
        ? `${quantity} shared seat${quantity === 1 ? "" : "s"}`
        : booking.productLabel || "shared shuttle seats";

  return `Recent booking: ${rideLabel} from ${booking.city}`;
}
