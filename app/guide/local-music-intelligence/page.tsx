import HomepageBridge from "@/components/HomepageBridge";

export const metadata = {
  title: "Local Music Intelligence | Party at Red Rocks",
  description:
    "Show-night logistics, pickup reality, tailgate rules, and how to avoid the post-show trap.",
};

export default function LocalMusicIntelPage() {
  return (
    <main className="text-white">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-10">
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tight">
          Local Music Intelligence
        </h1>
        <p className="mt-4 max-w-2xl text-white/70">
          Real-world venue logic: show-night logistics, pickup reality, tailgate rules,
          and how to avoid the post-show trap.
        </p>
      </div>

      {/* reuse the existing cards section here */}
      <HomepageBridge />
    </main>
  );
}
