"use client";

import { useMemo, useState } from "react";

type Layer = "trails" | "seating" | "geology" | "parking" | "shuttle";

type MapPoint = {
  id: string;
  name: string;
  layer: Layer;
  x: number;
  y: number;
  blurb: string;
};

const LAYER_LABELS: Record<Layer, string> = {
  trails: "Trails",
  seating: "Seating",
  geology: "Geology",
  parking: "Parking",
  shuttle: "Shuttle Pickup",
};

const LAYER_COLORS: Record<Layer, string> = {
  trails: "#67e8f9",
  seating: "#fde047",
  geology: "#fca5a5",
  parking: "#93c5fd",
  shuttle: "#86efac",
};

type Props = {
  points: MapPoint[];
};

export default function RedRocksInteractiveMap({ points }: Props) {
  const [activeLayers, setActiveLayers] = useState<Set<Layer>>(
    () => new Set<Layer>(["trails", "seating", "geology", "parking", "shuttle"])
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function toggleLayer(layer: Layer) {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layer)) next.delete(layer);
      else next.add(layer);
      return next;
    });
  }

  const visible = useMemo(() => points.filter((point) => activeLayers.has(point.layer)), [activeLayers, points]);
  const selected = visible.find((point) => point.id === selectedId) ?? null;

  return (
    <section className="comic-panel" style={{ marginTop: 16 }}>
      <div className="comic-tag">Interactive Red Rocks Map</div>
      <p className="comic-copy" style={{ marginTop: 8 }}>
        Toggle layers to view trails, seating, geology features, parking lots, and shuttle pickup zones.
      </p>

      <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {(Object.keys(LAYER_LABELS) as Layer[]).map((layer) => {
          const on = activeLayers.has(layer);
          return (
            <button
              key={layer}
              type="button"
              onClick={() => toggleLayer(layer)}
              className="comic-btn"
              style={{
                border: `1px solid ${on ? LAYER_COLORS[layer] : "rgba(255,255,255,0.18)"}`,
                background: on ? `color-mix(in srgb, ${LAYER_COLORS[layer]} 20%, transparent)` : "rgba(255,255,255,0.04)",
                color: on ? "#f8fafc" : "#cbd5e1",
              }}
            >
              {LAYER_LABELS[layer]}
            </button>
          );
        })}
      </div>

      <div
        className="comic-panel"
        style={{
          marginTop: 12,
          position: "relative",
          minHeight: 420,
          background:
            "radial-gradient(circle at 30% 20%, rgba(56,189,248,.18), transparent 32%), radial-gradient(circle at 70% 75%, rgba(251,191,36,.15), transparent 30%), linear-gradient(180deg, rgba(2,6,23,.82), rgba(15,23,42,.92))",
        }}
      >
        <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.22 }} aria-hidden>
          <path d="M8 84 C18 68, 28 58, 40 54 C52 50, 62 53, 72 64 C79 72, 86 76, 92 78" fill="none" stroke="#67e8f9" strokeWidth="1.2" />
          <path d="M28 80 C35 62, 44 44, 58 34" fill="none" stroke="#fde047" strokeWidth="1.1" />
          <path d="M40 54 L48 58 L56 55" fill="none" stroke="#fca5a5" strokeWidth="1.1" />
        </svg>

        {visible.map((point) => (
          <button
            key={point.id}
            type="button"
            onClick={() => setSelectedId(point.id)}
            style={{
              position: "absolute",
              left: `${point.x}%`,
              top: `${point.y}%`,
              transform: "translate(-50%, -50%)",
              borderRadius: 999,
              border: `1px solid ${LAYER_COLORS[point.layer]}`,
              background: `color-mix(in srgb, ${LAYER_COLORS[point.layer]} 25%, rgba(2,6,23,.8))`,
              color: "#f8fafc",
              padding: "6px 9px",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: ".04em",
              cursor: "pointer",
            }}
          >
            {point.name}
          </button>
        ))}
      </div>

      <div className="comic-panel" style={{ marginTop: 12 }}>
        <div className="comic-tag">Selected Point</div>
        {selected ? (
          <>
            <h3 className="comic-h3" style={{ marginTop: 8 }}>{selected.name}</h3>
            <p className="comic-copy" style={{ marginTop: 8 }}>{selected.blurb}</p>
          </>
        ) : (
          <p className="comic-copy" style={{ marginTop: 8 }}>Select a point on the map to view details.</p>
        )}
      </div>
    </section>
  );
}
