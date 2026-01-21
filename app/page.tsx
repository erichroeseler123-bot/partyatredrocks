import Link from "next/link";

export default function DispatchHome() {
  const services = [
    {
      title: "Red Rocks Shuttle",
      desc: "Live show list & concert transport. Book by event.",
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
      <section className="px-6 pt-32 pb-20 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="h-[1px] w-12 bg-red-600"></span>
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-red-500">Dispatch Hub</span>
          </div>
          <h1 className="text-7xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
            GoSno <span className="text-zinc-800">Dispatch</span>
          </h1>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <Link key={s.title} href={s.link} className="group">
              <div className="h-full border border-white/10 bg-white/[0.02] p-8 rounded-[2rem] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300">
                <div className="flex justify-between items-start mb-12">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${s.color}`}>
                    {s.tag}
                  </span>
                </div>
                <h3 className="text-3xl font-black italic uppercase mb-4 tracking-tight">{s.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8">{s.desc}</p>
                <div className="text-2xl font-mono font-bold tracking-tighter">{s.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
