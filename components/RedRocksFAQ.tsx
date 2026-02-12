export default function RedRocksFAQ() {
  const items = [
    { q: "Where do you pick up?", a: "You’ll choose your pickup option during booking (Denver / Golden depending on the service)." },
    { q: "Do you wait after the show?", a: "Yes — return timing is built around show-night reality and the encore." },
    { q: "What if it rains?", a: "Shuttles run rain or shine. Dress for the forecast and bring a light layer for after sunset." },
    { q: "Can I cancel?", a: "Cancel up to 3 days before. After that the booking is non-cancelable." },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="bg-black/25 border border-white/10 rounded-[28px] p-6 md:p-8 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight">Red Rocks FAQ</h2>
        <div className="mt-6 grid gap-3">
          {items.map((it) => (
            <details key={it.q} className="rounded-2xl border border-white/10 bg-black/20 p-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <summary className="cursor-pointer font-black">{it.q}</summary>
              <div className="mt-2 text-white/70">{it.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
