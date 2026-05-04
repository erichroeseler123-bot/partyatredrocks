import Link from "next/link";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { listInternalOrders } from "@/lib/orders";
import { buildOpsSummary, groupOrdersByDay } from "@/lib/parr/ops/grouping";
import { normalizeInternalOrder } from "@/lib/parr/ops/normalize";
import { SHARED_DAILY_CAPACITY } from "@/lib/parr/fleet";
import type { OpsOrder } from "@/lib/parr/ops/types";
import {
  MARRIOTT_WEST_MANAGER_SESSION_COOKIE,
  getMarriottWestManagerActorLabel,
  isMarriottWestManagerAccessConfigured,
  isValidMarriottWestManagerSession,
} from "@/lib/marriottWestManagerAccess";
import {
  MARRIOTT_WEST_PICKUP_LABEL,
  buildMarriottWestSharedBookingHref,
  buildQrCodeUrl,
  isMarriottWestPickup,
} from "@/lib/parr/marriottWestManager";
import { siteOrigin } from "@/lib/square";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Marriott West Manager | Party at Red Rocks",
  robots: { index: false, follow: false },
};

const MANAGER_CONTACT_EMAIL = "mike.barrett@marriott.com";

type RedRocksShow = {
  isoDate: string;
  formattedDate: string;
  artist: string;
  support: string;
  time: string;
  startLocal: string | null;
};

function singleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

function isIsoDate(value: string | null | undefined) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
}

function parseShowStart(date: string, time: string) {
  const match = String(time).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[3].toUpperCase();
  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;
  return new Date(`${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`);
}

