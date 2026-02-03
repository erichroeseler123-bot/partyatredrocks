import requests
import json
from datetime import datetime

SEATGEEK_CLIENT_ID = "NTUyMjcyMDV8MTc2NzU1MDc0Ni41MDEyNjgx"
BASE_URL = "https://api.seatgeek.com/2/events"
OUTPUT_PATH = "public/data/mishawaka-events.json"

all_events = []
page = 1
per_page = 100

today = datetime.utcnow().strftime("%Y-%m-%d")

while True:
    params = {
        "client_id": SEATGEEK_CLIENT_ID,
        "venue.name": "Mishawaka Amphitheatre",
        "venue.state": "CO",
        "type": "concert",
        "datetime_local.gte": today,
        "per_page": per_page,
        "page": page,
        "sort": "datetime_local.asc",
    }

    response = requests.get(BASE_URL, params=params)
    response.raise_for_status()
    data = response.json()

    events = data.get("events", [])
    if not events:
        break

    for event in events:
        performer = event["performers"][0] if event.get("performers") else None
        image = None
        if performer:
            image = performer.get("images", {}).get("huge") or performer.get("image")

        all_events.append({
            "id": event["id"],
            "title": event["title"],
            "datetime": event["datetime_local"],
            "url": event["url"],
            "image": image,
        })

    print(f"Fetched page {page} ({len(events)} events)")
    page += 1

with open(OUTPUT_PATH, "w") as f:
    json.dump(all_events, f, indent=2)

print(f"\n✅ Wrote {len(all_events)} upcoming Mishawaka concerts to {OUTPUT_PATH}")
