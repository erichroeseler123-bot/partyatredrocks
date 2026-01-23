import json

# Your 90+ show list
shows = [
    {"id": "crankdat", "name": "Crankdat", "date": "2026-03-27T19:00:00"},
    {"id": "inzo", "name": "INZO", "date": "2026-04-03T19:00:00"},
    # ... python handles the rest
]

def generate_dcc_intelligence():
    master_seo = {}
    for show in shows:
        master_seo[show['id']] = {
            "canonical": f"https://partyatredrocks.com/shows/{show['id']}",
            "schema": {
                "@context": "https://schema.org",
                "@type": "Event",
                "name": show['name'],
                "startDate": show['date'],
                "location": {"@type": "Place", "name": "Red Rocks Amphitheatre"},
                "offers": {"@type": "Offer", "url": f"https://partyatredrocks.com/shows/{show['id']}", "price": "65", "priceCurrency": "USD"}
            }
        }
    
    with open('data/seo_master.json', 'w') as f:
        json.dump(master_seo, f, indent=2)

if __name__ == "__main__":
    generate_dcc_intelligence()