function parseShowStartLocal(raw: string | null) {
  if (!raw || !raw.includes("T")) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function addMinutes(value: Date | null, minutes: number) {
  if (!value) return null;
  return new Date(value.getTime() + minutes * 60 * 1000);
}

function formatTime(value: Date | null) {
  if (!value) return "TBD";
  return value.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatDateLabel(value: string) {
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function isFutureOrToday(value: string) {
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return value >= todayKey;
}

function formatTimeFromLocalString(value: string | null) {
  if (!value) return "TBD";
  const match = value.match(/T(\d{2}):(\d{2})/);
  if (!match) return "TBD";
  let hour = Number(match[1]);
  const minute = match[2];
  const meridiem = hour >= 12 ? "PM" : "AM";
  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;
  return `${hour}:${minute} ${meridiem}`;
}

async function loadRedRocksShows(): Promise<RedRocksShow[]> {
  const snapshotPath = path.join(process.cwd(), "data", "snapshots", "events", "redrocks-2026.json");
  const raw = await readFile(snapshotPath, "utf8");
  const parsed = JSON.parse(raw) as { events?: Array<Record<string, unknown>> };
  const events = Array.isArray(parsed.events) ? parsed.events : [];

  return events
    .filter((event) => typeof event?.dateKey === "string" && isIsoDate(String(event.dateKey)))
    .map((event) => {
      const date = String(event.dateKey);
      const artistNames = Array.isArray(event.artistNames)
        ? event.artistNames.filter((value): value is string => typeof value === "string" && value.trim().length > 0)
        : [];
      const support = artistNames.length > 1 ? artistNames.slice(1).join(", ") : "Lineup to be announced";
      const startLocal =
        typeof event.startLocal === "string"
          ? event.startLocal
          : typeof event.startAt === "string"
            ? event.startAt
            : null;
      return {
        isoDate: date,
        formattedDate: formatDateLabel(date),
        artist: typeof event.name === "string" && event.name.trim() ? event.name.trim() : "TBD Event",
        support,
        time: formatTimeFromLocalString(startLocal),
        startLocal,
      };
    })
    .sort((a, b) => a.isoDate.localeCompare(b.isoDate) || a.artist.localeCompare(b.artist));
}

function getDateOptions(shows: RedRocksShow[], orderDates: string[]) {
  const showDates = shows.map((show) => show.isoDate);
  const merged = Array.from(new Set([...showDates, ...orderDates.filter(Boolean)])).sort();
  return merged.map((date) => {
    const show = shows.find((entry) => entry.isoDate === date) || null;
    return {
      value: date,
      label: show ? `${show.formattedDate} - ${show.artist}` : formatDateLabel(date),
    };
  });
}

function countByProduct(orders: OpsOrder[]) {
  let sharedDenver = 0;
  let sharedGolden = 0;
  let privateRides = 0;
  for (const order of orders) {
    if (order.workflowState === "canceled") continue;
    if (order.productCode === "shared-denver") sharedDenver += order.seats;
    else if (order.productCode === "shared-golden") sharedGolden += order.seats;
    else privateRides += 1;
  }
  return { sharedDenver, sharedGolden, privateRides };
}

function getDateStatusCounts(orders: OpsOrder[]) {
  return {
    active: orders.filter((order) => order.workflowState !== "canceled").length,
    canceled: orders.filter((order) => order.workflowState === "canceled").length,
    paid: orders.filter((order) => order.paymentState === "paid").length,
    pending: orders.filter((order) => order.paymentState !== "paid" && order.workflowState !== "canceled").length,
    needsReview: orders.filter((order) => order.workflowState === "needs_review").length,
  };
}

function getBookingStatusCopy(selectedDate: string, hasShow: boolean) {
  if (!selectedDate || selectedDate === "all") {
    return "Choose a date to see the concert, timing, and anonymous hotel booking totals.";
  }
  if (hasShow && isFutureOrToday(selectedDate)) {
    return "Guests can still book for this show. Use the timing and load numbers below as the current hotel-facing answer sheet.";
  }
  if (hasShow) {
    return "This show date is in the past. Keep this page for historical load lookup only.";
  }
  return "No Red Rocks show was matched to this date in the current event snapshot.";
}

export default async function MarriottWestManagerPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (searchParams ? await searchParams : {}) || {};
  const requestedDate = singleValue(sp.date).trim();
  const nextParams = new URLSearchParams();
  if (requestedDate === "all" || isIsoDate(requestedDate)) {
    nextParams.set("date", requestedDate);
  }
  const nextPath = nextParams.toString() ? `/manager/marriott-west?${nextParams.toString()}` : "/manager/marriott-west";

  const cookieStore = await cookies();
  const session = cookieStore.get(MARRIOTT_WEST_MANAGER_SESSION_COOKIE)?.value || null;
  const configured = isMarriottWestManagerAccessConfigured();
  const authorized = configured && isValidMarriottWestManagerSession(session);

  if (!configured) {
    return (
      <main className="comic-page pt-24 pb-12">
        <section className="comic-wrap">
          <div className="comic-hero">
            <div className="comic-kicker">Marriott West Manager</div>
            <h1 className="comic-title">Manager Access Not Configured</h1>
            <p className="comic-copy">
              Set <code>MARRIOTT_WEST_MANAGER_ACCESS_KEY</code> in the Party at Red Rocks environment to enable this dashboard.
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="comic-page pt-24 pb-12">
        <section className="comic-wrap">
          <div className="comic-hero max-w-xl">
            <div className="comic-kicker">Marriott West Manager</div>
            <h1 className="comic-title">Unlock Dashboard</h1>
            <p className="comic-copy">Enter the Marriott West manager access key to continue.</p>
            <form action="/manager/marriott-west/unlock" method="post" className="mt-6 space-y-3">
              <input type="hidden" name="next" value={nextPath} />
              <input
                type="password"
                name="key"
                required
                placeholder="Manager access key"
                className="min-h-11 w-full rounded-xl border border-white/15 bg-[#0d1629] px-3 py-2 text-sm text-white outline-none"
              />
              <button
                type="submit"
                className="min-h-11 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black"
              >
                Unlock
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }
  const redRocksShows = await loadRedRocksShows();

  const hotelOrders = (await listInternalOrders())
    .map(normalizeInternalOrder)
    .filter((order) => isMarriottWestPickup(order.pickupLabel));

  const knownOrderDates = Array.from(new Set(hotelOrders.map((order) => order.serviceDate).filter(isIsoDate))) as string[];
  const dateOptions = getDateOptions(redRocksShows, knownOrderDates);
  const defaultDate =
    (dateOptions.find((option) => isFutureOrToday(option.value)) || dateOptions[0])?.value || "";
  const selectedDate = requestedDate === "all" ? "all" : isIsoDate(requestedDate) ? requestedDate : defaultDate;

  const scopedOrders =
    selectedDate && selectedDate !== "all"
      ? hotelOrders.filter((order) => order.serviceDate === selectedDate)
      : hotelOrders;

  const selectedShow =
    selectedDate && selectedDate !== "all"
      ? redRocksShows.find((show) => show.isoDate === selectedDate) || null
      : null;
  const showStart = selectedShow?.startLocal
    ? parseShowStartLocal(selectedShow.startLocal)
    : selectedShow
      ? parseShowStart(selectedShow.isoDate, selectedShow.time)
      : null;
  const doorsEstimate = addMinutes(showStart, -60);
  const pickupEstimate = addMinutes(showStart, -90);
  const hotelLoad = countByProduct(scopedOrders);
  const counts = getDateStatusCounts(scopedOrders);
  const summary = buildOpsSummary(scopedOrders);
  const dayGroups = groupOrdersByDay(scopedOrders);
  const bookingStatusCopy = getBookingStatusCopy(selectedDate, Boolean(selectedShow));
  const marriottWestBookingHref = buildMarriottWestSharedBookingHref();
  const marriottWestBookingUrl = `${siteOrigin()}${marriottWestBookingHref}`;
  const marriottWestQrUrl = buildQrCodeUrl(marriottWestBookingUrl);

  return (
    <main className="comic-page pt-24 pb-12">
      <section className="comic-wrap space-y-5">
        <div className="comic-hero">
          <div className="comic-kicker">Marriott West Manager</div>
          <h1 className="comic-title">Denver Marriott West Concert Dashboard</h1>
          <p className="comic-copy">
            Password-protected, read-only hotel dashboard for Party at Red Rocks bookings tied to {MARRIOTT_WEST_PICKUP_LABEL}.
          </p>
          <p className="mt-2 text-sm text-white/60">
            Signed in as {getMarriottWestManagerActorLabel(session)}. Manager contact: {MANAGER_CONTACT_EMAIL}.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Link href="/manager/marriott-west/logout" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-white/80 hover:bg-white/10">
              Log out
            </Link>
            <Link href="/book/red-rocks-amphitheatre/custom/shared" className="rounded-full border border-cyan-300/25 bg-cyan-400/15 px-4 py-2 text-cyan-50 hover:bg-cyan-400/20">
              Shared booking page
            </Link>
            <Link href="/book/red-rocks-amphitheatre/private" className="rounded-full border border-orange-300/25 bg-orange-400/15 px-4 py-2 text-orange-50 hover:bg-orange-400/20">
              Private booking page
            </Link>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.16em] text-orange-300">Date Selector</div>
            <form action="/manager/marriott-west" method="get" className="mt-4 flex flex-col gap-3 md:flex-row">
              <select
                name="date"
                defaultValue={selectedDate}
                className="min-h-11 flex-1 rounded-xl border border-white/15 bg-[#0d1629] px-3 text-sm text-white outline-none"
              >
                {dateOptions.length ? null : <option value="">No show dates found</option>}
                {dateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
                <option value="all">All booked dates</option>
              </select>
              <button type="submit" className="min-h-11 rounded-xl bg-white px-4 text-sm font-semibold text-black">
                Update
              </button>
            </form>
            <p className="mt-3 text-sm text-white/65">{bookingStatusCopy}</p>
          </div>

          <div className="rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-5">
            <div className="text-xs uppercase tracking-[0.16em] text-cyan-100/80">Privacy Boundary</div>
            <div className="mt-3 text-sm leading-7 text-cyan-50">
              No guest-sensitive information is shown here. This page does not expose names, emails, phone numbers, order IDs, booking references, cancellations, refunds, or inventory controls.
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,0.95fr)]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.16em] text-orange-300">Marriott West Booking Asset</div>
            <h2 className="mt-2 text-2xl font-black text-white">Public shared booking link</h2>
            <p className="mt-2 text-sm text-white/65">
              This opens the normal shared booking page with Marriott West preselected as the visible pickup option while still using west-side Golden capacity under the hood.
            </p>
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/80 break-all">
              {marriottWestBookingUrl}
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <Link href={marriottWestBookingHref} className="rounded-full border border-cyan-300/25 bg-cyan-400/15 px-4 py-2 text-cyan-50 hover:bg-cyan-400/20">
                Open Marriott West booking flow
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
            <div className="text-xs uppercase tracking-[0.16em] text-orange-300">QR Code</div>
            <p className="mt-2 text-sm text-white/65">Scan to open the Marriott West shared booking flow with the hotel pickup already selected.</p>
            <div className="mt-4 inline-flex w-full max-w-[252px] rounded-[24px] border border-white/10 bg-white p-4">
              <img
                src={marriottWestQrUrl}
                alt="QR code for the Marriott West shared booking flow"
                width="220"
                height="220"
                className="h-auto w-full max-w-[220px]"
              />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.16em] text-orange-300">Selected Show</div>
              <h2 className="mt-2 text-3xl font-black text-white">
                {selectedShow ? selectedShow.artist : selectedDate && selectedDate !== "all" ? formatDateLabel(selectedDate) : "All booked dates"}
              </h2>
              <p className="mt-2 text-sm text-white/65">
                {selectedShow
                  ? `${selectedShow.formattedDate}${selectedShow.support ? ` • Support: ${selectedShow.support}` : ""}`
                  : selectedDate && selectedDate !== "all"
                    ? "No matched concert found in the current Red Rocks event snapshot."
                    : "Choose a date above to see concert timing and anonymous hotel booking totals."}
              </p>
            </div>
            {selectedDate && selectedDate !== "all" ? (
              <div className="rounded-full border border-white/15 bg-black/20 px-4 py-2 text-sm text-white/80">
                Date: {formatDateLabel(selectedDate)}
              </div>
            ) : null}
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.14em] text-white/45">Show Time</div>
              <div className="mt-2 text-2xl font-black text-white">{selectedShow ? selectedShow.time : "TBD"}</div>
              <p className="mt-2 text-sm text-white/65">Current start time from the Red Rocks event snapshot.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.14em] text-white/45">Doors Estimate</div>
              <div className="mt-2 text-2xl font-black text-white">{formatTime(doorsEstimate)}</div>
              <p className="mt-2 text-sm text-white/65">Estimated as one hour before the listed show start.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.14em] text-white/45">Marriott West Pickup Estimate</div>
              <div className="mt-2 text-2xl font-black text-white">{formatTime(pickupEstimate)}</div>
              <p className="mt-2 text-sm text-white/65">Current planning estimate from the live booking schedule. Final driver text always wins.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.14em] text-white/45">Hotel Pickups On Board</div>
              <div className="mt-2 text-2xl font-black text-white">{counts.active}</div>
              <p className="mt-2 text-sm text-white/65">Anonymous active Marriott West bookings currently saved for this date.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
              <div className="text-xs uppercase tracking-[0.14em] text-emerald-100/80">Paid</div>
              <div className="mt-2 text-xl font-black text-white">{counts.paid}</div>
            </div>
            <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
              <div className="text-xs uppercase tracking-[0.14em] text-amber-100/80">Pending / Unpaid</div>
              <div className="mt-2 text-xl font-black text-white">{counts.pending}</div>
            </div>
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4">
              <div className="text-xs uppercase tracking-[0.14em] text-cyan-100/80">Denver Shared Seats</div>
              <div className="mt-2 text-xl font-black text-white">
                {hotelLoad.sharedDenver} / {SHARED_DAILY_CAPACITY.denver}
              </div>
            </div>
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4">
              <div className="text-xs uppercase tracking-[0.14em] text-cyan-100/80">Golden Shared Seats</div>
              <div className="mt-2 text-xl font-black text-white">
                {hotelLoad.sharedGolden} / {SHARED_DAILY_CAPACITY.golden}
              </div>
            </div>
            <div className="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 p-4">
              <div className="text-xs uppercase tracking-[0.14em] text-fuchsia-100/80">Private Ride Requests</div>
              <div className="mt-2 text-xl font-black text-white">{hotelLoad.privateRides}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.16em] text-orange-300">Today’s Anonymous Summary</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-[0.14em] text-white/45">Needs Review</div>
                <div className="mt-2 text-2xl font-black text-white">{counts.needsReview}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-[0.14em] text-white/45">Canceled</div>
                <div className="mt-2 text-2xl font-black text-white">{counts.canceled}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-[0.14em] text-white/45">Total Units</div>
                <div className="mt-2 text-2xl font-black text-white">{summary.totalSeats}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-[0.14em] text-white/45">Total Active Orders</div>
                <div className="mt-2 text-2xl font-black text-white">{summary.totalOrders}</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.16em] text-orange-300">Booked Dates Overview</div>
            <div className="mt-4 space-y-3">
              {dayGroups.length ? (
                dayGroups.map((day) => {
                  const dayCounts = getDateStatusCounts(day.orders);
                  const dayLoad = countByProduct(day.orders);
                  return (
                    <div key={day.key} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {day.serviceDate === "unscheduled" ? "Unscheduled" : formatDateLabel(day.serviceDate)}
                          </div>
                          <div className="mt-1 text-xs text-white/50">
                            {dayCounts.active} active • {dayCounts.paid} paid • {dayCounts.pending} pending
                          </div>
                        </div>
                        <Link
                          href={`/manager/marriott-west?date=${encodeURIComponent(day.serviceDate)}`}
                          className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 hover:bg-white/10"
                        >
                          Open date
                        </Link>
                      </div>
                      <div className="mt-3 grid gap-2 sm:grid-cols-3 text-sm text-white/72">
                        <div>Denver seats: {dayLoad.sharedDenver}</div>
                        <div>Golden seats: {dayLoad.sharedGolden}</div>
                        <div>Private rides: {dayLoad.privateRides}</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
                  No Marriott West bookings found for the selected scope.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
