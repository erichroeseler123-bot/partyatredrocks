"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { getBookingVenueImage } from "@/data/media";
import { SUBURBAN_2027_USD, VAN_2027_USD } from "@/lib/pricing";

type PrivateVehicleKey = "suv" | "van";

type VehicleOption = {
  key: PrivateVehicleKey;
  title: string;
  basePrice: string;
  capacity: string;
  copy: string;
};

const VEHICLE_OPTIONS: VehicleOption[] = [
  {
    key: "suv",
    title: "Private Suburban",
    basePrice: `$${SUBURBAN_2027_USD} flat round-trip`,
    capacity: "Up to 6 guests",
    copy: "Door-to-door pickup, Upper North Lot tailgate gear (chairs, cooler, speaker & ice), driver waiting through the show, and return ride home.",
  },
  {
    key: "van",
    title: "Private Van",
    basePrice: `$${VAN_2027_USD} flat round-trip`,
    capacity: "Up to 10 guests",
    copy: "Full-crew high-roof passenger van with one pickup plan, Upper North Lot tailgate setup, waiting driver, and direct ride home.",
  },
];

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function QuickRedRocksPage() {
  const today = useMemo(() => new Date(), []);
  const hero = getBookingVenueImage("red-rocks-amphitheatre");

  const [selectedVehicle, setSelectedVehicle] = useState<PrivateVehicleKey>("suv");
  const [vehicleQty, setVehicleQty] = useState(1);
  const [serviceDate, setServiceDate] = useState(toIsoDate(today));
  const [pickupArea, setPickupArea] = useState("");

  const selectedVehicleMeta = VEHICLE_OPTIONS.find((v) => v.key === selectedVehicle) || VEHICLE_OPTIONS[0];

  const checkoutHref = useMemo(() => {
    const params = new URLSearchParams({
      qty: String(vehicleQty),
      date: serviceDate,
    });
    if (pickupArea.trim()) {
      params.set("pickup", pickupArea.trim());
    }
    return `/book/red-rocks-amphitheatre/private/${selectedVehicle}?${params.toString()}`;
  }, [pickupArea, selectedVehicle, serviceDate, vehicleQty]);

  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      <section className="relative h-[340px] overflow-hidden border-b border-white/10">
        <Image src={hero.hero} alt={hero.heroAlt} fill priority className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,20,0.45),rgba(7,11,20,0.94))]" />
        <div className="relative mx-auto flex h-full w-full max-w-[1100px] flex-col justify-end px-4 pb-10 sm:px-6 lg:px-8">
          <div className="inline-flex w-fit items-center rounded-full border border-white/14 bg-black/40 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
            Private Ride Builder
          </div>
          <h1 className="mt-4 max-w-4xl text-[2.1rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[3.1rem]">
            Build Your Private Red Rocks Night
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/80 sm:text-[15px]">
            Choose your concert date, select your private vehicle, confirm your pickup area, and head straight to checkout.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[980px] space-y-6 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="rounded-[28px] border border-white/10 bg-[#0d1424] p-6 sm:p-8">
          <h2 className="text-2xl font-black uppercase tracking-tight">1. Choose Private Vehicle</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {VEHICLE_OPTIONS.map((vehicle) => (
              <button
                key={vehicle.key}
                type="button"
                onClick={() => setSelectedVehicle(vehicle.key)}
                className={[
                  "rounded-2xl border p-5 text-left transition",
                  selectedVehicle === vehicle.key
                    ? "border-[#ff6b3d] bg-[#1a1410]"
                    : "border-white/12 bg-white/5 hover:border-[#ffb07c]/40",
                ].join(" ")}
              >
                <div className="text-xs font-black uppercase tracking-[0.18em] text-[#ffb07c]">{vehicle.basePrice}</div>
                <div className="mt-2 text-xl font-black uppercase text-white">{vehicle.title}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">{vehicle.capacity}</div>
                <p className="mt-2 text-sm leading-6 text-white/75">{vehicle.copy}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-[#0d1424] p-6 sm:p-8">
          <h2 className="text-2xl font-black uppercase tracking-tight">2. Concert Date & Pickup Area</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label className="rounded-2xl border border-white/12 bg-black/25 p-4">
              <span className="block text-[11px] font-black uppercase tracking-[0.18em] text-[#ffb07c]">Concert Date</span>
              <input
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/14 bg-[#070b14] px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="rounded-2xl border border-white/12 bg-black/25 p-4">
              <span className="block text-[11px] font-black uppercase tracking-[0.18em] text-[#ffb07c]">Vehicles Needed</span>
              <input
                type="number"
                min={1}
                max={6}
                value={vehicleQty}
                onChange={(e) => setVehicleQty(Math.max(1, Math.min(6, Number(e.target.value) || 1)))}
                className="mt-2 w-full rounded-xl border border-white/14 bg-[#070b14] px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="rounded-2xl border border-white/12 bg-black/25 p-4">
              <span className="block text-[11px] font-black uppercase tracking-[0.18em] text-[#ffb07c]">Pickup Area / Hotel</span>
              <input
                type="text"
                value={pickupArea}
                onChange={(e) => setPickupArea(e.target.value)}
                placeholder="Downtown Denver, RiNo, Golden..."
                className="mt-2 w-full rounded-xl border border-white/14 bg-[#070b14] px-3 py-2 text-sm text-white placeholder:text-white/40"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
            <div className="text-sm text-white/80">
              Selected: <strong className="text-white">{selectedVehicleMeta.title}</strong> ({selectedVehicleMeta.basePrice})
            </div>
            <Link
              href={checkoutHref}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff6b3d] px-7 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-[#ff7f56]"
            >
              Continue to {selectedVehicleMeta.title} Checkout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
