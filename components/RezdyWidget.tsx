'use client';

interface RezdyWidgetProps {
  productId?: string;
  height?: number | string;
}

export default function RezdyWidget({ 
  productId, 
  height = 700 // Default height for individual show pages
}: RezdyWidgetProps) {
  const url = productId 
    ? `https://partyatredrocks.rezdy.com/calendar/${productId}?iframe=true`
    : "https://partyatredrocks.rezdy.com/catalog?iframe=true";

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/20">
      <iframe
        src={url}
        width="100%"
        height={height}
        frameBorder="0"
        title="Booking Terminal"
      />
    </div>
  );
}
