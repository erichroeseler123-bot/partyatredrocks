import Link from "next/link";
import CustomBooking from "@/components/CustomBooking";

const REZDY_BASE = "https://partyatredrocks.rezdy.com";
const PRODUCT_ID = "P6N3P7"; // Default Mishawaka Shuttle code

export default function MishawakaPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="h-[40vh] w-full relative">
        <img 
          src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2070&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-60" 
          alt="Mishawaka Amphitheatre" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute bottom-10 left-6 md:left-20">
          <Link href="/" className="text-sm font-bold text-red-600 uppercase tracking-widest hover:text-white transition">
            ← Back to All Venues
          </Link>
          <h1 className="text-4xl md:text-7xl font-black italic uppercase">
            Mishawaka Amphitheatre
          </h1>
        </div>
      </div>

      {/* Booking Section */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Book Your Shuttle</h2>
          <p className="text-zinc-400 mb-8">
            Select your trip below. This custom booking system handles all Mishawaka and Red Rocks 
            transportation services including private Suburbans and shared shuttles.
          </p>
          
          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-md">
            {/* The new custom component replaces the old RezdyWidget */}
            <CustomBooking />
          </div>
        </div>

        {/* Venue Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/10 pt-12">
          <div>
            <h3 className="text-red-600 font-bold uppercase tracking-tighter mb-4">Venue Details</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Located in the Poudre Canyon, the Mishawaka is a legendary Colorado venue. 
              Our shuttle service ensures a safe, reliable ride through the canyon so you 
              can focus on the music.
            </p>
          </div>
          <div>
            <h3 className="text-red-600 font-bold uppercase tracking-tighter mb-4">Travel Info</h3>
            <ul className="text-sm text-zinc-400 space-y-2">
              <li>• Pickup locations vary by event</li>
              <li>• Private SUVs available for groups up to 6</li>
              <li>• Vans available for larger parties</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
