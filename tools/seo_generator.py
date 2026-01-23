import json
import os

# Create data directory if it doesn't exist
if not os.path.exists('data'):
    os.makedirs('data')

# THE MASTER 2026 INTELLIGENCE MAPPING
shows = {
    "crankdat": {
        "title": "CRANKDAT",
        "guests": "with Dr. Fresch, Smoakland, Capochino, and HerShe",
        "canonical": "https://partyatredrocks.com/shows/crankdat",
        "image": "https://seatgeek.com/images/performers-landscape/crankdat-1f2e3d/654321/huge.jpg"
    },
    "inzo": {
        "title": "INZO",
        "guests": "with What So Not, Lumasi, Daggz, Common Creation, and Spenny",
        "canonical": "https://partyatredrocks.com/shows/inzo",
        "image": "https://seatgeek.com/images/performers-landscape/inzo-2a3b4c/123456/huge.jpg"
    }
    # Future 90+ shows will be added here
}

def generate_dcc_master_json():
    with open('data/seo_master.json', 'w') as f:
        json.dump(shows, f, indent=2)
    print("DCC Status: Intelligence file generated successfully.")

if __name__ == "__main__":
    generate_dcc_master_json()
