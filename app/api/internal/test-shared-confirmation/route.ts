import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Body = {
  to?: string;
};

function requiredString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.PARR_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.SHARED_CONFIRM_FROM_EMAIL?.trim();
  const to = requiredString(body.to);

  if (!apiKey || !from) {
    return NextResponse.json({ error: "Missing Resend configuration" }, { status: 500 });
  }

  if (!to) {
    return NextResponse.json({ error: "Missing recipient email" }, { status: 400 });
  }

  const sentAt = new Date().toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Denver",
  });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Party at Red Rocks sender test",
      html: `<div style="font-family:Arial,sans-serif;padding:24px;line-height:1.6;color:#0f172a">
        <h1 style="margin:0 0 12px;font-size:24px">Sender test</h1>
        <p style="margin:0 0 12px">This is a test email from the shared confirmation sender configuration.</p>
        <p style="margin:0"><strong>From:</strong> ${from}</p>
        <p style="margin:0"><strong>Sent:</strong> ${sentAt}</p>
      </div>`,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return NextResponse.json({ error: `Resend email failed: ${text || res.status}` }, { status: 500 });
  }

  const payload = await res.json().catch(() => null);
  return NextResponse.json({ ok: true, from, to, resend: payload });
}
