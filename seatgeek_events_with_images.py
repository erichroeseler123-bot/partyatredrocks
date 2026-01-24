import requests
import os
from datetime import datetime, timedelta

SEATGEEK_CLIENT_ID = "NTUyMjcyMDV8MTc2NzU1MDc0Ni41MDEyNjgx"
BASE_URL = "https://api.seatgeek.com/2/events"

def fetch_events_with_images(venue_id, days=90, limit=50):
    now = datetime.utcnow()
    future = now + timedelta(days=days)

    params = {
        "venue.id": venue_id,
        "datetime_utc.gte": now.isoformat(),
        "datetime_utc.lte": future.isoformat(),
        "per_page": limit,
        "sort": "datetime_utc.asc",
        "client_id": SEATGEEK_CLIENT_ID,
    }

    r = requests.get(BASE_URL, params=params, timeout=15)
    r.raise_for_status()
    data = r.json()

    results = []

    for event in data.get("events", []):
        performers = event.get("performers", [])

        # Find first performer with an image
        image = None
        for p in performers:
            imgs = p.get("images") or {}
            image = (
                imgs.get("huge")
                or imgs.get("large")
                or imgs.get("medium")
                or p.get("image")
            )
            if image:
                break

        results.append({
            "event_id": event["id"],
            "title": event["title"],
            "datetime": event["datetime_local"],
            "url": event["url"],
            "venue": event["venue"]["name"],
            "primary_performer": performers[0]["name"] if performers else None,
            "image": image,  # None if SeatGeek has no image
        })

    return results


if __name__ == "__main__":
    # 🔁 Example: Red Rocks Amphitheatre
    RED_ROCKS_VENUE_ID = 4208

    events = fetch_events_with_images(RED_ROCKS_VENUE_ID)

    for e in events:
        print("\n---")
        print("Title:", e["title"])
        print("Date:", e["datetime"])
        print("Image:", e["image"])

