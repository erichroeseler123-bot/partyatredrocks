import BrandMark from "@/components/BrandMark";
import { getInternalOrderByAnyReference } from "@/lib/orders";
import { PARR_PUBLIC_FACTS } from "@/lib/publicOperatorFacts";
import { squareApplicationId, squareLocationId, squareWebSdkUrl } from "@/lib/square";
import PayBalanceForm from "./PayBalanceForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
}

function formatDate(value: unknown) {
  const raw = readString(value);
  if (!raw) return "TBD";
  const parsed = new Date(`${raw}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return raw;
  return parsed.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function customerName(customer: Record<string, unknown> | null | undefined) {
  return [readString(customer?.firstName), readString(customer?.lastName)]
    .filter(Boolean)
    .join(" ") || readString(customer?.name) || readString(customer?.email) || "Guest";
}

function serviceDate(order: Awaited<ReturnType<typeof getInternalOrderByAnyReference>>) {
  if (!order) return null;
  return (
    readString(order.rezdyBookingPayload?.dateKey) ||
    readString(order.rezdyBookingPayload?.date) ||
    readString(order.booking?.date) ||
    readString(order.booking?.eventDate)
  );
}

export default async function PayBalancePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const order = await getInternalOrderByAnyReference(token);

  if (!order) {
    return (
      <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
        <section className="mx-auto max-w-3xl rounded-[30px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-8">
          <BrandMark className="mb-4" variant="booking" />
          <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[#ffb07c]">Pay Balance</div>
          <h1 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white">Booking not found</h1>
          <p className="mt-4 text-white/72">
            That payment link does not match an active Party at Red Rocks booking. Text {PARR_PUBLIC_FACTS.support.phoneDisplay} and include this code: {token}.
          </p>
        </section>
      </main>
    );
  }

  const totalDue = readNumber(order.payment?.totalDue);
  const totalPaid = readNumber(order.payment?.totalPaid);
  const remainingDue = Math.max(0, totalDue - totalPaid);
  const paid = order.payment?.status === "paid" || remainingDue <= 0;
  const date = serviceDate(order);
  const pickup =
    readString(order.pickup?.label) ||
    readString(order.pickup?.address) ||
    readString(order.pickup?.location) ||
    readString(order.rezdyBookingPayload?.pickupHub) ||
    "Pickup details on booking";
  const rideLabel =
    readString(order.booking?.productTitle) ||
    readString(order.rezdyBookingPayload?.option) ||
    readString(order.productCode) ||
    "Party at Red Rocks ride";

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl">
        <div className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-8">
          <BrandMark className="mb-4" variant="booking" />
          <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[#ffb07c]">Pay Balance</div>
          <h1 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white">Finish Your Shuttle Payment</h1>
          <p className="mt-4 max-w-2xl text-white/72">
            This link is tied to your existing Party at Red Rocks booking. Use it to complete payment without starting over.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-5 text-sm text-white/76">
              <div><span className="font-black text-white">Booking:</span> {order.internalOrderId}</div>
              <div className="mt-2"><span className="font-black text-white">Name:</span> {customerName(order.customer)}</div>
              <div className="mt-2"><span className="font-black text-white">Ride:</span> {rideLabel}</div>
              <div className="mt-2"><span className="font-black text-white">Date:</span> {formatDate(date)}</div>
              <div className="mt-2"><span className="font-black text-white">Pickup:</span> {pickup}</div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-5 text-sm text-white/76">
              <div><span className="font-black text-white">Total:</span> {formatMoney(totalDue)}</div>
              <div className="mt-2"><span className="font-black text-white">Paid:</span> {formatMoney(totalPaid)}</div>
              <div className="mt-2"><span className="font-black text-white">Remaining:</span> {formatMoney(remainingDue)}</div>
              <div className="mt-2"><span className="font-black text-white">Status:</span> {paid ? "Paid" : "Unpaid"}</div>
            </div>
          </div>

          {paid ? (
            <div className="mt-6 rounded-[22px] border border-emerald-300/25 bg-emerald-500/10 p-5 text-sm text-emerald-100">
              This booking is already paid. No remaining balance is due.
            </div>
          ) : (
            <PayBalanceForm
              token={token}
              amountLabel={formatMoney(remainingDue)}
              squareAppId={squareApplicationId()}
              squareLocationId={squareLocationId()}
              squareSdkUrl={squareWebSdkUrl()}
            />
          )}

          <p className="mt-5 text-sm leading-6 text-white/62">
            Still seeing a card error? Text {PARR_PUBLIC_FACTS.support.phoneDisplay} and include booking {order.internalOrderId}.
          </p>
        </div>
      </section>
    </main>
  );
}
