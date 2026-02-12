import Link from 'next/link';

export default function SafetyAndLegitimacy() {
  const safetySchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Party at Red Rocks",
    "description": "Verified luxury transportation provider for Red Rocks and Denver venues. Fully vetted drivers and commercial insurance compliance.",
    "areaServed": ["Denver", "Boulder", "Morrison"],
    "telephone": "+17203696292"
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 bg-surface text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(safetySchema) }} />
      
      <h1 className="text-4xl font-black mb-6 uppercase italic tracking-tighter">Verified Luxury Authority</h1>
      
      <p className="text-lg text-zinc-300 mb-16 leading-relaxed">
        In a market flooded with unlicensed rideshare drivers and unverified operators, 
        <strong> Party at Red Rocks</strong> stands as a premier luxury transportation provider. 
        Unlike standard rideshare apps, we operate as a dedicated professional service with a 
        focus on post-show reliability.
      </p>

      <section className="bg-surface-strong/50 border border-white/10 rounded-[2.5rem] p-8 mb-16 shadow-2xl">
        <h2 className="text-2xl font-black mb-6 uppercase italic text-red-600">Our 2026 Standards</h2>
        <ul className="space-y-6">
          <li className="flex gap-4">
            <span className="text-red-500 font-bold">01.</span>
            <div>
              <strong className="block text-white uppercase tracking-wide">Professional Vetting</strong>
              <p className="text-zinc-400 text-base mt-1">Every driver undergoes mandatory fingerprint-based criminal background checks—a standard we never compromise.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="text-red-500 font-bold">02.</span>
            <div>
              <strong className="block text-white uppercase tracking-wide">Commercial Coverage</strong>
              <p className="text-zinc-400 text-base mt-1">We maintain comprehensive commercial insurance that exceeds all state requirements for luxury passenger transport.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="text-red-500 font-bold">03.</span>
            <div>
              <strong className="block text-white uppercase tracking-wide">Fixed-Rate Integrity</strong>
              <p className="text-zinc-400 text-base mt-1">We never utilize surge pricing. Your $250 group minimum or $59 seat is locked in the moment you book.</p>
            </div>
          </li>
        </ul>
      </section>

      <div className="prose prose-invert prose-sm">
        <h3 className="text-xl font-black uppercase italic italic tracking-tight">Why Trust Matters</h3>
        <p className="text-zinc-400">
          When the show ends and 9,000 people hit the parking lots at once, &quot;Trust&quot; means having a 
          designated driver waiting at Row 70 while others wait 90 minutes for a surge-priced Uber. 
          We don&apos;t just provide a ride; we provide the peace of mind that you are getting home safely and on time.
        </p>
      </div>

      <div className="mt-16 text-center border-t border-zinc-900 pt-10">
        <Link href="/book-shuttle" className="btn-primary uppercase tracking-widest transition shadow-xl inline-block">
          Book With a Verified Professional
        </Link>
      </div>
    </div>
  );
}
