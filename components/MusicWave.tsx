"use client";

import type { CSSProperties } from "react";

type MusicWaveProps = {
  className?: string;
  bars?: number;
};

export default function MusicWave({
  className = "",
  bars = 32,
}: MusicWaveProps) {
  return (
    <div className={`music-wave ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="music-wave-bar"
          style={
            {
              ["--i" as string]: i,
              ["--dur" as string]: `${0.9 + (i % 5) * 0.18}s`,
              ["--delay" as string]: `${(i % 7) * 0.08}s`,
              ["--h" as string]: `${18 + ((i * 11) % 54)}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
