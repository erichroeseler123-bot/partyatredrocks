'use client';

export default function RezdyWidget({ productId }: { productId?: string }) {
  const url = productId 
    ? `https://partyatredrocks.rezdy.com/calendar/${productId}?iframe=true`
    : "https://partyatredrocks.rezdy.com/catalog?iframe=true";

  return (
    <iframe
      src={url}
      width="100%"
      height="700px"
      frameBorder="0"
      className="rounded-3xl border border-white/10 bg-zinc-900/20"
      title="Booking Terminal"
    />
  );
}
