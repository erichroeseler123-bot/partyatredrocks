import type { InternalOrderRow } from "@/lib/orders";

export type OpsView = "calendar" | "run-sheet" | "all-orders";
export type OpsPaymentState = "unpaid" | "partial" | "paid" | "manual_review" | "unknown";
export type OpsWorkflowState =
  | "new"
  | "pending_payment"
  | "waiting"
  | "confirmed"
  | "resolved"
  | "canceled"
  | "needs_review";

export type OpsOrder = {
  orderId: string;
  bookingToken: string | null;
  bookingReference: string | null;
  createdAt: string;
  lastTouchedAt: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  productCode: string | null;
  productLabel: string;
  sessionKey: string | null;
  serviceDate: string | null;
  departureLabel: string;
  pickupLabel: string;
  seats: number;
  bookingStatus: string;
  paymentState: OpsPaymentState;
  workflowState: OpsWorkflowState;
  totalDue: number;
  totalPaid: number;
  handoffMode: string | null;
  note: string | null;
  followUpStatus: string;
  operatorPaymentStep: string;
  paymentRequestSentAt: string | null;
  source: InternalOrderRow;
};

export type OpsDepartureGroup = {
  key: string;
  serviceDate: string;
  departureLabel: string;
  pickupLabel: string;
  orders: OpsOrder[];
  seats: number;
  paidSeats: number;
  pendingSeats: number;
};

export type OpsDayGroup = {
  key: string;
  serviceDate: string;
  orders: OpsOrder[];
  departures: OpsDepartureGroup[];
  seats: number;
  ordersCount: number;
  warnings: number;
};
