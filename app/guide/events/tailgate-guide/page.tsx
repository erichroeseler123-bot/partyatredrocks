import Link from 'next/link';

export default function TailgateGuide() {
  const faqs = [
    { q: "Why skip tailgating hassles and book private transportation instead?", a: "Tailgating is fun but stressful: hunting spots, lot traffic, and steep uphill hikes. Our private transportation eliminates it all—door-to-door pickup in a $399 Suburban (up to 6) or $599 van (up to 10), BYOB-friendly ride, and your vehicle waits for you through the show. Book private transportation → /book/red-rocks-amphitheatre/private." },
    { q: "How does private transportation make tailgating easier for groups?", a: "Groups love having one private vehicle for the night—pregame comfortably en route, no splitting into multiple rides. Door-to-door service gets you right up to the venue entrance, and the ride home is already reserved. Book your private ride → /book/red-rocks-amphitheatre/private." },
    { q: "Can I still tailgate and use private transportation?", a: "Yes—your driver picks up your group at your chosen address, takes you to the venue in time to tailgate before gates open, and stages on-site so your return ride is ready right after the encore." },
    { q: "Is tailgating allowed at Red Rocks in 2026?", a: "Yes, but rules are strict: no tents, no open flames, and no glass. Our private ride takes away parking worries so you can relax and focus on the show. Book private ride → /book/red-rocks-amphitheatre/private." },
    { q: "Can I bring drinks on the vehicle?", a: "In venue lots: beer/wine ok (no glass). In your private Suburban or van: BYOB-friendly for adult passengers—relax and enjoy the ride responsibly." },
    { q: "What's the best alternative to driving/parking yourself?", a: "Our private transportation service provides door-to-door round-trip service: $399 for a private Suburban or $599 for a private 10-passenger van. One driver, one vehicle, and guaranteed return after the concert." },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 bg-surface text-white text-left">
      {/* FAQ Schema for Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": { "@type": "Answer", "text": faq.a }
            }))
          }),
        }}
      />

      <header className="mb-16 border-l-4 border-[#4cc9f0] pl-8">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter">
          2026 <span className="text-[#4cc9f0]">Tailgate</span> vs. Shuttle
        </h1>
        <p className="mt-4 text-muted text-xl font-medium">
          Is driving worth the hassle? Compare the 2026 tailgate rules to our premium shuttle service.
        </p>
      </header>

      {/* Benefits Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-20">
        <div className="bg-surface-strong p-8 rounded-[2.5rem] border-soft shadow-soft">
          <h3 className="mb-4 font-black uppercase italic text-[#ffb07c]">Tailgating Realities</h3>
          <ul className="space-y-3 text-base text-muted">
            <li>• Arrive 3-4 hours early to find a spot.</li>
            <li>• No glass, no charcoal, no tents.</li>
            <li>• Post-show traffic can take 60+ minutes to exit.</li>
          </ul>
        </div>
        <div className="rounded-[2.5rem] border border-[#3df3ff]/35 bg-surface-strong p-8">
          <h3 className="text-green-500 font-black uppercase mb-4 italic">Shuttle Advantage</h3>
          <ul className="space-y-3 text-base text-muted">
            <li>• Door-to-door pickup for your group.</li>
            <li>• Pregame en route (BYOB-friendly).</li>
            <li>• **Vehicle Waits For You** through the entire show.</li>
          </ul>
        </div>
      </div>

      {/* Accordion FAQ Section */}
      <section className="space-y-4 mb-20">
        <h2 className="text-3xl font-black uppercase mb-8 italic">Red Rocks Tailgate FAQs</h2>
        {faqs.map((faq, index) => (
          <details key={index} className="group overflow-hidden rounded-3xl border-soft bg-surface-strong shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-[#4cc9f0] hover:shadow-2xl">
            <summary className="p-6 cursor-pointer font-bold text-white flex justify-between items-center list-none uppercase tracking-tighter">
              {faq.q}
              <span className="text-[#4cc9f0] transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="p-6 pt-0 text-muted text-base leading-relaxed border-t border-soft/50">
              {faq.a}
            </div>
          </details>
        ))}
      </section>

      {/* Final Conversion CTA */}
      <div className="btn-primary">
        <h2 className="text-3xl font-black mb-4 uppercase italic">Skip the Parking Search</h2>
        <p className="mb-8 text-xl font-medium text-white/82">
          Lock in your private Red Rocks ride today. $399 Private Suburban (up to 6) or $599 Private Van (up to 10). Door-to-door with guaranteed return.
        </p>
        <Link href="/book/red-rocks-amphitheatre/private" className="inline-block rounded-full bg-[#3df3ff] px-12 py-5 font-black uppercase text-[#08111e] transition hover:bg-[#62f6ff] shadow-lg">
          Book Private Red Rocks Ride
        </Link>
      </div>
    </div>
  );
}
