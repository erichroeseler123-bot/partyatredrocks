"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { getBookingVenueImage } from "@/data/media";

type RideType = "private" | "shared";
type PrivateVehicleKey = "suv" | "van" | "sprinter" | "party-bus";

type VehicleOption = {
  key: PrivateVehicleKey;
  title: string;
  checkoutProduct: string;
  basePrice: string;
  capacity: string;
  copy: string;
};

const VEHICLE_OPTIONS: VehicleOption[] = [
  {
    key: "suv",
    title: "Suburban SUV",
    checkoutProduct: "parr-suburban",
    basePrice: "$499",
    capacity: "Up to 6 guests",
    copy: "Best for couples and smaller groups who want one clean private plan.",
  },
  {
    key: "van",
    title: "10 Passenger Van",
    checkoutProduct: "parr-van-10",
    basePrice: "$599",
    capacity: "Up to 10 guests",
    copy: "Simple group option with one pickup and one return plan.",
  },
  {
    key: "sprinter",
    title: "14 Passenger Sprinter",
    checkoutProduct: "parr-sprinter-14",
    basePrice: "$799",
    capacity: "Up to 14 guests",
    copy: "Great for larger crews that still want one coordinated vehicle.",
  },
  {
    key: "party-bus",
    title: "24 Passenger Party Bus",
    checkoutProduct: "parr-party-bus-24",
    basePrice: "$1199",
    capacity: "Up to 24 guests",
    copy: "Largest private option for full-group event nights.",
  },
];

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseTimeToMinutes(value: string) {
  const [hoursRaw, minutesRaw] = value.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return hours * 60 + minutes;
}

