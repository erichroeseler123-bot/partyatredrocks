import Link from "next/link";

export default function DispatchHub() {
  const options = [
    {
      title: "Red Rocks",
      detail: "Live Show List",
      link: "/venues/red-rocks-amphitheatre",
      cta: "Book Dispatch",
      accent: "bg-red-600"
    },
    {
      title: "Mishawaka",
      detail: "$65 Round Trip",
      link: "/venues/mishawaka-amphitheatre",
      cta: "Reserve Seat",
      accent: "bg-blue-600"
    },
    {
      title: "Private",
      detail: "$250 Minimum",
      link: "/venues/all-venues",
      cta: "Request Vehicle",
      accent: "bg-zinc-800"
    }
  ];

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 font-sans selection:bg-red-600">
      <header className="max-w-7xl mx-auto pt-20 pb-24 border-b border-white/10">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-2 w-2 bg-red-600 animate-pulse rounded-full" />
          <span className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-500">System Status: Active</span>
        </div>
        <h1 className="text-8xl md:text-[12rem] font-black italic uppercase leading-[0.8] tracking-tighter">
          Dispatch <br />
          <span className="text-zinc-900" style={{ WebkitTextStroke: '1px #333' }}>Hub</span>
        </h1>
        <p className="mt-12 text-zinc-500 max-w-xl text-lg uppercase font-bold tracking-tighter leading-tight">
          Professional Mountain Transport & Concert Shuttles. No Fluff. Direct Booking.
        </p>
      </header>

      <section className="max-w-7xl mx-auto py-24 grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((opt) => (
          <Link key={opt.title} href={opt.link} className="group relative overflow-hidden border border-white/10 bg-zinc-950 p-12 rounded-3xl hover:border-red-600/50 transition-all duration-500">
            <div className={`absolute top-0 right-0 w-32 h-32 ${opt.accent} blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity`} />
            <div className="relative z-10">
              <span className="text-[10px] uppercase tracking-widest font-black text-zinc-600">{opt.detail}</span>
              <h3 className="text-5xl font-black italic uppercase mt-4 mb-12 tracking-tighter group-hover:translate-x-2 transition-transform">{opt.title}</h3>
              <div className="inline-block bg-white text-black px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest group-hover:bg-red-600 group-hover:text-white transition-colors">
                {opt.cta}
              </div>
            </div>
          </Link>
        ))}
      </section>

      <footer className="max-w-7xl mx-auto py-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">© 2026 Party at Red Rocks / Dispatch Center</div>
        <a href="tel:7203696292" className="text-2xl font-black italic uppercase tracking-tighter hover:text-red-600 transition-colors">720.369.6292</a>
      </footer>
    </main>
  );
}
