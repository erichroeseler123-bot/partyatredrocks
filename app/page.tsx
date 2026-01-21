import Link from "next/link";

export default function DispatchHome() {
  const services = [
    {
      title: "Red Rocks Shuttle",
      desc: "Live show list & premium concert transport. Book by event.",
      link: "/venues/red-rocks-amphitheatre",
      price: "Per Person",
      tag: "Live Shows",
      color: "bg-red-600"
    },
    {
      title: "Mishawaka Shuttle",
      desc: "$65 Shared shuttle service through the Poudre Canyon.",
      link: "/venues/mishawaka-amphitheatre",
      price: "$65 RT",
      tag: "Shared",
      color: "bg-blue-600"
    },
    {
      title: "All-Venue Private",
      desc: "Private transport to any front-range venue.",
      link: "/venues/all-venues",
      price: "$250 Min",
      tag: "Private",
      color: "bg-zinc-800"
    }
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-red-500">
      {/* Header Area */}
      <section className="px-6 pt-32 pb-20 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="h-[1px] w-12 bg-red-600"></span>
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-red-500">
              Party at Red Rocks / Dispatch Center
            </span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8]">
            Dispatch <br />
            <span className="text-zinc-900 outline-text">Hub</span>
          </h1>
          <p className="mt-10 text-zinc-500 max-w-xl text-lg leading-relaxed uppercase font-bold tracking-tight">
            Professional mountain transport and concert shuttles. Select a destination to view availability.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((s) => (
            <Link key={s.title} href={s.link} className="group">
              <div className="h-full border border-white/10 bg-white/[0.01] p-10 rounded-[2.5rem] hover:bg-white/[0.03] hover:border-white/20 transition-all duration-500 flex flex-col justify-between">
                <div>
                  <div className="mb-12">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${s.color}`}>
                      {s.tag}
                    </span>
                  </div>
                  <h3 className="text-4xl font-black italic uppercase mb-4 tracking-tighter group-hover:text-red-500 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-10 font-medium">
                    {s.desc}
                  </p>
                </div>
                <div className="text-3xl font-mono font-bold tracking-tighter text-white">
                  {s.price}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer Dispatch Line */}
      <footer className="px-6 py-12 border-t border-white/5 text-center">
        <a href="tel:7203696292" className="text-zinc-700 text-[11px] uppercase tracking-[0.4em] font-black hover:text-white transition-colors">
          Direct Dispatch: (720) 369-6292
        </a>
      </footer>
    </main>
  );
}
