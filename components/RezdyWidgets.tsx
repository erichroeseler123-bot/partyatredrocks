'use client';

import { useEffect } from 'react';

export default function RezdyWidgets() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://gosnotransportation58.rezdy.com/pluginJs";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex flex-col gap-12 w-full">
      {/* SHARED SHUTTLE WIDGET ($59+) */}
      <div className="rounded-[2rem] overflow-hidden border border-soft panel backdrop-blur-xl">
        <div className="btn-primary">
          <p className="text-white font-black uppercase tracking-widest text-sm">Shared Shuttle Booking</p>
        </div>
        <iframe 
          src="https://gosnotransportation58.rezdy.com/catalog/638971/red-rocks-shuttle?iframe=true"
          width="100%" height="800px" frameBorder="0" className="rezdy"
        />
      </div>

      {/* PRIVATE SUBURBAN WIDGET ($499) */}
      <div className="rounded-[2rem] overflow-hidden border border-soft panel backdrop-blur-xl">
        <div className="bg-[#1673E6] p-4 text-center">
          <p className="text-white font-black uppercase tracking-widest text-sm">Private Suburban Booking</p>
        </div>
        <iframe 
          src="https://gosnotransportation58.rezdy.com/596193/suburban?iframe=true"
          width="100%" height="800px" frameBorder="0" className="rezdy"
        />
      </div>
    </div>
  );
}
