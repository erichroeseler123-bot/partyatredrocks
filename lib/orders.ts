import "server-only";

import { appendFile, mkdir, readFile } from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";

type JsonRecord = Record<string, unknown>;
type FollowUpStatus = "new" | "contacted" | "waiting" | "resolved";
type OperatorPaymentStep = "none" | "request_sent" | "paid";

export type InternalOrderRow = {
  internalOrderId: string;
  createdAt: string;
  lastTouchedAt?: string | null;
  rezdyBookingReference: string | null;
  productCode?: string;
  sessionKey?: string | null;
  customer?: Record<string, unknown> | null;
  booking?: Record<string, unknown> | null;
  rezdyBookingPayload?: Record<string, unknown> | null;
  payment?: Record<string, unknown> | null;
  notes?: string | null;
  followUpStatus?: FollowUpStatus | null;
  operatorPaymentStep?: OperatorPaymentStep | null;
  paymentRequestSentAt?: string | null;
};

type OrderWriteInput = {
  rezdyBookingReference: string | null;
  rezdyBookingPayload: JsonRecord;
  productCode: string;
  sessionKey: string | null;
  customer: JsonRecord | null;
  booking?: JsonRecord | null;
  payment: JsonRecord;
  pickup: JsonRecord | null;
};

type OrderStateUpdateInput = {
  eventType: string;
  rezdyBookingReference: string | null;
  bookingStatus: string | null;
  paymentStatus: string | null;
  payload: unknown;
};

function asFollowUpStatus(value: unknown): FollowUpStatus | null {
  return value === "new" ||
    value === "contacted" ||
    value === "waiting" ||
    value === "resolved"
    ? value
    : null;
}

function asOperatorPaymentStep(value: unknown): OperatorPaymentStep | null {
  return value === "none" || value === "request_sent" || value === "paid" ? value : null;
}

function ndjsonBackupEnabled() {
  return process.env.ORDER_NDJSON_BACKUP !== "0";
}

function orderLogPath() {
  if (process.env.ORDER_LOG_PATH) return process.env.ORDER_LOG_PATH;
  return path.join(process.cwd(), "data", "orders", "orders.ndjson");
}

function orderDbPath() {
  if (process.env.ORDER_DB_PATH) return process.env.ORDER_DB_PATH;
  return path.join(process.cwd(), "data", "orders", "orders.sqlite");
}

