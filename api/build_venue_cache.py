import json
from fetch_events import fetch_events
from fetch_images import extract_image

def build_cache(slug, venue_id):
    events = fetch_events(venue_id)

    output = []
    for e in events:
        output.append({
            "id": e["id"],
            "title": e["title"],
            "date": e["datetime_local"],
            "url": e["url"],
            "image": extract_image(e)
        })

    with open(f"data/cache/{slug}.json", "w") as f:
        json.dump(output, f, indent=2)
