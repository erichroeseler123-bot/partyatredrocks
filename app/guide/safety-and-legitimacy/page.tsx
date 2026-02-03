import Link from 'next/link';

export default function SafetyLegitimacy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black mb-6">Licensed & Regulated Authority</h1>
      <p className="text-lg text-slate-700 mb-8">
        Party at Red Rocks (dba Party at Red Rocks) operates under the strict oversight of the 
        <a href="https://puc.colorado.gov/trans" target="_blank" className="text-red-700 underline mx-1">Colorado Public Utilities Commission</a>. 
        Unlike unlicensed rideshare drivers, we are a registered Tier-1 Luxury Limousine provider.
      </p>

      <section className="bg-slate-50 border rounded-2xl p-8 mb-10">
        <h2 className="text-2xl font-bold mb-4">Verification Credentials</h2>
        <ul className="space-y-4">
          <li><strong>PUC License:</strong> LL-02649</li>
          <li><strong>Authority Type:</strong> Luxury Limousine (LL) Limited Regulation Carrier</li>
          <li><strong>Compliance:</strong> We exceed all <a href="https://puc.colorado.gov/limited-regulation-carriers-industry-info" target="_blank" className="text-blue-700 underline">PUC safety inspection standards</a> and commercial insurance requirements.</li>
        </ul>
      </section>

      <div className="prose prose-slate">
        <h3>Why Legitimacy Matters in 2026</h3>
        <p>
          In the competitive Denver transport market, "Experience" and "Trust" are everything. 
          Our drivers undergo mandatory fingerprint-based criminal background checks as required by 
          <strong>PUC Rule 6305</strong>. We don't just provide a ride; we provide a legally vetted, 
          professional transport environment.
        </p>
      </div>

      <div className="mt-12 text-center">
        <Link href="/book-shuttle" className="bg-red-700 text-white px-8 py-3 rounded-full font-bold hover:bg-red-800 transition">
          Book with a Licensed Professional
        </Link>
      </div>
    </div>
  );
}
