import os, re, json, sys, urllib.request, urllib.parse

# ----- read client id from .env.local (quote-safe) -----
env = open(".env.local","r",encoding="utf-8").read()
m = re.search(r'^SEATGEEK_CLIENT_ID\s*=\s*"?([^"\n]+)"?\s*$', env, re.M)
cid = m.group(1).strip() if m else ""
if not cid:
  print("ERROR: SEATGEEK_CLIENT_ID not found in .env.local", file=sys.stderr)
  sys.exit(1)

BASE = "https://api.seatgeek.com/2"

def get_json(url):
  req = urllib.request.Request(url, headers={
    "accept":"application/json",
    "user-agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36"
  })
  with urllib.request.urlopen(req, timeout=20) as r:
    return json.loads(r.read().decode("utf-8","replace"))

def normalize(s): return (s or "").strip().lower()

def venues_search(q):
  url = f"{BASE}/venues?q={urllib.parse.quote(q)}&per_page=50&client_id={urllib.parse.quote(cid)}"
  return get_json(url).get("venues", [])

def pick_best(venues, want_city, want_state, want_slug=None, want_name=None):
  want_city = normalize(want_city)
  want_state = normalize(want_state)
  want_slug = normalize(want_slug)
  want_name = normalize(want_name)

  # 1) exact slug
  if want_slug:
    for v in venues:
      if normalize(v.get("slug")) == want_slug:
        return v

  # 2) exact name + state + city
  if want_name:
    exact = []
    for v in venues:
      if normalize(v.get("name")) == want_name and normalize(v.get("state")) == want_state and normalize(v.get("city")) == want_city:
        exact.append(v)
    if exact:
      return exact[0]

  # 3) state+city
  sc = [v for v in venues if normalize(v.get("state")) == want_state and normalize(v.get("city")) == want_city]
  if sc:
    return sc[0]

  # 4) state only
  s = [v for v in venues if normalize(v.get("state")) == want_state]
  if s:
    return s[0]

  # 5) give up
  return venues[0] if venues else None


# ---- YOUR CANONICAL VENUE LIST (edit/add anytime) ----
# slug_key = YOUR SITE SLUG
# seatgeek_slug = the slug you *think* SeatGeek uses (optional; if blank we won't rely on it)
VENUES = [
  dict(slug_key="mission-ballroom", name="Mission Ballroom", city="Denver", state="CO", seatgeek_slug="mission-ballroom"),
  dict(slug_key="red-rocks-amphitheatre", name="Red Rocks Amphitheatre", city="Morrison", state="CO", seatgeek_slug="red-rocks-amphitheatre"),
  dict(slug_key="ball-arena", name="Ball Arena", city="Denver", state="CO", seatgeek_slug="ball-arena"),
  dict(slug_key="empower-field-at-mile-high", name="Empower Field at Mile High", city="Denver", state="CO", seatgeek_slug="empower-field-at-mile-high"),
  dict(slug_key="coors-field", name="Coors Field", city="Denver", state="CO", seatgeek_slug="coors-field"),
  dict(slug_key="fiddlers-green-amphitheatre", name="Fiddler's Green Amphitheatre", city="Englewood", state="CO", seatgeek_slug="fiddlers-green-amphitheatre"),
  dict(slug_key="fillmore-auditorium-denver", name="Fillmore Auditorium - Denver", city="Denver", state="CO", seatgeek_slug="fillmore-auditorium-denver"),
  dict(slug_key="paramount-theatre-co", name="Paramount Theatre", city="Denver", state="CO", seatgeek_slug="paramount-theatre-co"),
  dict(slug_key="summit-music-hall-denver", name="Summit Music Hall", city="Denver", state="CO", seatgeek_slug="summit-music-hall-denver"),
  dict(slug_key="ogden-theatre", name="Ogden Theatre", city="Denver", state="CO", seatgeek_slug="ogden-theatre"),
  dict(slug_key="gothic-theatre", name="Gothic Theatre", city="Englewood", state="CO", seatgeek_slug="gothic-theatre"),
  dict(slug_key="bluebird-theater", name="Bluebird Theater", city="Denver", state="CO", seatgeek_slug="bluebird-theater"),
  dict(slug_key="marquis-theater", name="Marquis Theater", city="Denver", state="CO", seatgeek_slug="marquis-theater"),
  dict(slug_key="dick-s-sporting-goods-park", name="Dick's Sporting Goods Park", city="Commerce City", state="CO", seatgeek_slug="dick-s-sporting-goods-park"),
]

out = []
for v in VENUES:
  # Try slug-based search first (but don’t trust it unless exact slug hits)
  venues = []
  if v.get("seatgeek_slug"):
    venues = venues_search(v["seatgeek_slug"])
  best = pick_best(venues, v["city"], v["state"], want_slug=v.get("seatgeek_slug"), want_name=v["name"])

  # Fallback: name search
  if not best:
    venues2 = venues_search(v["name"])
    best = pick_best(venues2, v["city"], v["state"], want_name=v["name"])

  if not best:
    out.append({**v, "seatgeek_id": None, "resolved_slug": None, "resolved_name": None, "resolved_city": None, "resolved_state": None})
    continue

  out.append({
    **v,
    "seatgeek_id": best.get("id"),
    "resolved_slug": best.get("slug"),
    "resolved_name": best.get("name"),
    "resolved_city": best.get("city"),
    "resolved_state": best.get("state"),
  })

print(json.dumps(out, indent=2))
