import { BadgeCheck, DollarSign, Headphones, ShieldCheck } from "lucide-react";

const trustItems = [
  { icon: ShieldCheck, label: "Guaranteed Return" },
  { icon: DollarSign, label: "$59 Fixed / No Surge" },
  { icon: Headphones, label: "Text Support" },
  { icon: BadgeCheck, label: "Secure Rezdy Checkout" },
];

export function TrustStrip({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "flex flex-wrap justify-center gap-4 rounded-[24px] border border-white/10 bg-[#0b1224] px-5 py-5 text-sm text-white/90 sm:gap-6",
        className,
      ].join(" ").trim()}
    >
      {trustItems.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-[#ffb07c]" />
            <span className="font-medium">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
