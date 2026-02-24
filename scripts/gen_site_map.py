from __future__ import annotations
import pathlib
import subprocess
from datetime import datetime

ROOT = pathlib.Path(".")
APP = ROOT / "app"
COMP = ROOT / "components"
LIB = ROOT / "lib"
DATA = ROOT / "data"
PUBLIC = ROOT / "public"
DOCS = ROOT / "docs"
OUT = DOCS / "site-map.md"

DOCS.mkdir(parents=True, exist_ok=True)

def rel(p: pathlib.Path) -> str:
    return str(p.relative_to(ROOT))

def is_file(p: pathlib.Path) -> bool:
    return p.exists() and p.is_file()

def size(p: pathlib.Path) -> int:
    try:
        return p.stat().st_size
    except Exception:
        return 0

def route_from_app_file(p: pathlib.Path) -> str:
    rp = rel(p)
    parts = rp.split("/")
    if not parts or parts[0] != "app":
        return "/" + "/".join(parts)

    parts = parts[1:]  # drop app
    if parts and parts[-1] in ("page.tsx", "layout.tsx", "not-found.tsx", "route.ts"):
        parts = parts[:-1]

    if parts == ["robots.txt"]:
        return "/robots.txt"
    if parts == ["sitemap.xml"]:
        return "/sitemap.xml"

    return "/" + "/".join(parts) if parts else "/"

def classify_app_file(p: pathlib.Path) -> str:
    rp = rel(p)
    if p.name == "route.ts":
        return "api" if rp.startswith("app/api/") else "handler"
    if p.name == "page.tsx":
        return "page"
    if p.name in ("layout.tsx", "not-found.tsx"):
        return "special"
    return "other"

def collect_app():
    pages, apis, handlers, specials = [], [], [], []
    for p in APP.rglob("*"):
        if not p.is_file():
            continue
        if p.name not in {"page.tsx","route.ts","layout.tsx","not-found.tsx"}:
            continue
        kind = classify_app_file(p)
        item = (route_from_app_file(p), rel(p))
        if kind == "page":
            pages.append(item)
        elif kind == "api":
            apis.append(item)
        elif kind == "handler":
            handlers.append(item)
        else:
            specials.append(item)

    pages.sort(key=lambda x: x[0])
    apis.sort(key=lambda x: x[0])
    handlers.sort(key=lambda x: x[0])
    specials.sort(key=lambda x: x[1])
    return pages, apis, handlers, specials

def scan_style_leaks():
    pattern = r'(bg-white/\[\d|border-white/|text-zinc-|shadow-\[|bg-neon-|rgba\(|#00f2ff)'
    try:
        r = subprocess.run(
            ["rg", "-n", pattern, "app", "components"],
            capture_output=True, text=True, check=False
        )
        if r.returncode not in (0, 1):
            return [f"rg failed (code {r.returncode})"]
        return r.stdout.strip().splitlines() if r.stdout.strip() else []
    except FileNotFoundError:
        return ["rg not found — skipping leak scan"]

def main():
    now = datetime.now().astimezone().strftime("%Y-%m-%d %H:%M:%S %Z")

    pages, apis, handlers, specials = collect_app()

    components = sorted((p for p in COMP.rglob("*.tsx") if p.is_file()), key=rel)
    lib_files = sorted((p for p in LIB.rglob("*") if p.is_file()), key=rel)
    data_files = sorted((p for p in DATA.rglob("*") if p.is_file()), key=rel)

    pub_subs = ["hero", "images/marketing", "images/scenes", "images/venues", "data"]
    pub_assets = []
    for sub in pub_subs:
        d = PUBLIC / sub
        if d.exists():
            files = sorted((p for p in d.rglob("*") if p.is_file()), key=rel)
            if files:
                pub_assets.append((sub, files))

    leaks = scan_style_leaks()
    preview = leaks[:120]

    lines = []
    lines += [f"# PartyAtRedRocks — Site Map (auto-generated)",
              f"_Generated: {now}_",
              "",
              "Filesystem-based inventory — no guesses.",
              ""]

    lines += ["## Routes (pages)"]
    lines += [f"- `{r}` → `{p}`" for r, p in pages] or ["- (none)"]
    lines += ["", "## API endpoints"]
    lines += [f"- `{r}` → `{p}`" for r, p in apis] or ["- (none)"]
    lines += ["", "## Route handlers"]
    lines += [f"- `{r}` → `{p}`" for r, p in handlers] or ["- (none)"]
    lines += ["", "## App-level special files"]
    lines += [f"- `{p}`" for _, p in specials] or ["- (none)"]

    lines += ["", "## Core design-control files"]
    core = [LIB / "display.ts", COMP / "DisplayTheme.tsx", APP / "globals.css"]
    for p in core:
        if is_file(p):
            lines.append(f"- `{rel(p)}` ({size(p):,} bytes)")
        else:
            lines.append(f"- `{rel(p)}` — MISSING")

    lines += ["", "## Components (*.tsx)"]
    lines += [f"- `{rel(p)}`" for p in components] or ["- (none)"]

    lines += ["", "## lib/"]
    lines += [f"- `{rel(p)}` ({size(p):,} bytes)" for p in lib_files] or ["- (empty)"]

    lines += ["", "## data/"]
    lines += [f"- `{rel(p)}` ({size(p):,} bytes)" for p in data_files] or ["- (empty)"]

    lines += ["", "## public/ — selected folders"]
    if not pub_assets:
        lines.append("- (none found)")
    else:
        for sub, files in pub_assets:
            lines += [f"### `{sub}`", ""]
            lines += [f"- `{rel(p)}`" for p in files]
            lines.append("")

    lines += ["", "## Design contract check",
              "Goal — only these should define look & feel:",
              "- `lib/display.ts`",
              "- `components/DisplayTheme.tsx`",
              "- `app/globals.css`",
              "",
              "First 120 suspicious matches:"]
    lines += ["```"] + preview + ["```"] if preview else ["_No suspicious patterns found (good!)._"]

    OUT.write_text("\n".join(lines))
    print(f"Wrote {OUT}")

if __name__ == "__main__":
    main()
