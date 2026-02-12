'use client';

import React from 'react';
import Script from 'next/script';
import { PhoneCall, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BookingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-slate-200 py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold uppercase text-xs transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </button>
        <div className="font-black italic uppercase tracking-tighter text-xl">
          Party @ <span className="text-blue-500">Red Rocks!</span>
        </div>
        <a href="tel:3030000000" className="bg-blue-600 text-white px-4 py-2 rounded-full font-black text-xs flex items-center gap-2 uppercase">
          <PhoneCall className="w-3 h-3" /> Call
        </a>
      </nav>

      {/* Widget Container */}
      <main className="max-w-6xl mx-auto py-10 px-4">
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200">
          <div className="p-8 border-b border-slate-100 bg-slate-50">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Secure Your Transport</h1>
            <p className="text-slate-500 font-medium uppercase text-xs tracking-widest mt-1">Select your service and vehicle below</p>
          </div>
          
          <div className="relative min-h-[1000px]">
            {/* Rezdy Script Loader */}
            <Script 
              src="https://gosnotransportation58.rezdy.com/pluginJs" 
              strategy="afterInteractive" 
            />
            {/* The Widget Iframe */}
            <iframe 
              seamless 
              width="100%" 
              height="1000px" 
              frameBorder="0" 
              className="rezdy" 
              src="https://gosnotransportation58.rezdy.com/catalog/541037/party-at-red-rocks?iframe=true"
            ></iframe>
          </div>
        </div>
      </main>

      <footer className="py-10 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
        © 2026 Party @ Red Rocks! | Professional Fleet Logistics
      </footer>
    </div>
  );
}
