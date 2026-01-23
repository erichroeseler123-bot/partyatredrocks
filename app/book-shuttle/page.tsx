'use client';

import { getBookingUrl } from '@/lib/rezdy';

export default function BookShuttlePage() {
  const bookingUrl = getBookingUrl('shuttle');

  return (
    <main className="min-h-screen bg-black text-white pt-32 px-6 font-mono">
      <div className="max-w-5xl mx-auto border border-zinc-800 bg-zinc-950">
        
        {/* Header */}
        <div className="p-10 border-b border-zinc-800">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-4">
            Book Your Concert Shuttle
          </h1>
          <p className="text-zinc-400 max-w-2xl">
            Round-trip concert transportation. Pickup anywhere in Denver or Boulder.
            Drink, vape, play music — we drive, wait, and take you home.
          </p>
        </div>

        {/* Rezdy Calendar Widget */}
        <iframe
          src={bookingUrl}
          className="w-full"
          style={{ height: '900px' }}
          frameBorder="0"
          scrolling="yes"
          allow="payment"
        />

        {/* Footer note */}
        <div className="p-6 text-xs text-zinc-500 border-t border-zinc-800">
          You’ll receive confirmation details and a calendar invite after booking.
          Private SUV bookings available separately.
        </div>

      </div>
    </main>
  );
}
