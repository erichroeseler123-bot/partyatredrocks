"use client";

import React, { createContext, useContext, useRef } from "react";
import mapboxgl from "mapbox-gl";

type FlyToOptions = {
  center: [number, number];
  zoom?: number;
  pitch?: number;
  bearing?: number;
};

type MapContextType = {
  registerMap: (map: mapboxgl.Map) => void;
  flyTo: (opts: FlyToOptions) => void;
};

const MapContext = createContext<MapContextType | null>(null);

export function MapProvider({ children }: { children: React.ReactNode }) {
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const registerMap = (map: mapboxgl.Map) => {
    mapRef.current = map;
  };

  const flyTo = ({
    center,
    zoom = 13,
    pitch = 45,
    bearing = 0,
  }: FlyToOptions) => {
    if (!mapRef.current) return;

    mapRef.current.flyTo({
      center,
      zoom,
      pitch,
      bearing,
      essential: true,
      duration: 3000
    });
  };

  return (
    <MapContext.Provider value={{ registerMap, flyTo }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useMap must be used within MapProvider");
  return ctx;
}
