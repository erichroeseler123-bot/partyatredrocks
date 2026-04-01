'use client';

import { useMemo, useState } from 'react';

type Props = {
  showName: string;
  phoneDisplay: string;
  phoneE164: string;
  websiteUrl: string;
};

export default function BookingSupportCard({
  showName,
  phoneDisplay,
  phoneE164,
  websiteUrl,
}: Props) {
  const [textPromptOpen, setTextPromptOpen] = useState(false);
  const [downloadPromptOpen, setDownloadPromptOpen] = useState(false);

  const smsHref = useMemo(() => {
    const body = encodeURIComponent(`Hey Party at Red Rocks! I'm on the shuttle for ${showName}.`);
    return `sms:${phoneE164}?&body=${body}`;
  }, [phoneE164, showName]);

  const vcfHref = useMemo(() => {
    const params = new URLSearchParams({
      website: websiteUrl,
      phone: phoneDisplay,
    });
    return `/api/contact-card?${params.toString()}`;
  }, [phoneDisplay, websiteUrl]);

  return (
    <section className="rounded-[28px] border border-[#ffb07c]/20 bg-[linear-gradient(135deg,rgba(143,208,255,0.12),rgba(9,16,31,0.96)_48%,rgba(255,176,124,0.10))] p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[var(--brand-orange)]">Help & Support</div>
          <h2 className="mt-4 text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">Need help on show day?</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/76">
            Get our support number into your phone now so you do not have to hunt through email or search the site when the group is moving.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Text Us Now</div>
          <p className="mt-3 text-sm leading-7 text-white/78">Opens your messaging app with the right number and a ready-to-send show-day message.</p>
          <div className="mt-4">
            <a
              href={smsHref}
              onClick={() => setTextPromptOpen(true)}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ffb07c]/28 bg-[#ffb07c]/14 px-5 text-sm font-black uppercase tracking-[0.16em] text-white no-underline transition hover:bg-[#ffb07c]/20"
            >
              Text Us Now
            </a>
          </div>
          {textPromptOpen ? (
            <div className="mt-4 rounded-[18px] border border-emerald-300/25 bg-emerald-500/10 px-4 py-4 text-sm leading-7 text-emerald-50">
              <div className="font-black uppercase tracking-[0.14em] text-emerald-100">Message app opened.</div>
              <p className="mt-2">Pro tip: tap the number at the top of your text screen and save it as <span className="font-black text-white">Red Rocks Shuttle Info</span> so we are one tap away for every show.</p>
            </div>
          ) : null}
        </div>

        <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Add To Contacts</div>
          <p className="mt-3 text-sm leading-7 text-white/78">Download our contact card once, save it to your phone, and keep Party at Red Rocks in your contact list all season.</p>
          <div className="mt-4">
            <a
              href={vcfHref}
              download
              onClick={() => setDownloadPromptOpen(true)}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/14 px-5 text-sm font-black uppercase tracking-[0.16em] text-cyan-50 no-underline transition hover:border-cyan-200/45 hover:bg-cyan-300/20"
            >
              Save To Contacts
            </a>
          </div>
          {downloadPromptOpen ? (
            <div className="mt-4 rounded-[18px] border border-cyan-300/25 bg-cyan-400/10 px-4 py-4 text-sm leading-7 text-cyan-50">
              <div className="font-black uppercase tracking-[0.14em] text-cyan-100">Contact card ready.</div>
              <p className="mt-2">Open the downloaded contact card and save it as <span className="font-black text-white">Red Rocks Shuttle Info</span>. Next time, just type <span className="font-black text-white">Red Rocks</span> in your contacts and text us.</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
