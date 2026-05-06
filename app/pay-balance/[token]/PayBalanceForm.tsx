"use client";

import { useEffect, useRef, useState } from "react";

type SquareCard = {
  attach: (selector: string) => Promise<void>;
  tokenize: () => Promise<{ status: string; token?: string; errors?: Array<{ message?: string }> }>;
  destroy?: () => Promise<void> | void;
};

declare global {
  interface Window {
    Square?: {
      payments: (appId: string, locationId: string) => {
        card: () => Promise<SquareCard>;
      };
    };
  }
}

let squareScriptPromise: Promise<void> | null = null;

function loadSquareSdk(src: string) {
  if (typeof window === "undefined") return Promise.reject(new Error("Square SDK requires a browser."));
  if (window.Square) return Promise.resolve();
  if (squareScriptPromise) return squareScriptPromise;

  squareScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-square-sdk="${src}"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Square SDK.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.squareSdk = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Square SDK."));
    document.head.appendChild(script);
  });

  return squareScriptPromise;
}

export default function PayBalanceForm({
  token,
  amountLabel,
  squareAppId,
  squareLocationId,
  squareSdkUrl,
}: {
  token: string;
  amountLabel: string;
  squareAppId: string;
  squareLocationId: string;
  squareSdkUrl: string;
}) {
  const cardRef = useRef<SquareCard | null>(null);
  const mountedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function initSquareCard() {
      try {
        await loadSquareSdk(squareSdkUrl);
        if (!active) return;
        const payments = window.Square?.payments(squareAppId, squareLocationId);
        if (!payments) throw new Error("Square payments unavailable.");
        const card = await payments.card();
        if (!active) return;
        await card.attach("#parr-balance-square-card-container");
        cardRef.current = card;
        mountedRef.current = true;
        setReady(true);
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load secure card entry.");
      }
    }

    if (!mountedRef.current) void initSquareCard();

    return () => {
      active = false;
      void cardRef.current?.destroy?.();
      cardRef.current = null;
      mountedRef.current = false;
    };
  }, [squareAppId, squareLocationId, squareSdkUrl]);

  async function submit() {
    if (!cardRef.current || busy) return;
    setBusy(true);
    setError(null);

    try {
      const tokenResult = await cardRef.current.tokenize();
      if (tokenResult.status !== "OK" || !tokenResult.token) {
        throw new Error(tokenResult.errors?.[0]?.message || "Card details could not be verified.");
      }

      const response = await fetch("/api/pay-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          sourceId: tokenResult.token,
        }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string; successUrl?: string } | null;
      if (!response.ok || !data?.successUrl) {
        throw new Error(data?.error || "Unable to process payment.");
      }

      window.location.href = data.successUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to process payment.");
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 rounded-[24px] border border-white/10 bg-[#09101f] p-5">
      <div className="text-[12px] font-black uppercase tracking-[0.18em] text-[#ffb07c]">Secure Payment</div>
      <p className="mt-2 text-sm leading-6 text-white/72">
        Enter a card below to complete the unpaid balance on this booking. This will not create a new shuttle order.
      </p>
      <div className="mt-4 rounded-[20px] border border-white/10 bg-[#0d1629] px-4 py-4">
        <div id="parr-balance-square-card-container" className="min-h-16" />
      </div>
      {error ? (
        <div className="mt-4 rounded-[18px] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</div>
      ) : null}
      {!error && !ready ? (
        <div className="mt-4 rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/72">Loading secure card entry...</div>
      ) : null}
      <button
        type="button"
        onClick={submit}
        disabled={!ready || busy}
        className={`mt-5 flex min-h-12 w-full items-center justify-center rounded-full px-6 text-sm font-black uppercase tracking-[0.16em] transition ${!ready || busy ? "cursor-not-allowed bg-white/10 text-white/45" : "bg-[#ffb07c] text-[#07111d] hover:bg-[#ffc298]"}`}
      >
        {busy ? "Processing payment..." : `Pay ${amountLabel}`}
      </button>
    </div>
  );
}
