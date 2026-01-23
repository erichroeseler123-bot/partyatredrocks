export default function PrivateSuburbanPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      {/* =========================
          HERO / HEADER
      ========================= */}
      <header className="max-w-4xl mx-auto text-center mb-20">
        <h1 className="text-5xl md:text-6xl font-black italic uppercase">
          Private Suburban
        </h1>
        <p className="text-zinc-400 mt-6 text-lg">
          Door-to-door luxury transportation to Red Rocks and Colorado venues.
        </p>
      </header>

      {/* =========================
          INFO STRIP
      ========================= */}
      <section className="max-w-4xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-900/40">
            <p className="text-sm uppercase tracking-widest text-zinc-500">
              Capacity
            </p>
            <p className="text-2xl font-black mt-2">Up to 6 Guests</p>
          </div>

          <div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-900/40">
            <p className="text-sm uppercase tracking-widest text-zinc-500">
              Price
            </p>
            <p className="text-2xl font-black mt-2">$499 Flat Rate</p>
          </div>

          <div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-900/40">
            <p className="text-sm uppercase tracking-widest text-zinc-500">
              Includes
            </p>
            <p className="text-2xl font-black mt-2">Wait & Return</p>
          </div>
        </div>
      </section>

      {/* =========================
          BOOKING CTA (BLUE)
      ========================= */}
      <section className="max-w-4xl mx-auto text-center mb-20">
        <a
          href="#booking"
          className="inline-block bg-blue-600 hover:bg-blue-500 transition text-white px-10 py-5 rounded-full font-black uppercase tracking-wide"
        >
          Book Private SUV
        </a>
      </section>

      {/* =========================
          REZDY BOOKING WIDGET
      ========================= */}
      <section
        id="booking"
        className="max-w-5xl mx-auto border border-zinc-800 rounded-[2.5rem] overflow-hidden bg-zinc-900/40"
      >
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
          className="rezdy"
          src="https://gosnotransportation58.rezdy.com/596193/suburban?iframe=true"
        ></iframe>
      </section>
    </main>
  );
}