function openDb() {
  const dbFile = orderDbPath();
  const dir = path.dirname(dbFile);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const db = new DatabaseSync(dbFile);
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS orders (
      internalOrderId TEXT PRIMARY KEY,
      createdAt TEXT NOT NULL,
      lastTouchedAt TEXT,
      rezdyBookingReference TEXT,
      productCode TEXT NOT NULL,
      sessionKey TEXT,
      customerName TEXT,
      customerEmail TEXT,
      customerJson TEXT,
      bookingStatus TEXT,
      paymentStatus TEXT,
      totalDue REAL,
      totalPaid REAL,
      handoffMode TEXT,
      handoffUrl TEXT,
      operatorAction TEXT,
      notes TEXT,
      followUpStatus TEXT,
      operatorPaymentStep TEXT,
      paymentRequestSentAt TEXT,
      bookingJson TEXT,
      paymentJson TEXT,
      pickupJson TEXT,
      rezdyBookingPayloadJson TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_orders_createdAt ON orders(createdAt DESC);
    CREATE INDEX IF NOT EXISTS idx_orders_bookingRef ON orders(rezdyBookingReference);

    CREATE TABLE IF NOT EXISTS order_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      createdAt TEXT NOT NULL,
      eventType TEXT NOT NULL,
      rezdyBookingReference TEXT,
      bookingStatus TEXT,
      paymentStatus TEXT,
      payloadJson TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_order_events_createdAt ON order_events(createdAt DESC);
    CREATE INDEX IF NOT EXISTS idx_order_events_bookingRef ON order_events(rezdyBookingReference);
  `);
  const orderColumns = db
    .prepare(`PRAGMA table_info(orders)`)
    .all() as Array<{ name?: string }>;
  const hasNotes = orderColumns.some((c) => c.name === "notes");
  const hasFollowUpStatus = orderColumns.some((c) => c.name === "followUpStatus");
  const hasOperatorPaymentStep = orderColumns.some((c) => c.name === "operatorPaymentStep");
  const hasPaymentRequestSentAt = orderColumns.some((c) => c.name === "paymentRequestSentAt");
  const hasLastTouchedAt = orderColumns.some((c) => c.name === "lastTouchedAt");
  if (!hasNotes) db.exec(`ALTER TABLE orders ADD COLUMN notes TEXT`);
  if (!hasFollowUpStatus) db.exec(`ALTER TABLE orders ADD COLUMN followUpStatus TEXT`);
  if (!hasOperatorPaymentStep) db.exec(`ALTER TABLE orders ADD COLUMN operatorPaymentStep TEXT`);
  if (!hasPaymentRequestSentAt) db.exec(`ALTER TABLE orders ADD COLUMN paymentRequestSentAt TEXT`);
  if (!hasLastTouchedAt) db.exec(`ALTER TABLE orders ADD COLUMN lastTouchedAt TEXT`);
  return db;
}

function readRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function asJson(value: unknown): string {
  return JSON.stringify(value ?? null);
}

function parseJson(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "string" || !value) return null;
  try {
    const parsed = JSON.parse(value) as unknown;
    return readRecord(parsed);
  } catch {
    return null;
  }
}

function toNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizePaymentStatus(value: string | null): string | null {
  if (!value) return null;
  const lower = value.trim().toLowerCase();
  if (!lower) return null;
  if (lower === "paid") return "paid";
  if (lower === "unpaid") return "unpaid";
  if (lower === "partial") return "partial";
  if (lower.includes("unpaid") || lower.includes("not_paid") || lower.includes("payment_due")) return "unpaid";
  if (lower.includes("partial")) return "partial";
  if (lower.includes("paid")) return "paid";
  return lower;
}

function pickCustomerName(customer: JsonRecord | null): string | null {
  if (!customer) return null;
  const first = typeof customer.firstName === "string" ? customer.firstName : "";
  const last = typeof customer.lastName === "string" ? customer.lastName : "";
  const name = `${first} ${last}`.trim();
  return name || null;
}

function pickCustomerEmail(customer: JsonRecord | null): string | null {
  if (!customer) return null;
  const email = typeof customer.email === "string" ? customer.email.trim() : "";
  return email || null;
}

async function appendJsonLine(filePath: string, row: JsonRecord) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await appendFile(filePath, `${JSON.stringify(row)}\n`, "utf8");
}

async function appendBackupRow(row: JsonRecord) {
  if (!ndjsonBackupEnabled()) return;
  await appendJsonLine(orderLogPath(), row);
}

export async function saveInternalOrder(input: OrderWriteInput) {
  const internalOrderId = `ord_${randomUUID()}`;
  const createdAt = new Date().toISOString();

  const bookingStatus =
    input.booking && typeof input.booking.status === "string" ? input.booking.status : null;
  const paymentStatusRaw =
    input.payment && typeof input.payment.status === "string" ? input.payment.status : null;
  const paymentStatus = normalizePaymentStatus(paymentStatusRaw);
  const totalDue = toNumber(input.payment?.totalDue);
  const totalPaid = toNumber(input.payment?.totalPaid);
  const handoffMode =
    typeof input.payment?.handoffMode === "string" ? String(input.payment.handoffMode) : null;
  const handoffUrl =
    typeof input.payment?.handoffUrl === "string" ? String(input.payment.handoffUrl) : null;
  const operatorAction =
    typeof input.payment?.operatorAction === "string" ? String(input.payment.operatorAction) : null;

  const customerName = pickCustomerName(input.customer);
  const customerEmail = pickCustomerEmail(input.customer);

  const db = openDb();
  try {
    db.prepare(
      `INSERT INTO orders (
        internalOrderId, createdAt, lastTouchedAt, rezdyBookingReference, productCode, sessionKey,
        customerName, customerEmail, customerJson, bookingStatus, paymentStatus,
        totalDue, totalPaid, handoffMode, handoffUrl, operatorAction, notes, followUpStatus,
        operatorPaymentStep, paymentRequestSentAt,
        bookingJson, paymentJson, pickupJson, rezdyBookingPayloadJson
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      internalOrderId,
      createdAt,
      createdAt,
      input.rezdyBookingReference,
      input.productCode,
      input.sessionKey,
      customerName,
      customerEmail,
      asJson(input.customer),
      bookingStatus,
      paymentStatus,
      totalDue,
      totalPaid,
      handoffMode,
      handoffUrl,
      operatorAction,
      null,
      "new",
      "none",
      null,
      asJson(input.booking ?? null),
      asJson(input.payment),
      asJson(input.pickup),
      asJson(input.rezdyBookingPayload)
    );
  } finally {
    db.close();
  }

  await appendBackupRow({
    internalOrderId,
    createdAt,
    rezdyBookingReference: input.rezdyBookingReference,
    productCode: input.productCode,
    sessionKey: input.sessionKey,
    customer: input.customer,
    booking: input.booking ?? null,
    payment: input.payment,
    pickup: input.pickup,
    rezdyBookingPayload: input.rezdyBookingPayload,
  });

  return { internalOrderId, createdAt };
}

