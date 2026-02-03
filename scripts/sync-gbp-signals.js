const fs = require('fs');

const localAuthorityMap = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "LocalBusiness",
        "name": "Denver Pickup - Sheraton Downtown",
        "url": "https://partyatredrocks.com/guide/local/denver-pickups"
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "LocalBusiness",
        "name": "Golden Pickup - Trailhead Taphouse",
        "url": "https://partyatredrocks.com/guide/local/trailhead-taphouse"
      }
    }
  ]
};

fs.writeFileSync('./public/local-authority.json', JSON.stringify(localAuthorityMap, null, 2));
console.log('✅ Local Authority Map Generated for Search Engine Crawlers');
