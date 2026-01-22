'use client';

interface RezdyWidgetProps {
  accountBaseUrl?: string;
  productId?: string;
}

export default function RezdyWidget({ 
  accountBaseUrl = "https://partyatredrocks.rezdy.com", // Your default
  productId 
}: RezdyWidgetProps) {
  // If no specific product is passed, we show the general booking catalog
  const bookingUrl = productId 
    ? `${accountBaseUrl}/calendar/${productId}?iframe=true` 
    : `${accountBaseUrl}/catalog?iframe=true`;

  return (
    <div className="w-full min-h-[600px] bg-zinc-900/20 rounded-2xl overflow-hidden border border-white/5">
      <iframe
        src={bookingUrl}
        width="100%"
        height="600px"
        frameBorder="0"
        allowFullScreen
        title="Rezdy Booking Terminal"
      />
    </div>
  );
}
