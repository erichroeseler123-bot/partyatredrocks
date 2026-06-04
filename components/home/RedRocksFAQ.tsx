const FAQ = [
  {
    q: "Do you return after the show?",
    a: "Yes. Drivers stay staged and leave after the encore window for the return ride.",
  },
  {
    q: "Is this round-trip?",
    a: "Yes. Private Suburban and private van bookings include the ride to Red Rocks and the return after the show.",
  },
  {
    q: "What if it rains or snows?",
    a: "Service runs rain or shine unless roads/venue conditions become unsafe. Check day-of messages.",
  },
  {
    q: "Can I bring drinks?",
    a: "Keep it respectful. Follow venue rules and local laws. If you're unsure, ask before your trip.",
  },
];

export default function RedRocksFAQ() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-surface-strong border-soft shadow-soft rounded-[32px] p-7 md:p-10">
          <p className="text-[11px] font-black uppercase tracking-[0.32em] text-muted">
            Red Rocks info
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl font-black tracking-tight">
            FAQ + show-night reality
          </h2>
          <p className="mt-3 text-soft max-w-2xl">
            Short answers. No fluff. Built for show nights.
          </p>

          <div className="mt-8 space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="faq-item">
                <summary className="faq-summary">
                  <span className="faq-q">{f.q}</span>
                  <span className="faq-icon" aria-hidden>+</span>
                </summary>
                <div className="faq-a">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
