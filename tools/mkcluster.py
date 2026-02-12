import json
from pathlib import Path

SPEC_PATH = Path("_authority_spec.json")

# ---------- Templates ----------

HUB_TMPL = """import Link from "next/link";

export const metadata = {{
  title: {title_json},
  description: {description_json},
}};

export default function Page() {{
  return (
    <main className="min-h-screen bg-surface text-white px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight">{title}</h1>
        <p className="mt-4 text-lg text-zinc-300 max-w-3xl">{description}</p>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
{cards}
        </div>

        <div className="mt-14">
          <Link href="{cta_href}" className="btn-primary">{cta_text}</Link>
          <div className="mt-3 text-sm text-zinc-300">
            Seats fill fast on sold-out shows. Lock it in now.
          </div>
        </div>
      </div>
    </main>
  );
}}
"""

LEAF_TMPL = """import Link from "next/link";

export const metadata = {{
  title: {title_json},
  description: {description_json},
}};

export default function Page() {{
  return (
    <main className="min-h-screen bg-surface text-white px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <nav className="text-sm text-zinc-400">
          <Link className="hover:text-white" href="{hub_href}">Transportation</Link>{{" "}}
          <span className="text-zinc-600">/</span> {crumb}
        </nav>

        <h1 className="mt-4 text-5xl font-black tracking-tight">{h1}</h1>
        <p className="mt-4 text-lg text-zinc-300">{lead}</p>

        <section className="mt-10 grid gap-6">
          <div className="bg-surface-strong border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold">Key takeaway</h3>
            <p className="mt-2 text-zinc-300">{takeaway}</p>
          </div>
        </section>

        <div className="mt-12">
          <Link href="/book-shuttle" className="btn-primary">Book the $59 shuttle →</Link>
        </div>
      </div>
    </main>
  );
}}
"""

# ---------- Helpers ----------

def load_spec():
  spec = json.loads(SPEC_PATH.read_text())

  # Accept either:
  #  - {baseDir, title, description, leaves...}
  #  - {base, hub:{title,description,href,ctaHref,ctaText}, leaves:[...]}
  base_dir = spec.get("baseDir") or spec.get("base") or "app/red-rocks/transportation"
  hub = spec.get("hub") or {}

  title = spec.get("title") or hub.get("title") or "Transportation"
  desc  = spec.get("description") or hub.get("description") or "Transportation intel."

  hub_href = spec.get("hubHref") or hub.get("href") or "/red-rocks/transportation"
  cta_href = spec.get("ctaHref") or hub.get("ctaHref") or "/book-shuttle"
  cta_text = spec.get("ctaText") or hub.get("ctaText") or "Book Red Rocks Shuttle — $59/pp →"

  leaves = spec.get("leaves") or []
  return base_dir, title, desc, hub_href, cta_href, cta_text, leaves

def write_file(path: Path, text: str):
  path.parent.mkdir(parents=True, exist_ok=True)
  path.write_text(text + "\n")

def card_block(href: str, card_title: str, card_desc: str):
  return (
    '          <Link href="' + href + '" className="block p-6 bg-surface-strong rounded-2xl border border-white/10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">\\n'
    '            <h3 className="text-xl font-bold mb-2">' + card_title + '</h3>\\n'
    '            <p className="text-zinc-300">' + card_desc + '</p>\\n'
    '          </Link>'
  )

def hub_page(title, desc, cta_href, cta_text, leaves, hub_href):
  cards = []
  for leaf in leaves:
    slug = leaf.get("slug") or leaf.get("path") or ""
    href = leaf.get("href") or leaf.get("url") or (hub_href.rstrip("/") + "/" + slug if slug else hub_href)
    card_title = leaf.get("cardTitle") or leaf.get("title") or leaf.get("crumb") or "Read more"
    card_desc  = leaf.get("cardDesc") or leaf.get("description") or ""
    cards.append(card_block(href, card_title, card_desc))

  return HUB_TMPL.format(
    title=title,
    description=desc,
    title_json=json.dumps(title),
    description_json=json.dumps(desc),
    cards="\\n\\n".join(cards),
    cta_href=cta_href,
    cta_text=cta_text
  )

def leaf_page(leaf, hub_href):
  slug = leaf.get("slug") or leaf.get("path") or "leaf"
  title = leaf.get("title") or leaf.get("cardTitle") or "Guide"
  desc  = leaf.get("description") or leaf.get("cardDesc") or ""
  crumb = leaf.get("crumb") or leaf.get("cardTitle") or title
  h1 = leaf.get("h1") or title
  lead = leaf.get("lead") or desc or "Quick, practical intel."
  takeaway = leaf.get("takeaway") or "Keep it predictable and avoid peak-chaos windows."

  return slug, LEAF_TMPL.format(
    title_json=json.dumps(title),
    description_json=json.dumps(desc),
    hub_href=hub_href,
    crumb=crumb,
    h1=h1,
    lead=lead,
    takeaway=takeaway
  )

def main():
  base_dir, title, desc, hub_href, cta_href, cta_text, leaves = load_spec()
  base = Path(base_dir)

  wrote = []
  write_file(base / "page.tsx", hub_page(title, desc, cta_href, cta_text, leaves, hub_href))
  wrote.append(str(base / "page.tsx"))

  for leaf in leaves:
    slug, txt = leaf_page(leaf, hub_href)
    write_file(base / slug / "page.tsx", txt)
    wrote.append(str(base / slug / "page.tsx"))

  print("Wrote:")
  for f in wrote:
    print(" -", f)

if __name__ == "__main__":
  main()