export async function saveRezdyWebhookEvent(eventType: string, payload: unknown) {
  const createdAt = new Date().toISOString();
  const db = openDb();
  try {
    db.prepare(
      `INSERT INTO order_events (
        createdAt, eventType, rezdyBookingReference, bookingStatus, paymentStatus, payloadJson
      ) VALUES (?, ?, ?, ?, ?, ?)`
    ).run(createdAt, eventType, null, null, null, asJson(payload));
  } finally {
    db.close();
  }

  await appendBackupRow({
    type: "rezdy.webhook",
    eventType,
    receivedAt: createdAt,
    payload,
  });
}

export async function saveInternalOrderStateUpdate(input: OrderStateUpdateInput) {
  const updatedAt = new Date().toISOString();
  const paymentStatus = normalizePaymentStatus(input.paymentStatus);
  const db = openDb();
  try {
    db.prepare(
      `INSERT INTO order_events (
        createdAt, eventType, rezdyBookingReference, bookingStatus, paymentStatus, payloadJson
      ) VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      updatedAt,
      input.eventType,
      input.rezdyBookingReference,
      input.bookingStatus,
      paymentStatus,
      asJson(input.payload)
    );

    if (input.rezdyBookingReference) {
      const existing = db
        .prepare(
          `SELECT internalOrderId, paymentJson
           FROM orders
           WHERE rezdyBookingReference = ?
           ORDER BY createdAt DESC
           LIMIT 1`
        )
        .get(input.rezdyBookingReference) as
        | { internalOrderId: string; paymentJson: string | null }
        | undefined;

      if (existing?.internalOrderId) {
        const payment = parseJson(existing.paymentJson) ?? {};
        if (paymentStatus) payment.status = paymentStatus;
        const followUpState = db
          .prepare(`SELECT followUpStatus FROM orders WHERE internalOrderId = ? LIMIT 1`)
          .get(existing.internalOrderId) as { followUpStatus?: string | null } | undefined;
        const nextFollowUpStatus =
          paymentStatus === "paid" && followUpState?.followUpStatus === "waiting"
            ? "resolved"
            : null;
        db.prepare(
          `UPDATE orders
           SET bookingStatus = COALESCE(?, bookingStatus),
               paymentStatus = COALESCE(?, paymentStatus),
               operatorPaymentStep = CASE WHEN COALESCE(?, '') = 'paid' THEN 'paid' ELSE operatorPaymentStep END,
               followUpStatus = COALESCE(?, followUpStatus),
               lastTouchedAt = ?,
               paymentJson = ?
           WHERE internalOrderId = ?`
        ).run(
          input.bookingStatus,
          paymentStatus,
          paymentStatus,
          nextFollowUpStatus,
          updatedAt,
          asJson(payment),
          existing.internalOrderId
        );
      }
    }
  } finally {
    db.close();
  }

  await appendBackupRow({
    type: "internal.order.update",
    source: "rezdy.webhook",
    eventType: input.eventType,
    updatedAt,
    rezdyBookingReference: input.rezdyBookingReference,
    bookingStatus: input.bookingStatus,
    paymentStatus,
    payload: input.payload,
  });
}

export async function listInternalOrders(): Promise<InternalOrderRow[]> {
  const db = openDb();
  try {
    const rows = db
      .prepare(
        `SELECT
          internalOrderId,
          createdAt,
          lastTouchedAt,
          rezdyBookingReference,
          productCode,
          sessionKey,
          bookingJson,
          rezdyBookingPayloadJson,
          paymentJson,
          customerJson,
          bookingStatus,
          paymentStatus,
          totalDue,
          totalPaid,
          handoffMode,
          handoffUrl,
          operatorAction
          ,notes
          ,followUpStatus
          ,operatorPaymentStep
          ,paymentRequestSentAt
        FROM orders
        ORDER BY createdAt DESC`
      )
      .all() as Array<Record<string, unknown>>;

    const mapped = rows.map((row) => {
      const booking = parseJson(row.bookingJson);
      const payment = parseJson(row.paymentJson);
      const customer = parseJson(row.customerJson);

      if (booking && typeof row.bookingStatus === "string") booking.status = row.bookingStatus;
      if (payment) {
        if (typeof row.paymentStatus === "string") payment.status = row.paymentStatus;
        if (typeof row.totalDue === "number") payment.totalDue = row.totalDue;
        if (typeof row.totalPaid === "number") payment.totalPaid = row.totalPaid;
        if (typeof row.handoffMode === "string") payment.handoffMode = row.handoffMode;
        if (typeof row.handoffUrl === "string") payment.handoffUrl = row.handoffUrl;
        if (typeof row.operatorAction === "string") payment.operatorAction = row.operatorAction;
      }

      return {
        internalOrderId: String(row.internalOrderId),
        createdAt: String(row.createdAt),
        lastTouchedAt: typeof row.lastTouchedAt === "string" ? row.lastTouchedAt : null,
        rezdyBookingReference:
          typeof row.rezdyBookingReference === "string" ? row.rezdyBookingReference : null,
        productCode: typeof row.productCode === "string" ? row.productCode : undefined,
        sessionKey: typeof row.sessionKey === "string" ? row.sessionKey : null,
        customer: customer ?? null,
        booking: booking ?? null,
        rezdyBookingPayload: parseJson(row.rezdyBookingPayloadJson) ?? null,
        payment: payment ?? null,
        notes: typeof row.notes === "string" ? row.notes : null,
        followUpStatus: asFollowUpStatus(row.followUpStatus),
        operatorPaymentStep: asOperatorPaymentStep(row.operatorPaymentStep),
        paymentRequestSentAt:
          typeof row.paymentRequestSentAt === "string" ? row.paymentRequestSentAt : null,
      };
    });
    if (mapped.length > 0) return mapped;
  } finally {
    db.close();
  }

  // Temporary fallback for legacy rows before full DB backfill.
  const raw = await readFile(orderLogPath(), "utf8").catch(() => "");
  if (!raw.trim()) return [];
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line) as Record<string, unknown>;
      } catch {
        return null;
      }
    })
    .filter((row): row is Record<string, unknown> => row !== null)
    .filter((row) => typeof row.internalOrderId === "string" && typeof row.createdAt === "string")
    .map((row) => ({
      internalOrderId: String(row.internalOrderId),
      createdAt: String(row.createdAt),
      lastTouchedAt: typeof row.lastTouchedAt === "string" ? row.lastTouchedAt : null,
      rezdyBookingReference:
        typeof row.rezdyBookingReference === "string" ? row.rezdyBookingReference : null,
      productCode: typeof row.productCode === "string" ? row.productCode : undefined,
      sessionKey: typeof row.sessionKey === "string" ? row.sessionKey : null,
      customer: readRecord(row.customer) ?? null,
      booking: readRecord(row.booking) ?? null,
      rezdyBookingPayload: readRecord(row.rezdyBookingPayload) ?? null,
      payment: readRecord(row.payment) ?? null,
      notes: typeof row.notes === "string" ? row.notes : null,
      followUpStatus: asFollowUpStatus(row.followUpStatus),
      operatorPaymentStep: asOperatorPaymentStep(row.operatorPaymentStep),
      paymentRequestSentAt:
        typeof row.paymentRequestSentAt === "string" ? row.paymentRequestSentAt : null,
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getInternalOrderByBookingReference(
  rezdyBookingReference: string
): Promise<InternalOrderRow | null> {
  const bookingRef = rezdyBookingReference.trim();
  if (!bookingRef) return null;

  const db = openDb();
  try {
    const row = db
      .prepare(
        `SELECT
          internalOrderId,
          createdAt,
          lastTouchedAt,
          rezdyBookingReference,
          productCode,
          sessionKey,
          bookingJson,
          rezdyBookingPayloadJson,
          paymentJson,
          customerJson,
          notes,
          followUpStatus,
          operatorPaymentStep,
          paymentRequestSentAt
        FROM orders
        WHERE rezdyBookingReference = ?
        ORDER BY createdAt DESC
        LIMIT 1`
      )
      .get(bookingRef) as Record<string, unknown> | undefined;

    if (!row) return null;

    return {
      internalOrderId: String(row.internalOrderId),
      createdAt: String(row.createdAt),
      lastTouchedAt: typeof row.lastTouchedAt === "string" ? row.lastTouchedAt : null,
      rezdyBookingReference:
        typeof row.rezdyBookingReference === "string" ? row.rezdyBookingReference : null,
      productCode: typeof row.productCode === "string" ? row.productCode : undefined,
      sessionKey: typeof row.sessionKey === "string" ? row.sessionKey : null,
      customer: parseJson(row.customerJson) ?? null,
      booking: parseJson(row.bookingJson) ?? null,
      rezdyBookingPayload: parseJson(row.rezdyBookingPayloadJson) ?? null,
      payment: parseJson(row.paymentJson) ?? null,
      notes: typeof row.notes === "string" ? row.notes : null,
      followUpStatus: asFollowUpStatus(row.followUpStatus),
      operatorPaymentStep: asOperatorPaymentStep(row.operatorPaymentStep),
      paymentRequestSentAt:
        typeof row.paymentRequestSentAt === "string" ? row.paymentRequestSentAt : null,
    };
  } finally {
    db.close();
  }
}

export async function updateInternalOrderOps(
  internalOrderId: string,
  input: { notes?: string; followUpStatus?: FollowUpStatus; markPaymentRequestSent?: boolean }
) {
  const db = openDb();
  try {
    const current = db
      .prepare(
        `SELECT notes, followUpStatus, operatorPaymentStep, paymentRequestSentAt
         FROM orders WHERE internalOrderId = ? LIMIT 1`
      )
      .get(internalOrderId) as
      | {
          notes?: string | null;
          followUpStatus?: string | null;
          operatorPaymentStep?: string | null;
          paymentRequestSentAt?: string | null;
        }
      | undefined;
    if (!current) return { ok: false as const, reason: "not_found" as const };

    const nextNotes = typeof input.notes === "string" ? input.notes.trim() : current.notes ?? null;
    const nextFollow = asFollowUpStatus(input.followUpStatus) ?? asFollowUpStatus(current.followUpStatus) ?? "new";
    const markSent = input.markPaymentRequestSent === true;
    const currentStep = asOperatorPaymentStep(current.operatorPaymentStep) ?? "none";
    const nextStep: OperatorPaymentStep = markSent
      ? currentStep === "paid"
        ? "paid"
        : "request_sent"
      : currentStep;
    const nextSentAt = markSent
      ? current.paymentRequestSentAt ?? new Date().toISOString()
      : current.paymentRequestSentAt ?? null;
    const nextFollowAdjusted: FollowUpStatus =
      markSent && nextFollow !== "resolved" ? "waiting" : nextFollow;

    const touchedAt = new Date().toISOString();
    db.prepare(
      `UPDATE orders
       SET notes = ?,
           followUpStatus = ?,
           operatorPaymentStep = ?,
           paymentRequestSentAt = ?,
           lastTouchedAt = ?
       WHERE internalOrderId = ?`
    ).run(
      nextNotes || null,
      nextFollowAdjusted,
      nextStep,
      nextSentAt,
      touchedAt,
      internalOrderId
    );
    return { ok: true as const };
  } finally {
    db.close();
  }
}