function formatTimeLabel(value: string) {
  const minutes = parseTimeToMinutes(value);
  if (minutes === null) return value;
  const hour24 = Math.floor(minutes / 60) % 24;
  const minute = minutes % 60;
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function StepCard({
  number,
  title,
  description,
  complete,
  children,
}: {
  number: number;
  title: string;
  description: string;
  complete?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.96),rgba(6,9,18,0.96))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.4)] sm:p-8">
      <div className="flex items-start gap-4">
        <div
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-sm font-black",
            complete
              ? "border-emerald-300/50 bg-emerald-400/20 text-emerald-100"
              : "border-[#8fd0ff]/45 bg-[#8fd0ff]/12 text-[#8fd0ff]",
          ].join(" ")}
        >
          #{number}
        </div>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/72 sm:text-[15px]">{description}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function QuickRedRocksPage() {
  const today = useMemo(() => new Date(), []);
  const hero = getBookingVenueImage("red-rocks-amphitheatre");

  const [rideType, setRideType] = useState<RideType>("private");
  const [selectedVehicle, setSelectedVehicle] = useState<PrivateVehicleKey>("suv");
  const [vehicleQty, setVehicleQty] = useState(1);
  const [riderQty, setRiderQty] = useState(2);
  const [serviceDate, setServiceDate] = useState(toIsoDate(today));
  const [pickupTime, setPickupTime] = useState("16:30");
  const [expectedReturnTime, setExpectedReturnTime] = useState("00:00");
  const [specialRequests, setSpecialRequests] = useState("");
  const [checkoutReady, setCheckoutReady] = useState(false);

  const selectedVehicleMeta = VEHICLE_OPTIONS.find((vehicle) => vehicle.key === selectedVehicle) || VEHICLE_OPTIONS[0];

  const overage = useMemo(() => {
    const pickupMinutes = parseTimeToMinutes(pickupTime);
    const returnMinutes = parseTimeToMinutes(expectedReturnTime);
    if (pickupMinutes === null || returnMinutes === null) {
      return { durationHours: 0, overageHours: 0, overageAmount: 0 };
    }

    let totalMinutes = returnMinutes - pickupMinutes;
    if (totalMinutes <= 0) totalMinutes += 24 * 60;

    const durationHours = totalMinutes / 60;
    const overageHours = Math.max(0, Math.ceil(durationHours - 8));
    const overageAmount = overageHours * 100;

    return {
      durationHours,
      overageHours,
      overageAmount,
    };
  }, [expectedReturnTime, pickupTime]);

  const privateCheckoutHref = useMemo(() => {
    const params = new URLSearchParams({
      route: "parr-private",
      product: selectedVehicleMeta.checkoutProduct,
      qty: String(vehicleQty),
      date: serviceDate,
      pickup_time: pickupTime,
      expected_return_time: expectedReturnTime,
      notes: specialRequests.trim(),
      overage_estimate_hours: String(overage.overageHours),
      overage_estimate_amount: String(overage.overageAmount),
    });

    return `https://www.destinationcommandcenter.com/book?${params.toString()}`;
  }, [expectedReturnTime, overage.overageAmount, overage.overageHours, pickupTime, selectedVehicleMeta.checkoutProduct, serviceDate, specialRequests, vehicleQty]);

  const sharedCheckoutHref = useMemo(() => {
    const params = new URLSearchParams({
      venue: "red-rocks-amphitheatre",
      date: serviceDate,
      qty: String(riderQty),
      requests: specialRequests.trim(),
    });
    return `/book/red-rocks-amphitheatre/shared?${params.toString()}`;
  }, [riderQty, serviceDate, specialRequests]);

  const canContinue = rideType === "shared" ? riderQty >= 1 : vehicleQty >= 1;

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="relative h-[380px] overflow-hidden border-b border-white/10">
        <Image src={hero.hero} alt={hero.heroAlt} fill priority className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,9,18,0.45),rgba(6,9,18,0.92))]" />
        <div className="relative mx-auto flex h-full w-full max-w-[1240px] flex-col justify-end px-4 pb-10 sm:px-6 lg:px-8">
          <div className="inline-flex w-fit items-center rounded-full border border-white/14 bg-black/35 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Ride Booking Wizard
          </div>
          <h1 className="mt-4 max-w-4xl text-[2.1rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[3.25rem]">
            Build Your Red Rocks Ride Plan
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/78 sm:text-[15px]">
            Big-step booking flow: choose ride type, set vehicle plan, lock date and timing, then launch checkout.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[980px] space-y-6 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <StepCard
          number={1}
          title="Ride Type"
          description="Start by choosing the booking lane you want tonight."
          complete={Boolean(rideType)}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setRideType("private");
                setCheckoutReady(false);
              }}
              className={[
                "rounded-2xl border p-5 text-left transition",
                rideType === "private"
                  ? "border-[#f5c66c]/55 bg-[#1a140d]"
                  : "border-white/12 bg-white/5 hover:border-[#f5c66c]/35",
              ].join(" ")}
            >
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ffb07c]">Recommended for groups</div>
              <div className="mt-2 text-xl font-black uppercase tracking-[-0.03em]">Private Vehicle</div>
              <p className="mt-2 text-sm leading-6 text-white/72">
                SUV, van, sprinter, or party bus with one coordinated pickup and return plan.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setRideType("shared");
                setCheckoutReady(false);
              }}
              className={[
                "rounded-2xl border p-5 text-left transition",
                rideType === "shared"
                  ? "border-[#8fd0ff]/55 bg-[#0f1c32]"
                  : "border-white/12 bg-white/5 hover:border-[#8fd0ff]/35",
              ].join(" ")}
            >
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8fd0ff]">Fastest budget option</div>
              <div className="mt-2 text-xl font-black uppercase tracking-[-0.03em]">Shared Shuttle</div>
              <p className="mt-2 text-sm leading-6 text-white/72">
                Per-seat checkout for riders who do not need a private vehicle.
              </p>
            </button>
          </div>
        </StepCard>

        <StepCard
          number={2}
          title="Select Vehicle Option"
          description={
            rideType === "private"
              ? "Choose your private vehicle and how many of that vehicle you need."
              : "Shared ride selected. Set rider count below and skip vehicle selection."
          }
          complete={rideType === "shared" ? riderQty > 0 : Boolean(selectedVehicle && vehicleQty > 0)}
        >
          {rideType === "private" ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                {VEHICLE_OPTIONS.map((vehicle) => (
                  <button
                    key={vehicle.key}
                    type="button"
                    onClick={() => {
                      setSelectedVehicle(vehicle.key);
                      setCheckoutReady(false);
                    }}
                    className={[
                      "rounded-2xl border p-5 text-left transition",
                      selectedVehicle === vehicle.key
                        ? "border-[#f5c66c]/55 bg-[#1a140d]"
                        : "border-white/12 bg-white/5 hover:border-[#f5c66c]/35",
                    ].join(" ")}
                  >
                    <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ffb07c]">{vehicle.basePrice}</div>
                    <div className="mt-2 text-lg font-black uppercase tracking-[-0.02em] text-white">{vehicle.title}</div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/56">{vehicle.capacity}</div>
                    <p className="mt-2 text-sm leading-6 text-white/72">{vehicle.copy}</p>
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-white/12 bg-black/25 p-4">
                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8fd0ff]">
                  Number of {selectedVehicleMeta.title.toLowerCase().includes("suburban") ? "suburbans" : selectedVehicleMeta.title.toLowerCase().includes("van") ? "vans" : selectedVehicleMeta.title.toLowerCase().includes("sprinter") ? "sprinters" : "party buses"}
                </div>
                <div className="mt-3 inline-flex items-center gap-3 rounded-full border border-white/14 bg-white/6 p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setVehicleQty((current) => Math.max(1, current - 1));
                      setCheckoutReady(false);
                    }}
                    className="h-10 w-10 rounded-full border border-white/14 bg-white/6 text-xl font-black text-white transition hover:bg-white/12"
                  >
                    -
                  </button>
                  <div className="min-w-10 text-center text-lg font-black">{vehicleQty}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setVehicleQty((current) => Math.min(10, current + 1));
                      setCheckoutReady(false);
                    }}
                    className="h-10 w-10 rounded-full border border-white/14 bg-white/6 text-xl font-black text-white transition hover:bg-white/12"
                  >
                    +
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-white/12 bg-black/25 p-4">
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8fd0ff]">Number of riders</div>
              <div className="mt-3 inline-flex items-center gap-3 rounded-full border border-white/14 bg-white/6 p-2">
                <button
                  type="button"
                  onClick={() => {
                    setRiderQty((current) => Math.max(1, current - 1));
                    setCheckoutReady(false);
                  }}
                  className="h-10 w-10 rounded-full border border-white/14 bg-white/6 text-xl font-black text-white transition hover:bg-white/12"
                >
                  -
                </button>
                <div className="min-w-10 text-center text-lg font-black">{riderQty}</div>
                <button
                  type="button"
                  onClick={() => {
                    setRiderQty((current) => Math.min(24, current + 1));
                    setCheckoutReady(false);
                  }}
                  className="h-10 w-10 rounded-full border border-white/14 bg-white/6 text-xl font-black text-white transition hover:bg-white/12"
                >
                  +
                </button>
              </div>
            </div>
          )}
        </StepCard>

        <StepCard
          number={3}
          title="Date & Timing"
          description="Set your ride date, pickup time, and your expected return timing so everyone is aligned."
          complete={Boolean(serviceDate && pickupTime && expectedReturnTime)}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <label className="rounded-2xl border border-white/12 bg-black/25 p-4">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8fd0ff]">Service date</div>
              <input
                type="date"
                value={serviceDate}
                onChange={(event) => {
                  setServiceDate(event.target.value);
                  setCheckoutReady(false);
                }}
                className="mt-3 w-full rounded-xl border border-white/14 bg-[#0b1224] px-3 py-2 text-sm text-white outline-none"
              />
            </label>

            <label className="rounded-2xl border border-white/12 bg-black/25 p-4">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8fd0ff]">Pickup time</div>
              <input
                type="time"
                value={pickupTime}
                onChange={(event) => {
                  setPickupTime(event.target.value);
                  setCheckoutReady(false);
                }}
                className="mt-3 w-full rounded-xl border border-white/14 bg-[#0b1224] px-3 py-2 text-sm text-white outline-none"
              />
            </label>

            <label className="rounded-2xl border border-white/12 bg-black/25 p-4">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8fd0ff]">Expected return time</div>
              <input
                type="time"
                value={expectedReturnTime}
                onChange={(event) => {
                  setExpectedReturnTime(event.target.value);
                  setCheckoutReady(false);
                }}
                className="mt-3 w-full rounded-xl border border-white/14 bg-[#0b1224] px-3 py-2 text-sm text-white outline-none"
              />
            </label>
          </div>

          {rideType === "private" ? (
            <div className="mt-5 rounded-2xl border border-[#f5c66c]/26 bg-[#1a140d] p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ffb07c]">Private vehicle timing policy</div>
              <p className="mt-3 text-sm leading-6 text-white/86">
                Your private booking includes <span className="font-black">up to 8 hours</span> of service. After that, overage is
                <span className="font-black"> $100 per hour</span>, charged to the card on file after service.
              </p>
              <p className="mt-3 text-sm leading-6 text-white/76">
                Most Red Rocks shows wrap around midnight, with many weeknight shows ending closer to 11:00 PM. You can always call Red Rocks to confirm that night&apos;s schedule.
                We typically do not recommend pickups before 4:30 PM unless there is an officially early event.
              </p>
              <div className="mt-4 rounded-xl border border-white/12 bg-black/30 p-4 text-sm leading-6 text-white/88">
                <div>
                  Current estimate: <span className="font-black">{formatTimeLabel(pickupTime)}</span> to <span className="font-black">{formatTimeLabel(expectedReturnTime)}</span>
                  ({overage.durationHours.toFixed(1)} hours total)
                </div>
                <div className="mt-2">
                  Estimated overage: <span className="font-black">{overage.overageHours} hour(s)</span> ·
                  <span className="font-black"> ${overage.overageAmount}</span>
                </div>
                <div className="mt-2 text-white/72">
                  Example: 2:00 PM pickup and midnight return is 10 hours total, so the post-service balance is <span className="font-black">$200</span>.
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-[#8fd0ff]/26 bg-[#0f1c32] p-5 text-sm leading-6 text-white/86">
              Shared rides are seat-based and do not use the private-vehicle 8-hour overage policy.
            </div>
          )}
        </StepCard>

        <StepCard
          number={4}
          title="Special Requests"
          description="If you want to lay out your plan in detail, put it here and we can align your service to the plan."
          complete={true}
        >
          <label htmlFor="special-requests" className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8fd0ff]">
            Special requests or lay out your plan here
          </label>
          <textarea
            id="special-requests"
            value={specialRequests}
            onChange={(event) => {
              setSpecialRequests(event.target.value);
              setCheckoutReady(false);
            }}
            placeholder="Example: 2 Suburbans, split pickup in RiNo + LoDo, 5:15 PM departure, tailgate stop, post-show regroup at Upper North lot."
            className="mt-3 min-h-28 w-full rounded-2xl border border-white/12 bg-black/25 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-[#f5c66c]/40"
          />
        </StepCard>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.96),rgba(6,9,18,0.96))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.4)] sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">Review and continue</div>
          <div className="mt-4 grid gap-3 text-sm text-white/84 md:grid-cols-2">
            <div>
              <span className="font-black text-white">Ride type:</span> {rideType === "private" ? "Private vehicle" : "Shared shuttle"}
            </div>
            <div>
              <span className="font-black text-white">Date:</span> {serviceDate}
            </div>
            <div>
              <span className="font-black text-white">Pickup:</span> {formatTimeLabel(pickupTime)}
            </div>
            <div>
              <span className="font-black text-white">Expected return:</span> {formatTimeLabel(expectedReturnTime)}
            </div>
            {rideType === "private" ? (
              <>
                <div>
                  <span className="font-black text-white">Vehicle:</span> {selectedVehicleMeta.title}
                </div>
                <div>
                  <span className="font-black text-white">Count:</span> {vehicleQty}
                </div>
                <div className="md:col-span-2">
                  <span className="font-black text-white">Overage estimate:</span> {overage.overageHours}h · ${overage.overageAmount}
                </div>
              </>
            ) : (
              <div>
                <span className="font-black text-white">Riders:</span> {riderQty}
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={!canContinue}
            onClick={() => setCheckoutReady(true)}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#ffd6a3]/28 bg-[linear-gradient(180deg,#a95f28_0%,#8d4f20_100%)] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#120f0b] transition hover:bg-[linear-gradient(180deg,#b66c31_0%,#975321_100%)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue to checkout
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </section>

        {checkoutReady ? (
          <section className="rounded-[30px] border border-[#f5c66c]/26 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.4)] sm:p-8">
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f5c66c]">Checkout</div>
            {rideType === "private" ? (
              <>
                <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">Private booking checkout</h3>
                <p className="mt-2 text-sm leading-6 text-white/76">
                  Your plan is loaded below. If the embed does not load, use the fallback button.
                </p>
                <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-white">
                  <iframe title="Private checkout" src={privateCheckoutHref} className="h-[880px] w-full border-0" />
                </div>
                <a
                  href={privateCheckoutHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-12 items-center justify-center rounded-full border border-[#ffd6a3]/28 bg-[linear-gradient(180deg,#a95f28_0%,#8d4f20_100%)] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#120f0b] transition hover:bg-[linear-gradient(180deg,#b66c31_0%,#975321_100%)]"
                >
                  Open private checkout in new tab
                </a>
              </>
            ) : (
              <>
                <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">Shared booking path</h3>
                <p className="mt-2 text-sm leading-6 text-white/76">
                  Continue to the shared shuttle booking page with your date and rider count prefilled.
                </p>
                <a
                  href={sharedCheckoutHref}
                  className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full border border-[#8fd0ff]/30 bg-[#11223d] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#d4ecff] transition hover:bg-[#153055]"
                >
                  Continue to shared checkout
                </a>
              </>
            )}
          </section>
        ) : null}
      </section>
    </main>
  );
}
