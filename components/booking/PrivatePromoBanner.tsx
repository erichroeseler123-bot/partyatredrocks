import { PRIVATE_TRANSPORT_PROMO } from "@/lib/privateTransportPromo";

export function PrivatePromoBanner({ className = "" }: { className?: string }) {
  return (
    <section
      className={[
        "rounded-[24px] border border-emerald-400/30 bg-[linear-gradient(135deg,rgba(16,185,129,0.18),rgba(6,9,18,0.92))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.28)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="text-[11px] font-black uppercase tracking-[0.24em] text-emerald-200">
        April private ride promo
      </div>
      <h2 className="mt-2 text-xl font-black tracking-tight text-white">
        {PRIVATE_TRANSPORT_PROMO.headline}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90">
        {PRIVATE_TRANSPORT_PROMO.detail}
      </p>
      <div className="mt-4 inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-white">
        Code: {PRIVATE_TRANSPORT_PROMO.code}
      </div>
    </section>
  );
}
