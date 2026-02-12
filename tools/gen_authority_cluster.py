import json
from pathlib import Path

SPEC_PATH = Path("_authority_spec.json")

HUB_TEMPLATE = """import Link from "next/link";

export const metadata = {{
  title: {title!r},
  description: {description!r},
}};

export default function Page() {{
  return (
    <main className="min-h-screen bg-surface text-white px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight">
          {title}
        </h1>
        <p className="mt-4 text-lg text-zinc-300 max-w-3xl">
          {description}
        </p>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
{link_cards}
        </div>

        <div className="mt-14">
          <Link href="{ctaHref}" className="btn-primary">
            {ctaText}
          </Link>
          <div className="mt-3 text-sm text-zinc-300">
            Seats fill fast on sold-out shows. Lock it in now.
          </div>
        </div>
      </div>
    </main>
  );
}}
"""

LEAF_TEMPLATE = """import Link from "next/link";

export const metadata = {{
  title: {title!r},
  description: {description!r},
}};

export default function Page() {{
  return (
    <main className="min-h-screen bg-surface text-white px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <nav className="text-sm text-zinc-400">
          <Link className="hover:text-white" href="{hubHref}">Transportation</Link>{{" "}}
          <span className="text-zinc-600">/</span> {crumb}
        </nav>

        <h1 className="mt-4 text-5xl font-black tracking-tight">{title}</h1>
        <p className="mt-4 text-lg text-zinc-300">
          {description}
        </p>

        <section className="mt-10 bg-surface-strong border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-bold">Quick answer</h2>
          <p className="mt-3 text-zinc-300">
            If you want predictable pricing and a guaranteed return, shuttle wins. If you gamble on rideshare, plan a window.
          </p>
        </section>

        <section className="mt-10 grid gap-6">
{cards}
        </section>

        <div className="mt-12">
          <Link href="/book-shuttle" className="btn-primary">
            Book the $59 shuttle →
          </Link>
        </div>
      </div>
    </main>
  );
}}
"""

CARD_BLOCK = """          <div className="bg-surface-strong border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold">{h}</h3>
            <p className="mt-2 text-zinc-300">
              {p}
            </p>
          </div>"""

LINK_CARD = """          <Link
            href="{href}"
            className="block p-6 bg-surface-strong rounded-2xl border border-white/10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <h3 className="text-xl font-bold mb-2">{h}</h3>
            <p className="text-zinc-300">{p}</p>
          </Link>"""

def main():
  spec = json.loads(SPEC_PATH.read_text())
  base = Path(spec["base"])
  base.mkdir(parents=True, exist_ok=True)

  hub = spec["hub"]
  leaves = spec["leaves"]

  # Hub links to leaves
  link_cards = "\n".join(
    LINK_CARD.format(
      href=f"/red-rocks/transportation/{leaf['slug']}",
      h=leaf["title"].split(" at ")[0].split(" (")[0],
      p=leaf["description"],
    )
    for leaf in leaves
  )

  hub_page = HUB_TEMPLATE.format(
    title=hub["title"],
    description=hub["description"],
    ctaHref=hub["ctaHref"],
    ctaText=hub["ctaText"],
    link_cards=link_cards,
  )
  (base / "page.tsx").write_text(hub_page)

  # Leaves
  for leaf in leaves:
    leaf_dir = base / leaf["slug"]
    leaf_dir.mkdir(parents=True, exist_ok=True)
    cards = "\n".join(CARD_BLOCK.format(h=c["h"], p=c["p"]) for c in leaf.get("cards", []))
    leaf_page = LEAF_TEMPLATE.format(
      title=leaf["title"],
      description=leaf["description"],
      hubHref="/red-rocks/transportation",
      crumb=leaf["title"].split(" at ")[0],
      cards=cards,
    )
    (leaf_dir / "page.tsx").write_text(leaf_page)

  print(f"Generated hub: {base}/page.tsx")
  for leaf in leaves:
    print(f"Generated leaf: {base}/{leaf['slug']}/page.tsx")

if __name__ == "__main__":
  main()
