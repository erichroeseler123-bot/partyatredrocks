import json
from api.build_venue_cache import build_cache

with open("data/venues.json") as f:
    venues = json.load(f)

for slug, venue in venues.items():
    build_cache(slug, venue["seatgeekVenueId"])
    print(f"✔ Cached {slug}")

