'use client';

import { useEffect, useState } from 'react';

type Props = {
  storageKey: string;
};

const ITEMS = [
  'The right bag: single-pocket only up to 13" x 15" x 8" or a 2L hydration pack with only one extra pocket.',
  'Water: one 32 oz factory-sealed plastic bottle or one empty reusable bottle.',
  'Layers: hoodie, puffy, or another warm layer because it can drop fast after sunset.',
  'Rain gear: poncho or light jacket. No umbrellas.',
  'The essentials: ID, ticket on your phone, and comfortable shoes for stairs and walking.',
  'Food: sliced or prepared and packed in a clear 1-gallon plastic bag.',
] as const;

export default function BookingPackChecklist({ storageKey }: Props) {
  const [checked, setChecked] = useState<boolean[]>(() => ITEMS.map(() => false));

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      setChecked(ITEMS.map((_, index) => Boolean(parsed[index])));
    } catch {
      // ignore localStorage parsing failures
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(checked));
    } catch {
      // ignore localStorage write failures
    }
  }, [checked, storageKey]);

  const completeCount = checked.filter(Boolean).length;

  return (
    <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Pack Like A Pro</div>
          <p className="mt-2 text-sm leading-6 text-white/76">Check these off as you pack. Your progress stays saved on this phone.</p>
        </div>
        <div className="text-sm font-black text-[var(--brand-cyan)]">{completeCount}/{ITEMS.length} packed</div>
      </div>
      <div className="mt-4 space-y-3">
        {ITEMS.map((item, index) => {
          const isChecked = checked[index];
          return (
            <label
              key={item}
              className={`flex cursor-pointer items-start gap-3 rounded-[18px] border px-4 py-3 text-sm leading-6 transition ${isChecked ? 'border-emerald-300/25 bg-emerald-400/10 text-white' : 'border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.06]'}`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => {
                  setChecked((current) => current.map((value, itemIndex) => (itemIndex === index ? !value : value)));
                }}
                className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent accent-[var(--brand-cyan)]"
              />
              <span>{item}</span>
            </label>
          );
        })}
      </div>
      <p className="mt-4 text-sm leading-6 text-white/70"><span className="font-black text-white">Pro tip:</span> if you bring a hydration pack, it needs to be empty before you hit the security line.</p>
    </div>
  );
}
