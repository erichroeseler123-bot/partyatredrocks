import { NextRequest, NextResponse } from "next/server";
import { MARRIOTT_WEST_MANAGER_SESSION_COOKIE } from "@/lib/marriottWestManagerAccess";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/manager/marriott-west", request.url));
  response.cookies.set({
    name: MARRIOTT_WEST_MANAGER_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/manager/marriott-west",
    maxAge: 0,
  });
  return response;
}
