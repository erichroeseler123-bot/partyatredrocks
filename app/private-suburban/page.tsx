export default function PrivateSuburbanPage() {
  return (
    <main className="min-h-screen bg-surface text-white">
      <section className="pt-28 pb-10 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-muted text-[10px] font-black uppercase tracking-[0.35em]">
            Private SUV Service
          </p>

          <h1 className="mt-3 text-5xl md:text-7xl font-black italic uppercase tracking-tight">
            Private Suburban
          </h1>

          <p className="mt-4 text-soft max-w-2xl">
            Door-to-door. Your group, your music. Round trip service for concerts across Denver &amp; Boulder.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {/* BLUE CTA */}
            <a
              href="#book"
              className="inline-flex items-center justify-center px-6 py-4 rounded-full bg-blue-600 hover:bg-blue-500 transition font-black uppercase tracking-widest text-[11px]"
            >
              Book Private Suburban
            </a>

            <a
              href="/"
              className="inline-flex items-center justify-center px-6 py-4 rounded-full border border-zinc-700 hover:border-zinc-500 transition font-black uppercase tracking-widest text-[11px]"
            >
              Back Home
            </a>
          </div>
        </div>
      </section>

      {/* Rezdy embed */}
      <section id="book" className="px-6 pb-24">
        <div className="max-w-5xl mx-auto rounded-[2.5rem] overflow-hidden border border-soft bg-surface/40">
          <div className="p-6 md:p-10 border-b border-soft">
            <h2 className="text-2xl md:text-3xl font-black italic uppercase">
              Book Now
            </h2>
            <p className="mt-2 text-muted text-sm">
              Pricing and availability are managed in Rezdy.
            </p>
          </div>

          <div className="p-2 md:p-4">
            <script
              defer
              type="text/javascript"
              src="https://gosnotransportation58.rezdy.com/pluginJs"
            ></script>

            <iframe
              seamless
              width="100%"
              height="1000px"
              frameBorder="0"
              className="rezdy rounded-[2rem] bg-surface"
              src="https://gosnotransportation58.rezdy.com/596193/suburban?iframe=true"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  );
}
