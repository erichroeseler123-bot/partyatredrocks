from pathlib import Path
from datetime import date

ROOT = Path("app/guide")
today = date.today().strftime("%b %d, %Y")

def ensure(p: Path):
    p.mkdir(parents=True, exist_ok=True)

def write_page(
    dir_path: Path,
    title: str,
    description: str,
    kicker: str,
    bullets: list[str],
    faqs: list[tuple[str, str]],
    back_href="/guide",
    back_label="Guides",
):
    ensure(dir_path)
    out = dir_path / "page.tsx"

    # Build FAQ HTML safely (outside the big TSX f-string)
    faq_html = ""
    if faqs:
        blocks = []
        for q, a in faqs:
            blocks.append(
f'''            <details className="rounded-2xl border border-white/10 bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">{q}</summary>
              <p className="mt-2 text-zinc-300 leading-relaxed">{a}</p>
            </details>'''
            )
        faq_html = "\n".join(blocks)

    # Minimal FAQ schema JSON-LD
    faq_ld = ""
    if faqs:
        faq_items = ",\n".join([
            f'''      {{
        "@type": "Question",
        "name": {q!r},
        "acceptedAnswer": {{"@type":"Answer","text": {a!r}}}
      }}''' for q, a in faqs
        ])
        faq_ld = f"""
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
{faq_items}
            ],
          }}),
        }}
      />
""".rstrip()

    bullet_list = "\n".join([f"              <li>{b}</li>" for b in bullets])

    content = f'''import Link from "next/link";

export const metadata = {{
  title: "{title}",
  description: "{description}",
}};

export default function Page() {{
  return (
    <main className="min-h-screen bg-surface text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500">
          {kicker}
        </div>

        <h1 className="mt-3 text-5xl md:text-6xl font-black tracking-tight">
          {title}
        </h1>

        <p className="mt-5 text-lg text-zinc-300 leading-relaxed">
          {description}
        </p>

        <div className="mt-5 text-sm text-zinc-500">
          Last updated: {today}
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-surface-strong p-6">
          <h2 className="text-2xl font-black">What actually matters</h2>
          <ul className="mt-4 space-y-2 text-zinc-300 leading-relaxed list-disc pl-5">
{bullet_list}
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/book-shuttle" className="btn-primary">
            Book Shuttle — $59/pp →
          </Link>
          <Link
            href="{back_href}"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            Back to {back_label} →
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-black">Quick FAQ</h2>
          <div className="mt-4 space-y-3">
{faq_html if faq_html else "            {/* No FAQs yet */}"}
          </div>
        </div>

{faq_ld}

        <footer className="mt-16 pt-10 border-t border-white/10 text-sm text-zinc-400">
          This is the authority layer: no fluff, no hype — just show-night reality and what works.
        </footer>
      </div>
    </main>
  );
}}
'''
    out.write_text(content, encoding="utf-8")
    print("Wrote", out)

# ----------------------------
# CATEGORY HUBS
# ----------------------------
write_page(
    ROOT / "transportation",
    "Red Rocks Transportation Guide",
    "Shuttle vs rideshare, pricing reality, and the most reliable way to get out after the encore.",
    "Transportation",
    [
        "Rideshare is fine early — it fails most often after the show (surge + chaos + enforcement).",
        "Your real risk is post-show extraction, not getting there.",
        "Fixed-route shuttles win on predictability; private SUVs win on control.",
        "If you drive, plan your exit route before doors open.",
    ],
    [
        ("Is Uber/Lyft reliable after the show?", "It can be, but it’s the highest-failure window due to surge, traffic patterns, and pickup enforcement."),
        ("What’s the most reliable option?", "A scheduled shuttle or pre-arranged private pickup with a defined meet point."),
        ("Where is the main pickup chaos?", "Lower areas and rideshare zones right after encore—timing and meet points matter."),
    ],
)

write_page(
    ROOT / "parking",
    "Red Rocks Parking Guide",
    "Which lots fill first, how to reduce walking, and how to avoid the exit gridlock that traps people for an hour.",
    "Parking",
    [
        "Lots fill by time, not by good intentions—earlier arrival changes everything.",
        "The best ‘experience’ lot isn’t always the best ‘exit’ lot.",
        "Leave strategy beats parking strategy on sold-out nights.",
        "If you want a fast exit, park with your departure route in mind.",
    ],
    [
        ("Is parking free at Red Rocks?", "Often yes for general events, but rules can vary by event; plan to arrive early regardless."),
        ("What time should I arrive?", "For busy nights, arriving well before doors gives you better lot selection and less stress."),
        ("How do I avoid gridlock?", "Pick an exit route before the show, and don’t wait until the crowd surge to move."),
    ],
)

