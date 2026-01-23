'use client';

import { useEffect } from 'react';

export default function BookShuttlePage() {
  useEffect(() => {
    // Load Rezdy widget script ONCE
    if (!document.getElementById('rezdy-script')) {
      const script = document.createElement('script');
      script.id = 'rezdy-script';
      script.src = 'https://book.rezdy.com/plugin/widget.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <main className="min-h-screen bg-black text-white pt-32 px-6 font-mono">
      <div className="max-w-4xl mx-auto border border-zinc-800 p-12 bg-zinc-950">
        
        <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-6">
          Book Your Concert Shuttle
        </h1>

        <p className="text-zinc-400 mb-10">
          Round-trip concert transportation. Pickup anywhere in Denver or Boulder.
          Drink, vape, play music — we handle the driving and wait after the show.
        </p>

        {/* Rezdy Widget */}
        <div
          className="rezdy rezdy-widget"
          data-widget-type="inline"
          data-widget-id="YOUR_REZDY_PRODUCT_ID"
          data-widget-width="100%"
          data-widget-height="800"
        />

        <p className="text-xs text-zinc-500 mt-6">
          Questions? You’ll receive a confirmation and calendar invite after booking.
        </p>

      </div>
    </main>
  );
}
