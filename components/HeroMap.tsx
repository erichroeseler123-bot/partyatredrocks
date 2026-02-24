"use client";
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMap } from "@/app/context/MapContext";
import { SHUTTLE_ROUTES } from "@/lib/routes";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function HeroMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { registerMap } = useMap();

  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: [-105.1103, 39.7147],
      zoom: 10.5,
      pitch: 45,
      cooperativeGestures: true, // Requires 2 fingers on mobile
      interactive: false // Locked on desktop by default
    });

    map.current.on('load', () => {
      map.current?.addSource('shuttle-routes', {
        type: 'geojson',
        data: SHUTTLE_ROUTES as any
      });

      map.current?.addLayer({
        id: 'route-lines',
        type: 'line',
        source: 'shuttle-routes',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 4,
          'line-opacity': 0.8,
          'line-blur': 1
        }
      });
    });

    registerMap(map.current);
    return () => { map.current?.remove(); map.current = null; };
  }, [registerMap]);

  return (
    <section className="w-full h-[400px] border border-soft relative group overflow-hidden">
      <div ref={mapContainer} className="w-full h-full brightness-110 contrast-105" />
    </section>
  );
}
