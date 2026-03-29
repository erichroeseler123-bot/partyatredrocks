import 'server-only';

import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { InternalOrderRow } from '@/lib/orders';
import { blobReadText, blobWriteText } from '@/lib/blobJson';

type LedgerOptions = {
  eventType?: string;
};

const BOOKING_LEDGER_BLOB_PATH = 'cache/orders/booking-ledger.csv';
const HEADER = [
  'recorded_at',
  'event_type',
  'internal_order_id',
  'display_order_number',
  'booking_token',
  'square_order_id',
  'booking_status',
  'payment_status',
  'customer_name',
  'customer_email',
  'customer_phone',
  'pickup_hub',
  'show_date',
  'seat_count',
  'artist',
  'total_due',
  'total_paid',
].join(',');

function ledgerPath() {
  if (process.env.BOOKING_LEDGER_PATH) return process.env.BOOKING_LEDGER_PATH;
  return path.join(process.cwd(), 'data', 'orders', 'booking-ledger.csv');
}

function useBlobLedger() {
  return process.env.VERCEL === '1' && !!process.env.BLOB_READ_WRITE_TOKEN;
}

function csvCell(value: unknown) {
  const text = value == null ? '' : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function displayOrderNumber(order: InternalOrderRow) {
  const booking = order.booking ?? {};
  const payment = order.payment ?? {};
  const bookingOrderNumber = typeof booking.orderNumber === 'string' ? booking.orderNumber.trim() : '';
  if (bookingOrderNumber) return bookingOrderNumber;
  const squareOrderId = typeof payment.squareOrderId === 'string' ? payment.squareOrderId.trim() : '';
  if (squareOrderId) return squareOrderId;
  return order.internalOrderId;
}

function customerName(order: InternalOrderRow) {
  const customer = order.customer ?? {};
  const first = typeof customer.firstName === 'string' ? customer.firstName.trim() : '';
  const last = typeof customer.lastName === 'string' ? customer.lastName.trim() : '';
  return `${first} ${last}`.trim();
}

function toLedgerLine(order: InternalOrderRow, options?: LedgerOptions) {
  const customer = order.customer ?? {};
  const booking = order.booking ?? {};
  const payment = order.payment ?? {};
  const pickup = order.rezdyBookingPayload ?? order.booking ?? {};

  return [
    csvCell(new Date().toISOString()),
    csvCell(options?.eventType ?? 'booking_created'),
    csvCell(order.internalOrderId),
    csvCell(displayOrderNumber(order)),
    csvCell(order.bookingToken ?? ''),
    csvCell(typeof payment.squareOrderId === 'string' ? payment.squareOrderId : ''),
    csvCell(typeof booking.status === 'string' ? booking.status : ''),
    csvCell(typeof payment.status === 'string' ? payment.status : ''),
    csvCell(customerName(order)),
    csvCell(typeof customer.email === 'string' ? customer.email : ''),
    csvCell(typeof customer.phone === 'string' ? customer.phone : ''),
    csvCell(typeof pickup.pickupHub === 'string' ? pickup.pickupHub : ''),
    csvCell(typeof pickup.date === 'string' ? pickup.date : typeof pickup.dateKey === 'string' ? pickup.dateKey : ''),
    csvCell(typeof pickup.qty === 'number' ? pickup.qty : ''),
    csvCell(typeof pickup.artist === 'string' ? pickup.artist : ''),
    csvCell(typeof payment.totalDue === 'number' ? payment.totalDue.toFixed(2) : ''),
    csvCell(typeof payment.totalPaid === 'number' ? payment.totalPaid.toFixed(2) : ''),
  ].join(',');
}

function hasInternalOrder(csv: string, internalOrderId: string) {
  const needle = `"${internalOrderId.replaceAll('"', '""')}"`;
  return csv.split('\n').some((line) => line.includes(needle));
}

export async function appendBookingLedgerRow(order: InternalOrderRow, options?: LedgerOptions) {
  const line = toLedgerLine(order, options);

  if (useBlobLedger()) {
    const current = (await blobReadText(BOOKING_LEDGER_BLOB_PATH, { revalidateSeconds: 0 }).catch(() => null)) ?? '';
    if (hasInternalOrder(current, order.internalOrderId)) return;
    const next = current.trim()
      ? `${current.trimEnd()}\n${line}\n`
      : `${HEADER}\n${line}\n`;
    await blobWriteText(BOOKING_LEDGER_BLOB_PATH, next, {
      cacheControlMaxAge: 60,
      contentType: 'text/csv; charset=utf-8',
    });
    return;
  }

  const filePath = ledgerPath();
  await mkdir(path.dirname(filePath), { recursive: true });
  const current = await readFile(filePath, 'utf8').catch(() => '');
  if (hasInternalOrder(current, order.internalOrderId)) return;
  if (!current.trim()) {
    await writeFile(filePath, `${HEADER}\n${line}\n`, 'utf8');
    return;
  }
  await appendFile(filePath, `${line}\n`, 'utf8');
}
