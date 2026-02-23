"use client";

import { useEffect } from "react";
import { DISPLAY } from "@/lib/display";

export default function DisplayTheme() {
  useEffect(() => {
    const r = document.documentElement;
    const t = DISPLAY.theme;

    r.style.setProperty("--surface", t.surface);
    r.style.setProperty("--surface2", t.surface2);
    r.style.setProperty("--text", t.text);
    r.style.setProperty("--muted", t.muted);
    r.style.setProperty("--accent", t.accent);
    r.style.setProperty("--accent2", t.accent2);
    r.style.setProperty("--glow", t.glow);
    r.style.setProperty("--heroOverlay", t.heroOverlay);
  }, []);

  return null;
}
