'use client';

interface RezdyWidgetProps {
  productId?: string;
  accountBaseUrl?: string;
  height?: number | string;
}

export default function RezdyWidget({ 
  productId, 
  accountBaseUrl = "https://partyatredrocks.rezdy.com",
  height = 700 
}: RezdyWidgetProps) {
  const url = productId 
    ? `${accountBaseUrl}/calendar/${productId}?iframe=true`
    : `${accountBaseUrl}/catalog?iframe=true`;

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/50 backdrop-blur-md">
      <iframe
        src={url}
        width="100%"
        height={height}
        frameBorder="0"
        title="Booking Terminal"
        className="w-full"
      />
    </div>
  );
}
