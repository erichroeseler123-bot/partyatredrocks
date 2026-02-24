// components/utilities/WeatherWhatToWear.tsx
export default function WeatherWhatToWear() {
  return (
    <div className="panel-soft rounded-2xl p-6 mb-10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <h3 className="text-xl font-black uppercase mb-4 tracking-tight">Red Rocks Weather & What to Wear</h3>
      <div className="space-y-4 text-sm text-soft">
        <div className="p-4 bg-zinc-800/50 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <p className="font-bold text-white mb-1">Spring/Fall (Mar-May, Sep-Oct)</p>
          <p>40-70°F • Layers + light jacket • Wind/rain possible</p>
        </div>
        <div className="p-4 bg-zinc-800/50 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <p className="font-bold text-white mb-1">Summer (Jun-Aug)</p>
          <p>60-90°F days, 45-65°F nights • T-shirt + hoodie post-sunset</p>
        </div>
        <div className="p-4 bg-zinc-800/50 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <p className="font-bold text-white mb-1">Pro Tip</p>
          <p>Sunscreen/hat for day shows • Closed-toe shoes for rocky paths</p>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted italic">Check forecast 24h before — shuttles run rain or shine.</p>
    </div>
  );
}
