import GbpPost from '@/app/components/GbpPost';

export default function UpdatesPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black mb-4">Live Venue Intelligence & Alerts</h1>
      <p className="text-lg text-slate-600 mb-10">
        Real-time updates on parking, weather, and show-day logistics for Red Rocks 2026.
      </p>

      <div className="space-y-8">
        {/* You will manually or programmatically add posts here that match your GBP */}
        <GbpPost 
          date="Feb 2, 2026"
          title="Zac Brown Band: October Shuttle Alert"
          content="ZBB is officially trending toward a sell-out. Rideshare surges for these dates are projected at $160+. We have 14 seats remaining on the shared shuttle from Golden."
          ctaLink="/guide/events/zac-brown-band"
        />

        <GbpPost 
          date="Jan 28, 2026"
          title="New Bag Policy Enforcement"
          content="Venue security has increased enforcement of the 'Single-Pocket' rule. If your bag has more than one zipper, you will be turned away. Read our full guide on what to bring."
          ctaLink="/guide/logistics/bag-policy"
        />
      </div>

      <div className="mt-16 p-8 bg-slate-900 rounded-3xl text-white">
        <h2 className="text-white text-xl font-bold mb-2">Want these updates via SMS?</h2>
        <p className="text-slate-400 mb-4">Text 'REDROCKS' to [Your Number] for show-day traffic and weather alerts.</p>
      </div>
    </div>
  );
}
