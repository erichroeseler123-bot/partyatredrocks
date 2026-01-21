"use client";

import { useEffect } from "react";

type RezdyWidgetProps = {
  accountBaseUrl: string; // e.g. https://gosnotransportation58.rezdy.com
  productId: number;      // e.g. 725838
  height?: number;        // iframe height
};

export default function RezdyWidget({
  accountBaseUrl,
  productId,
  height = 1100,
}: RezdyWidgetProps) {
  useEffect(() => {
    // Load Rezdy plugin JS on the client only (safe for Next.js App Router)
    const existing = document.querySelector(
      `script[data-rezdy-plugin="true"][data-rezdy-base="${accountBaseUrl}"]`
    ) as HTMLScriptElement | null;

    if (existing) return;

    const script = document.createElement("script");
    script.src = `${accountBaseUrl}/pluginJs`;
    script.defer = true;
    script.type = "text/javascript";
    script.setAttribute("data-rezdy-plugin", "true");
    script.setAttribute("data-rezdy-base", accountBaseUrl);
    document.body.appendChild(script);

    // No cleanup: removing can break Rezdy widgets when navigating in SPA mode
  }, [accountBaseUrl]);

  return (
    <div className="w-full">
      <iframe
        seamless
        className="rezdy w-full rounded-2xl border border-white/10 bg-black"
        src={`${accountBaseUrl}/calendarWidget/${productId}?iframe=true`}
        width="100%"
        height={height}
        frameBorder={0}
        loading="lazy"
        title="Rezdy booking widget"
      />
    </div>
  );
}
