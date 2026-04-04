import "server-only";

import { randomUUID } from "node:crypto";
import { SquareClient, SquareEnvironment } from "square";

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export function siteOrigin() {
  return process.env.NEXT_PUBLIC_SITE_ORIGIN?.trim() || "https://www.partyatredrocks.com";
}

export function squareWebhookUrl() {
  return `${siteOrigin()}/api/webhooks/square`;
}

function environment() {
  return process.env.SQUARE_ENVIRONMENT === "sandbox"
    ? SquareEnvironment.Sandbox
    : SquareEnvironment.Production;
}

export function squareClient() {
  return new SquareClient({
    token: required("SQUARE_ACCESS_TOKEN"),
    environment: environment(),
  });
}

export function squareApplicationId() {
  return process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID?.trim()
    || process.env.SQUARE_APP_ID?.trim()
    || required("NEXT_PUBLIC_SQUARE_APPLICATION_ID");
}

export function squareWebSdkUrl() {
  return process.env.SQUARE_ENVIRONMENT === "sandbox"
    ? "https://sandbox.web.squarecdn.com/v1/square.js"
    : "https://web.squarecdn.com/v1/square.js";
}

export function squareLocationId() {
  return required("SQUARE_LOCATION_ID");
}

export function squareWebhookSignatureKey() {
  return required("SQUARE_WEBHOOK_SIGNATURE_KEY");
}

export async function createSharedSquareOrder(input: {
  internalOrderId: string;
  dccHandoffId?: string | null;
  title: string;
  pickupHub: "denver" | "golden";
  date: string;
  artist?: string | null;
  quantity: number;
  amountCents: number;
}) {
  const client = squareClient();
  const response = await client.orders.create({
    idempotencyKey: randomUUID(),
    order: {
      locationId: squareLocationId(),
      referenceId: input.internalOrderId,
      metadata: input.dccHandoffId ? { dcc_handoff_id: input.dccHandoffId } : undefined,
      lineItems: [
        {
          name: `Red Rocks shared shuttle - ${input.pickupHub}`,
          quantity: String(input.quantity),
          basePriceMoney: {
            amount: BigInt(Math.round(input.amountCents / input.quantity)),
            currency: "USD",
          },
          note: [input.title, input.date, input.artist || null].filter(Boolean).join(" | "),
        },
      ],
    },
  });

  const order = response.order;
  if (!order?.id) {
    throw new Error("Square did not return an order ID.");
  }

  return {
    squareOrderId: order.id,
  };
}

export async function createPrivateSquareOrder(input: {
  internalOrderId: string;
  dccHandoffId?: string | null;
  title: string;
  vehicleLabel: string;
  date?: string | null;
  artist?: string | null;
  quantity: number;
  amountCents: number;
}) {
  const client = squareClient();
  const response = await client.orders.create({
    idempotencyKey: randomUUID(),
    order: {
      locationId: squareLocationId(),
      referenceId: input.internalOrderId,
      metadata: input.dccHandoffId ? { dcc_handoff_id: input.dccHandoffId } : undefined,
      lineItems: [
        {
          name: input.vehicleLabel,
          quantity: String(input.quantity),
          basePriceMoney: {
            amount: BigInt(Math.round(input.amountCents / input.quantity)),
            currency: "USD",
          },
          note: [input.title, input.date || null, input.artist || null].filter(Boolean).join(" | "),
        },
      ],
    },
  });

  const order = response.order;
  if (!order?.id) {
    throw new Error("Square did not return an order ID.");
  }

  return {
    squareOrderId: order.id,
  };
}
