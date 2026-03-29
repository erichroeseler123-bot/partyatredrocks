import "server-only";

import type { InternalOrderRow } from "@/lib/orders";
import { PARR_PUBLIC_FACTS } from "@/lib/publicOperatorFacts";
import { siteOrigin } from "@/lib/square";

function bookingLink(order: InternalOrderRow) {
  if (!order.bookingToken) return null;
  return `${siteOrigin()}/booking/${encodeURIComponent(order.bookingToken)}`;
}

function titleCasePickup(value: string | undefined) {
  if (!value) return null;
  return value === "golden" ? "Golden" : value === "denver" ? "Denver" : value;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDate(value: string | undefined) {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function moneyLabel(value: number | undefined) {
  return typeof value === "number" ? `$${value.toFixed(2)}` : null;
}

function detailRow(label: string, value: string | null) {
  if (!value) return "";
  return `<tr>
    <td style="padding:0 0 12px;color:#6b7280;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase">${escapeHtml(label)}</td>
    <td style="padding:0 0 12px;color:#0f172a;font-size:15px;font-weight:700;text-align:right">${escapeHtml(value)}</td>
  </tr>`;
}

function renderEmail(order: InternalOrderRow) {
  const customer = order.customer ?? {};
  const pickup = order.rezdyBookingPayload ?? order.booking ?? {};
  const payment = order.payment ?? {};
  const firstName = typeof customer.firstName === "string" && customer.firstName.trim() ? customer.firstName.trim() : "there";
  const qty = typeof pickup.qty === "number" ? pickup.qty : undefined;
  const date = formatDate(typeof pickup.date === "string" ? pickup.date : undefined);
  const hub = titleCasePickup(typeof pickup.pickupHub === "string" ? pickup.pickupHub : undefined);
  const artist = typeof pickup.artist === "string" ? pickup.artist : undefined;
  const totalPaid = typeof payment.totalPaid === "number" ? payment.totalPaid : undefined;
  const manageUrl = bookingLink(order);
  const supportPhone = PARR_PUBLIC_FACTS.support.phoneDisplay;
  const supportEmail = PARR_PUBLIC_FACTS.support.email;

  return {
    subject: `Your Red Rocks Shuttle is Confirmed${artist ? ` for ${artist}` : ""}`,
    html: `<div style="margin:0;padding:32px 16px;background:#f4efe8">
      <div style="max-width:640px;margin:0 auto;font-family:Arial,sans-serif;color:#0f172a">
        <div style="overflow:hidden;border-radius:28px;background:#081120;border:1px solid rgba(255,255,255,0.08);box-shadow:0 24px 80px rgba(15,23,42,0.18)">
          <div style="padding:32px;background:linear-gradient(135deg,rgba(255,176,124,0.22),rgba(8,17,32,0.96) 55%,rgba(143,208,255,0.16));color:#fff">
            <div style="font-size:11px;font-weight:900;letter-spacing:0.22em;text-transform:uppercase;color:#8fd0ff">Party at Red Rocks</div>
            <h1 style="margin:16px 0 0;font-size:32px;line-height:1.05;text-transform:uppercase;letter-spacing:-0.04em">Your shuttle is confirmed.</h1>
            <p style="margin:16px 0 0;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.78)">Hi ${escapeHtml(firstName)}, your ride is locked in. Keep this email handy for your pickup details and booking link.</p>
          </div>

          <div style="padding:28px;background:#ffffff">
            <div style="border:1px solid rgba(15,23,42,0.08);border-radius:22px;padding:20px 20px 8px;background:#fffaf5">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
                ${detailRow("Show", artist ? artist : null)}
                ${detailRow("Date", date)}
                ${detailRow("Pickup", hub)}
                ${detailRow("Seats", typeof qty === "number" ? String(qty) : null)}
                ${detailRow("Paid", moneyLabel(totalPaid))}
              </table>
            </div>

            ${manageUrl ? `<div style="margin-top:20px">
              <a href="${manageUrl}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#0f172a;color:#ffffff;font-size:13px;font-weight:900;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none">Open Booking Page</a>
            </div>
            <p style="margin:14px 0 0;font-size:14px;line-height:1.7;color:#475569">Use your booking page to review your ride, manage changes, and keep the live link for show night.</p>` : ""}

            <div style="margin-top:22px;border:1px solid rgba(15,23,42,0.08);border-radius:22px;padding:20px;background:#f8fafc">
              <div style="font-size:11px;font-weight:900;letter-spacing:0.18em;text-transform:uppercase;color:#64748b">What happens next</div>
              <div style="margin-top:14px;font-size:14px;line-height:1.8;color:#334155">
                <div style="margin-bottom:8px">Arrive 10-15 minutes early at your pickup hub.</div>
                <div style="margin-bottom:8px">Your return ride after the show is already built into this booking.</div>
                <div>Questions before the show? Text ${escapeHtml(supportPhone)} or email <a href="mailto:${escapeHtml(supportEmail)}" style="color:#0f172a">${escapeHtml(supportEmail)}</a>.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`,
  };
}

export async function sendSharedBookingConfirmation(order: InternalOrderRow | null) {
  if (!order?.customer) return { sent: false as const, reason: "missing_order" as const };
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.SHARED_CONFIRM_FROM_EMAIL?.trim();
  const to = typeof order.customer.email === "string" ? order.customer.email.trim() : "";
  if (!apiKey || !from || !to) {
    return { sent: false as const, reason: "missing_config" as const };
  }

  const email = renderEmail(order);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: email.subject,
      html: email.html,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Resend email failed: ${text || res.status}`);
  }

  return { sent: true as const };
}
