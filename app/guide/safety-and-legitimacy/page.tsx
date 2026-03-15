import Link from 'next/link';

export default function SafetyAndLegitimacy() {
  const safetySchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Party at Red Rocks",
    "description": "Transportation provider for Red Rocks and Denver venues with vetted drivers and commercial insurance coverage.",
    "areaServed": ["Denver", "Boulder", "Morrison"],
    "telephone": "+17203696292"
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 bg-surface text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(safetySchema) }} />
      
      <h1 className="text-4xl font-black mb-6 uppercase italic tracking-tighter">Professional Transportation Standards</h1>
      
      <p className="text-lg text-soft mb-16 leading-relaxed">
        <strong>Party at Red Rocks</strong> runs shared shuttles and private rides for Red Rocks and Denver-area venues.
        This page covers the driver, insurance, and booking standards behind the service.
      </p>

      <section className="panel rounded-[2.5rem] p-8 mb-16 shadow-2xl">
          <h2 className="mb-6 text-2xl font-black uppercase italic text-[#4cc9f0]">Our 2026 Standards</h2>
        <ul className="space-y-6">
          <li className="flex gap-4">
            <span className="font-bold text-[#ffb07c]">01.</span>
            <div>
              <strong className="block text-white uppercase tracking-wide">Professional Vetting</strong>
              <p className="text-muted text-base mt-1">Every driver undergoes mandatory fingerprint-based criminal background checks—a standard we never compromise.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-[#ffb07c]">02.</span>
            <div>
              <strong className="block text-white uppercase tracking-wide">Commercial Coverage</strong>
              <p className="text-muted text-base mt-1">We maintain commercial insurance coverage for passenger transportation service.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-[#ffb07c]">03.</span>
            <div>
              <strong className="block text-white uppercase tracking-wide">Fixed-Rate Integrity</strong>
              <p className="text-muted text-base mt-1">Your $59 seat or private-ride rate is set when you book.</p>
            </div>
          </li>
        </ul>
      </section>

      <div className="prose prose-invert prose-sm">
        <h3 className="text-xl font-black uppercase italic italic tracking-tight">Why It Helps</h3>
        <p className="text-muted">
          When the show ends and the lots empty all at once, clear pickup planning matters.
          A reserved ride means your return plan is already in place before the encore ends.
        </p>
      </div>

      <div className="mt-16 text-center border-t border-zinc-900 pt-10">
        <Link href="/book" className="btn-primary uppercase tracking-widest transition shadow-xl inline-block">
          Book a Ride
        </Link>
      </div>
    </div>
  );
}
