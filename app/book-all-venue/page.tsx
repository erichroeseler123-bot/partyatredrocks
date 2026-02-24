export default function BookAllVenue() {
  return (
    <main className="min-h-screen bg-surface text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-8">
          Book Your <span className="text-red-600">City Service</span>
        </h1>
        <p className="text-xl text-muted mb-12">
          Flat rate door-to-door transport for any venue in Denver or Boulder. 
          Groups up to 6 passengers per vehicle.
        </p>
        
        <div className="panel-soft p-10 rounded-[3rem] shadow-2xl mb-12">
          <h2 className="text-3xl font-black mb-4">$250 Flat Rate</h2>
          <p className="text-muted mb-8 font-medium">Includes pickup, drop-off, and waiting return service.</p>
          <a 
            href="tel:7203696292" 
            className="block w-full btn-primary uppercase shadow-lg transition"
          >
            Call/Text to Book: 720-369-6292
          </a>
        </div>
        
        <p className="text-muted text-sm">
          *Price covers round-trip transport for the entire group. No surge pricing, no hidden fees.
        </p>
      </div>
    </main>
  );
}
