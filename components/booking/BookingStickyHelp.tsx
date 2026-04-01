'use client';

type Props = {
  smsHref: string;
  phoneLabel: string;
};

export default function BookingStickyHelp({ smsHref, phoneLabel }: Props) {
  return (
    <div className="fixed inset-x-4 bottom-4 z-40 md:hidden">
      <a
        href={smsHref}
        className="flex min-h-12 items-center justify-center rounded-full border border-cyan-300/35 bg-[#08101f]/92 px-5 text-sm font-black uppercase tracking-[0.16em] text-cyan-50 no-underline shadow-[0_18px_48px_rgba(0,0,0,0.45)] backdrop-blur"
      >
        Need Help? Text {phoneLabel}
      </a>
    </div>
  );
}
