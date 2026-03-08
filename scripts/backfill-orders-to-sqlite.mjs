#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

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
  return db;
}

function asRecord(value) {
  return value && typeof value === "object" ? value : null;
}

function asString(value) {
  return typeof value === "string" && value.trim() ? value : null;
}

function asNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asJson(value) {
  return JSON.stringify(value ?? null);
}

function customerName(customer) {
  const c = asRecord(customer);
  if (!c) return null;
  const first = asString(c.firstName) ?? "";
  const last = asString(c.lastName) ?? "";
  const name = `${first} ${last}`.trim();
  return name || null;
}

function customerEmail(customer) {
  const c = asRecord(customer);
  if (!c) return null;
  return asString(c.email);
}

function normalizePaymentStatus(value) {
  const raw = asString(value);
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if (lower === "paid") return "paid";
  if (lower === "unpaid") return "unpaid";
  if (lower === "partial") return "partial";
  if (lower.includes("unpaid") || lower.includes("not_paid") || lower.includes("payment_due")) {
    return "unpaid";
  }
  if (lower.includes("partial")) return "partial";
  if (lower.includes("paid")) return "paid";
  return lower;
}

async function main() {
  const logPath = orderLogPath();
  const raw = await readFile(logPath, "utf8").catch(() => "");
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const db = openDb();
  let inserted = 0;
  let skipped = 0;
  let malformed = 0;
  try {
    const insert = db.prepare(
      `INSERT OR IGNORE INTO orders (
        internalOrderId, createdAt, lastTouchedAt, rezdyBookingReference, productCode, sessionKey,
        customerName, customerEmail, customerJson, bookingStatus, paymentStatus,
        totalDue, totalPaid, handoffMode, handoffUrl, operatorAction, notes, followUpStatus,
        operatorPaymentStep, paymentRequestSentAt, bookingJson, paymentJson, pickupJson, rezdyBookingPayloadJson
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    for (const line of lines) {
      let row;
      try {
        row = JSON.parse(line);
      } catch {
        malformed += 1;
        continue;
      }

      const rec = asRecord(row);
      if (!rec) {
        malformed += 1;
        continue;
      }

      const internalOrderId = asString(rec.internalOrderId);
      const createdAt = asString(rec.createdAt);
      if (!internalOrderId || !createdAt) {
        skipped += 1;
        continue;
      }

      const customer = asRecord(rec.customer);
      const booking = asRecord(rec.booking);
      const payment = asRecord(rec.payment);
      const pickup = asRecord(rec.pickup);
      const rezdyBookingPayload = asRecord(rec.rezdyBookingPayload);

      const bookingStatus = asString(booking?.status);
      const paymentStatus = normalizePaymentStatus(payment?.status);
      const totalDue = asNumber(payment?.totalDue);
      const totalPaid = asNumber(payment?.totalPaid);
      const handoffMode = asString(payment?.handoffMode);
      const handoffUrl = asString(payment?.handoffUrl);
      const operatorAction = asString(payment?.operatorAction);

      const result = insert.run(
        internalOrderId,
        createdAt,
        asString(rec.lastTouchedAt) ?? createdAt,
        asString(rec.rezdyBookingReference),
        asString(rec.productCode) ?? "unknown",
        asString(rec.sessionKey),
        customerName(customer),
        customerEmail(customer),
        asJson(customer),
        bookingStatus,
        paymentStatus,
        totalDue,
        totalPaid,
        handoffMode,
        handoffUrl,
        operatorAction,
        asString(rec.notes),
        asString(rec.followUpStatus),
        asString(rec.operatorPaymentStep),
        asString(rec.paymentRequestSentAt),
        asJson(booking),
        asJson(payment),
        asJson(pickup),
        asJson(rezdyBookingPayload)
      );

      if (result.changes > 0) inserted += 1;
      else skipped += 1;
    }

    const countRow = db.prepare(`SELECT COUNT(*) AS count FROM orders`).get();
    const count = typeof countRow?.count === "number" ? countRow.count : 0;
    console.log(
      JSON.stringify(
        {
          orderDbPath: orderDbPath(),
          orderLogPath: logPath,
          inserted,
          skipped,
          malformed,
          totalRows: count,
        },
        null,
        2
      )
    );
  } finally {
    db.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
