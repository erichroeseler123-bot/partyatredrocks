import Link from "next/link";
import { redirect } from "next/navigation";
import { rezdyGetAvailability } from "@/lib/rezdy";
import { SHUTTLE_PRICING } from "@/lib/pricing";

export const metadata = {
  robots: { index: false, follow: true },
};

type SP = Record<string, string | string[] | undefined>;

function first(sp: SP, key: string) {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

function buildQs(sp: SP) {
  const qs = new URLSearchParams();
  const pickup = first(sp, "pickup");
  const date = first(sp, "date");
  const qty = first(sp, "qty");

  if (pickup) qs.set("pickup", pickup);
  if (date) qs.set("date", date);
  if (qty) qs.set("qty", qty);

  const q = qs.toString();
  return q ? `?${q}` : "";
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const productCode = first(sp, "productCode");
  let liveAvailabilityNote: string | null = null;

  if (productCode) {
    try {
      const query = new URLSearchParams();
      query.set("productCode", productCode);
      const sessions = await rezdyGetAvailability(query);
      liveAvailabilityNote = `Live Rezdy check: ${sessions.length} session${sessions.length === 1 ? "" : "s"} returned for ${productCode}.`;
    } catch {
      liveAvailabilityNote = `Live Rezdy check unavailable for ${productCode}.`;
    }
  }

  const venue = (first(sp, "venue") || "").toLowerCase();
  const venueDisplay = venue.replace(/-/g, " ").replace(/amphitheatre/g, "Amphitheatre").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const qs = buildQs(sp);
  if (venue) {
    return (
      <main className="min-h-screen bg-surface text-white px-6 py-24">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-black mb-6">Booking for {venueDisplay}</h1>
          <p className="text-xl text-white/80 mb-10">Continuing with your prefill...</p>
          <Link href={`/venues/${venue}${qs}`} className="btn-primary text-2xl px-10 py-5">
            Continue Booking →
          </Link>
        </div>
      </main>
    );
  }

  // If homepage stepper sent a target, route immediately (and preserve params)
  if (
    venue === "red-rocks" ||
    venue === "redrocks" ||
    venue === "red-rocks-amphitheatre"
  ) {
    redirect(`/venues/red-rocks-amphitheatre${qs}`);
  }
  if (venue === "mishawaka" || venue === "mishawaka-amphitheatre") {
    redirect(`/venues/mishawaka-amphitheatre${qs}`);
  }
  if (venue === "all-venues" || venue === "any" || venue === "any-venue") {
    redirect(`/book-all-venues${qs}`);
  }

  // Otherwise show the router UI
  return (
    <main className="min-h-screen bg-surface text-white px-6 py-24">
      <div className="max-w-6xl mx-auto">
        {liveAvailabilityNote ? (
          <section className="panel-soft p-4 mb-8">
            <div className="text-[11px] font-black uppercase tracking-[.22em] text-white/60">Live Availability</div>
            <p className="mt-2 text-sm text-white/80">{liveAvailabilityNote}</p>
          </section>
        ) : null}
        <header className="text-center mb-20">
          <p className="text-red-500 uppercase tracking-[0.4em] text-xs font-bold mb-4">
            Booking Router
          </p>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tight mb-6">
            Where Are You Going?
          </h1>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            Choose your destination and we’ll route you to the correct shuttle
            service. You go to the show. We handle the ride.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link
            href={`/venues/red-rocks-amphitheatre${qs}`}
            className="group rounded-3xl border border-soft panel-soft p-10 hover:bg-surface/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <h2 className="text-3xl font-black italic uppercase mb-4 group-hover:text-red-500">
              Party at Red Rocks
            </h2>
            <ul className="text-sm text-soft space-y-2 mb-6">
              <li>• Flagship round-trip shuttle</li>
              <li>• Pickup anywhere in Denver</li>
              <li>• Driver waits after the show</li>
              <li>• Drink, vape &amp; music allowed</li>
            </ul>
            <div className="text-red-500 font-bold uppercase tracking-widest text-xs">
              Book Red Rocks Shuttle →
            </div>
          </Link>

          <Link
            href={`/venues/mishawaka-amphitheatre${qs}`}
            className="group rounded-3xl border border-soft panel-soft p-10 hover:bg-surface/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <h2 className="text-3xl font-black italic uppercase mb-4 group-hover:text-blue-400">
              Mishawaka Shuttle
            </h2>
            <ul className="text-sm text-soft space-y-2 mb-6">
              <li>• Shared mountain shuttle</li>
              <li>• Canyon logistics handled</li>
              <li>• Ideal for sold-out shows</li>
              <li>• {SHUTTLE_PRICING.mishawaka.shared}</li>
              <li>• Private option: {SHUTTLE_PRICING.mishawaka.privateSuburban}</li>
            </ul>
            <div className="text-blue-400 font-bold uppercase tracking-widest text-xs">
              Book Mishawaka Shuttle →
            </div>
          </Link>

          <Link
            href={`/book-all-venues${qs}`}
            className="group rounded-3xl border border-soft panel-soft p-10 hover:bg-surface/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <h2 className="text-3xl font-black italic uppercase mb-4 group-hover:text-green-400">
              All-Venue Shuttle
            </h2>
            <ul className="text-sm text-soft space-y-2 mb-6">
              <li>• Any venue in Denver or Boulder</li>
              <li>• {SHUTTLE_PRICING.denverBoulderOtherVenues.suburban}</li>
              <li>• Private suburban service</li>
              <li>• Cashless checkout flow</li>
              <li>• One stop each way allowed</li>
            </ul>
            <div className="text-green-400 font-bold uppercase tracking-widest text-xs">
              View All-Venue Shuttle →
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
