"use client";
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function SidebarSatMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [-105.2054, 39.6654],
      zoom: 15.5,
      pitch: 65,
      bearing: 0,
      interactive: false,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    });

    const rotateCamera = () => {
      if (map.current) {
        map.current.rotateTo((map.current.getBearing() + 0.15) % 360, { duration: 0 });
        requestAnimationFrame(rotateCamera);
      }
    };

    map.current.on('load', rotateCamera);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <div className="relative group overflow-hidden">
      <p className="text-[9px] text-neon-blue uppercase font-black tracking-widest border-l-2 border-neon-blue pl-2 mb-2">
        // SITE_INTEL_ROTATING
      </p>
      <div ref={mapContainer} className="h-64 w-full border border-soft bg-surface shadow-2xl" />
    </div>
  );
}