write_page(
    ROOT / "policies",
    "Red Rocks Policies Guide",
    "Bag policy, entry rules, and the practical version of what actually gets enforced at the gate.",
    "Policies",
    [
        "Rule text and enforcement don’t always match — plan for strict enforcement.",
        "Small + simple beats clever every time at the gate.",
        "Anything that slows screening increases your chance of being turned back.",
        "If you’re unsure, don’t bring it.",
    ],
    [
        ("What bags usually pass?", "Small, simple bags that are easy to screen. Avoid complicated pockets and oversized bags."),
        ("Will they really turn me away?", "Yes—especially on busy nights when screening is strict and lines are long."),
        ("What’s the safest move?", "Bring as little as possible."),
    ],
)

write_page(
    ROOT / "show-night-strategy",
    "Show-Night Strategy Guide",
    "Arrival windows, crowd flow, weather risk, and the exit plan that prevents ‘stuck at Red Rocks’ syndrome.",
    "Strategy",
    [
        "The show-night ‘pain’ is predictable: arrival congestion + post-show extraction.",
        "Weather and temperature swings are the silent killers of comfort.",
        "Have a meeting point and backup plan before the show starts.",
        "Leaving smart matters more than arriving smart on packed nights.",
    ],
    [
        ("What time should I plan to leave?", "Plan around the encore + crowd surge. Your best window depends on whether you prioritize speed or the full ending."),
        ("Where should we meet after the show?", "Pick a specific landmark and stick to it—service and crowds make improvising fail."),
        ("What if it’s cold or snowing?", "Assume longer exit times and plan warm layers + a clear pickup plan."),
    ],
)

# ----------------------------
# LEAF PAGES
# ----------------------------
write_page(
    ROOT / "transportation" / "shuttle-vs-uber",
    "Shuttle vs Uber to Red Rocks",
    "A real-world comparison: price, reliability, pickup friction, and how people get stranded after the encore.",
    "Transportation • Comparison",
    [
        "Uber/Lyft: best for flexible arrival; worst for post-show reliability.",
        "Shuttle: best for predictable return; requires showing up on time.",
        "Private SUV: best for control + comfort; higher cost but fewer failure modes.",
        "Your biggest risk is the post-show surge + pickup enforcement window.",
    ],
    [
        ("Why does rideshare fail after the show?", "Everyone requests at once, traffic patterns compress, and pickups are constrained to specific zones."),
        ("Is a shuttle worth it?", "If you value certainty and a guaranteed ride back, yes."),
        ("What’s the best choice for groups?", "Shuttle for budget + simplicity; private SUV for control and comfort."),
    ],
    back_href="/guide/transportation",
    back_label="Transportation",
)

write_page(
    ROOT / "parking" / "best-lots",
    "Best Parking Lots at Red Rocks",
    "Which lots fill first, what’s closest to entries, and how to park for a faster exit.",
    "Parking • Lots",
    [
        "Early arrival = better options. Late arrival = whatever’s left.",
        "Closest lots can be slowest to exit if everyone funnels the same way.",
        "Parking for exit means choosing a route, not just a spot.",
        "If you’re with a group, pick a meet point before you separate.",
    ],
    [
        ("Which lot is closest?", "Closest varies by where you enter—arriving early is what actually determines proximity."),
        ("How do I get out faster?", "Choose a departure route before the show ends and avoid the biggest crowd funnels."),
        ("Is it okay to tailgate?", "Follow venue rules for the event—some nights are stricter than others."),
    ],
    back_href="/guide/parking",
    back_label="Parking",
)

write_page(
    ROOT / "show-night-strategy" / "post-show-pickup-plan",
    "Post-Show Pickup Plan (Don’t Get Stranded)",
    "Where to go, what to text, and how to avoid the post-encore chaos window that strands people.",
    "Strategy • Exit",
    [
        "Decide: speed exit vs full encore. You can’t optimize both.",
        "Pick a meet point that’s specific and easy to describe.",
        "Text instructions before the encore starts (service can be unreliable).",
        "Have a fallback: warm place, backup pickup, or shuttle plan.",
    ],
    [
        ("What’s the #1 mistake people make?", "Waiting until after encore to decide where to meet."),
        ("What should I text my driver/friends?", "A landmark + ETA + backup meet point."),
        ("How long does it take to get out?", "Depends on crowd + weather + enforcement. Assume it takes longer on sold-out nights."),
    ],
    back_href="/guide/show-night-strategy",
    back_label="Strategy",
)

print("Done.")
