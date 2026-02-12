// components/BookWithRezdy.tsx
'use client';

import { useState } from 'react';

interface BookWithRezdyProps {
  defaultDate?: string;          // YYYY-MM-DD format (optional)
  productId?: string;            // Rezdy product ID for specific shuttle type
  label?: string;                // Button text
  className?: string;            // Extra Tailwind classes
  variant?: 'button' | 'text' | 'card'; // visual style
  venue?: string;                // Optional: for tracking/analytics
}

export default function BookWithRezdy({
  defaultDate,
  productId = 'YOUR_DEFAULT_SHUTTLE_PRODUCT_ID', // replace with your actual Rezdy product ID
  label = 'Book Shuttle Now',
  className = '',
  variant = 'button',
  venue = 'Red Rocks',
}: BookWithRezdyProps) {
  const [loading, setLoading] = useState(false);

  const baseUrl = 'https://YOURCOMPANY.rezdy.com/book'; // ← Replace with your Rezdy booking URL

  const buildBookingUrl = () => {
    const params = new URLSearchParams();

    // Prefill date if provided (Rezdy supports ?date=YYYY-MM-DD)
    if (defaultDate) {
      params.set('date', defaultDate);
    }

    // Optional: pre-select product
    if (productId) {
      params.set('productId', productId);
    }

    // Optional: add UTM or custom tracking
    params.set('utm_source', 'partyatredrocks');
    params.set('utm_medium', 'website');
    params.set('utm_campaign', `${venue}-shuttle`);

    return `${baseUrl}?${params.toString()}`;
  };

  const handleClick = () => {
    setLoading(true);
    const url = buildBookingUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
    setTimeout(() => setLoading(false), 1500); // fake loading for UX
  };

  // Different visual variants
  if (variant === 'text') {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={`text-red-500 hover:text-red-400 font-bold underline transition ${className}`}
      >
        {loading ? 'Opening booking...' : label}
      </button>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`bg-surface/80 border border-white/10 rounded-2xl p-6 text-center ${className}`}>
        <h4 className="text-lg font-black uppercase mb-3">Ready for the Show?</h4>
        <p className="text-zinc-400 mb-5 text-sm">
          Secure your spot with our fixed-price shuttle — no surge, no stress.
        </p>
        <button
          onClick={handleClick}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Opening Rezdy...' : label}
        </button>
      </div>
    );
  }

  // Default: prominent button
  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`bg-red-600 hover:bg-red-700 px-8 py-4 font-black uppercase tracking-wide rounded-full transition transform hover:scale-105 shadow-xl disabled:opacity-50 ${className}`}
    >
      {loading ? 'Opening booking...' : label}
    </button>
  );
}
