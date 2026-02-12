export default function SafetyStandards() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black mb-6">Colorado Shuttle Safety: Our Tier-1 Commitment</h1>
      <p className="text-lg mb-8">
        Party at Red Rocks (Party at Red Rocks) isn't just a transport service; we are a 
        <strong>Licensed Luxury Limousine Carrier</strong> regulated by the 
        <a href="https://puc.colorado.gov/trans" target="_blank" className="mx-1 underline text-red-700">Colorado PUC</a>.
      </p>

      <div className="space-y-8">
        <section className="border-b pb-8">
          <h3 className="text-xl font-bold">1. Background Checks (PUC Rule 6305)</h3>
          <p>Every driver in our fleet undergoes a fingerprint-based criminal background check through the CBI. We don't hire 'contractors'—we hire vetted professionals.</p>
        </section>

        <section className="border-b pb-8">
          <h3 className="text-xl font-bold">2. Vehicle Inspections</h3>
          <p>Our Suburbans and Sprinters undergo 19-point mechanical inspections every 12 months, exceeding standard passenger vehicle requirements.</p>
        </section>

        <section className="border-b pb-8">
          <h3 className="text-xl font-bold">3. Commercial Insurance</h3>
          <p>We carry $1.5M - $5M in commercial liability insurance (standard LL-authority levels), ensuring you are protected from the moment you step into the vehicle.</p>
        </section>
      </div>

      <div className="mt-12 p-6 bg-surface text-white rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <p className="text-base font-mono uppercase tracking-widest text-slate-400">Official Registration</p>
        <p className="text-2xl font-bold">PUC LICENSE: LL-02649</p>
      </div>
    </div>
  );
}
