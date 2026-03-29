import "server-only";

import type { InternalOrderRow } from "@/lib/orders";
import { PARR_PUBLIC_FACTS } from "@/lib/publicOperatorFacts";
import { siteOrigin } from "@/lib/square";

function bookingLink(order: InternalOrderRow) {
  if (!order.bookingToken) return null;
  return `${siteOrigin()}/booking/${encodeURIComponent(order.bookingToken)}`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function displayOrderNumber(order: InternalOrderRow) {
  const booking = order.booking ?? {};
  const payment = order.payment ?? {};

  const bookingOrderNumber = typeof booking.orderNumber === "string" ? booking.orderNumber.trim() : "";
  if (bookingOrderNumber) return bookingOrderNumber;

  const squareOrderId = typeof payment.squareOrderId === "string" ? payment.squareOrderId.trim() : "";
  if (squareOrderId) return squareOrderId;

  return order.internalOrderId;
}

function renderEmail(order: InternalOrderRow) {
  const customer = order.customer ?? {};
  const firstName = typeof customer.firstName === "string" && customer.firstName.trim() ? customer.firstName.trim() : "there";
  const manageUrl = bookingLink(order);
  const supportPhone = PARR_PUBLIC_FACTS.support.phoneDisplay;
  const supportEmail = PARR_PUBLIC_FACTS.support.email;
  const orderNumber = displayOrderNumber(order);

  return {
    subject: "Your Red Rocks Show Night Itinerary",
    html: `<div style="margin:0;padding:32px 16px;background:#f4efe8">
      <div style="max-width:640px;margin:0 auto;font-family:Arial,sans-serif;color:#0f172a">
        <div style="overflow:hidden;border-radius:28px;background:#081120;border:1px solid rgba(255,255,255,0.08);box-shadow:0 24px 80px rgba(15,23,42,0.18)">
          <div style="padding:32px;background:linear-gradient(135deg,rgba(255,176,124,0.22),rgba(8,17,32,0.96) 55%,rgba(143,208,255,0.16));color:#fff">
            <div style="font-size:11px;font-weight:900;letter-spacing:0.22em;text-transform:uppercase;color:#8fd0ff">Party at Red Rocks</div>
            <h1 style="margin:16px 0 0;font-size:32px;line-height:1.05;text-transform:uppercase;letter-spacing:-0.04em">Your show night itinerary is ready.</h1>
            <p style="margin:16px 0 0;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.78)">Hi ${escapeHtml(firstName)}, your shuttle is confirmed. Head back to your booking page for the full Red Rocks game plan.</p>
          </div>

          <div style="padding:28px;background:#ffffff">
            <div style="border:1px solid rgba(15,23,42,0.08);border-radius:22px;padding:20px;background:#fffaf5">
              <div style="font-size:11px;font-weight:900;letter-spacing:0.18em;text-transform:uppercase;color:#64748b">Order Number</div>
              <div style="margin-top:8px;color:#0f172a;font-size:20px;font-weight:900;line-height:1.3">${escapeHtml(orderNumber)}</div>
            </div>

            ${manageUrl ? `<div style="margin-top:20px">
              <a href="${manageUrl}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#0f172a;color:#ffffff;font-size:13px;font-weight:900;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none">Open Your Show Night Itinerary</a>
            </div>` : ""}

            <div style="margin-top:22px;border:1px solid rgba(15,23,42,0.08);border-radius:22px;padding:20px;background:#f8fafc">
              <div style="font-size:11px;font-weight:900;letter-spacing:0.18em;text-transform:uppercase;color:#64748b">Need Help?</div>
              <div style="margin-top:14px;font-size:14px;line-height:1.8;color:#334155">
                <div style="margin-bottom:8px">Text ${escapeHtml(supportPhone)}</div>
                <div>Email <a href="mailto:${escapeHtml(supportEmail)}" style="color:#0f172a">${escapeHtml(supportEmail)}</a></div>
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
