import { NextResponse } from "next/server";
import { rezdyGetAvailability } from "@/lib/rezdy";

export const runtime = "nodejs";

type UiSession = {
  sessionKey: string;
  startTimeLocal: string | null;
  endTimeLocal: string | null;
  seatsAvailable: number | null;
  priceLabel: string | null;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productCode = searchParams.get("productCode");
  if (!productCode) {
    return NextResponse.json({ error: "Missing productCode" }, { status: 400 });
  }

  const query = new URLSearchParams();
  query.set("productCode", productCode);

  const optionalKeys = ["startTimeLocal", "endTimeLocal", "startTime", "endTime", "qty", "optionId"];
  for (const key of optionalKeys) {
    const value = searchParams.get(key);
    if (value) query.set(key, value);
  }

  try {
    const sessions = await rezdyGetAvailability(query);
    const uiSessions: UiSession[] = sessions.map((session, index) => {
      const startTimeLocal =
        typeof session.startTimeLocal === "string"
          ? session.startTimeLocal
          : typeof session.startTime === "string"
            ? session.startTime
            : null;
      const endTimeLocal =
        typeof session.endTimeLocal === "string"
          ? session.endTimeLocal
          : typeof session.endTime === "string"
            ? session.endTime
            : null;
      const seatsAvailable = typeof session.seatsAvailable === "number" ? session.seatsAvailable : null;
      const price = typeof session.price === "number" ? session.price : null;
      const sessionId = typeof session.sessionId === "string" ? session.sessionId : null;
      const sessionKey = sessionId || startTimeLocal || `${productCode}-${index}`;

      return {
        sessionKey,
        startTimeLocal,
        endTimeLocal,
        seatsAvailable,
        priceLabel: price !== null ? `$${price.toFixed(2)}` : null,
      };
    });
    return NextResponse.json({ sessions: uiSessions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch Rezdy availability";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
