import Link from "next/link";

export default function DispatchHub() {
  const options = [
    {
      title: "Red Rocks",
      detail: "Live Show List",
      link: "/venues/red-rocks-amphitheatre", // Links to dynamic router
      cta: "Book Dispatch",
      accent: "bg-red-600"
    },
    {
      title: "Mishawaka",
      detail: "$65 Round Trip",
      link: "/venues/mishawaka-amphitheatre", // Links to dedicated folder
      cta: "Reserve Seat",
      accent: "bg-blue-600"
    },
    {
      title: "All Other Venues", // Exact requested wording
      detail: "$250 Minimum",
      link: "/venues/all-venues", // Links to private dispatch logic
      cta: "Request Vehicle",
      accent: "bg-zinc-800"
    }
  ];

  return (
    <main className="min-h-screen bg-[#000] text-white p-6 md:p-12 font-sans selection:bg-red-600 relative overflow-hidden">
      {/* Visual Zhooze: Grid & Pulses */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <header className="relative z-10 max-w-7xl mx-auto pt-20 pb-24 border-b border-white/5">
        <div className="flex items-center gap-4 mb-10">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-red-900/50 bg-red-950/20">
            <div className="h-1.5 w-1.5 bg-red-600 animate-pulse rounded-full shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
            <span className="text-[9px] uppercase tracking-[0.4em] font-black text-red-500">System Active</span>
          </div>
          <span className="text-[9px] uppercase tracking-[0.4em] font-black text-zinc-700">Uplink: Denver_HQ</span>
        </div>
        
        {/* Requested Branding Typography */}
        <h1 className="text-6xl md:text-[8rem] font-black italic uppercase leading-[0.8] tracking-tighter mb-4">
          Party @ Red Rocks
        </h1>
        <h2 className="text-4xl md:text-7xl font-black italic uppercase leading-[0.8] tracking-tighter text-zinc-800">
          Dispatch Hub
        </h2>
      </header>

      {/* Uniform Grid Structure */}
      <section className="relative z-10 max-w-7xl mx-auto py-24 flex flex-col md:flex-row gap-6 items-stretch">
        {options.map((opt) => (
          <Link key={opt.title} href={opt.link} className="flex-1 group relative overflow-hidden border border-white/5 bg-zinc-950/50 backdrop-blur-sm p-12 rounded-[2.5rem] hover:border-white/20 transition-all duration-700 flex flex-col justify-between min-h-[450px]">
            <div className={`absolute -top-24 -right-24 w-64 h-64 ${opt.accent} blur-[120px] opacity-0 group-hover:opacity-20 transition-opacity duration-700`} />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-16">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500">{opt.detail}</span>
                <div className="h-4 w-4 text-zinc-800 group-hover:text-white transition-colors duration-500">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                </div>
              </div>
              <h3 className="text-6xl font-black italic uppercase tracking-tighter">{opt.title}</h3>
            </div>

            <div className="relative z-10 pt-12">
              <div className="inline-block bg-white text-black px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                {opt.cta}
              </div>
            </div>
          </Link>
        ))}
      </section>

      <footer className="relative z-10 max-w-7xl mx-auto py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-800">Verified Secure Booking Terminal</div>
        <a href="tel:7203696292" className="group flex items-center gap-4">
            <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest group-hover:text-red-600 transition-colors">Direct Line</span>
            <span className="text-3xl font-black italic uppercase tracking-tighter group-hover:text-white transition-colors">720.369.6292</span>
        </a>
      </footer>
    </main>
  );
}
