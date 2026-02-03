const fs = require('fs');

const richData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "name": "Party at Red Rocks",
      "image": "https://partyatredrocks.com/images/logo.png",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Golden",
        "addressRegion": "CO",
        "postalCode": "80401",
        "streetAddress": "811 12th St"
      },
      "priceRange": "$55 - $499",
      "telephone": "+1-303-XXXXXXX"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How many stairs are at Red Rocks?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Lower South Lot requires a climb of nearly 380 steps to reach the venue entrance. Our Top Circle drop-off service bypasses these stairs entirely."
          }
        }
      ]
    }
  ]
};

fs.writeFileSync('./public/rich-snippets.json', JSON.stringify(richData, null, 2));
console.log('✅ Google-Friendly Rich Snippets Generated in /public');
