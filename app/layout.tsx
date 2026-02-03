// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Party at Red Rocks',
  description: 'Colorado\'s Premier Concert Transportation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Party at Red Rocks",
    "url": "https://partyatredrocks.com",
    "telephone": "+17203696292",
    "priceRange": "$55-$499",
    "image": "https://partyatredrocks.com/hero/hero-home.jpg",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Denver",
      "addressRegion": "CO",
      "postalCode": "80202",
      "addressCountry": "US"
    },
    "areaServed": [
      { "@type": "AdministrativeArea", "name": "Denver Metro Area" },
      { "@type": "AdministrativeArea", "name": "Boulder" },
      { "@type": "AdministrativeArea", "name": "Morrison" }
    ],
    "description": "Premium concert shuttle service for Red Rocks and all Denver/Boulder venues. Featuring Top Circle access and guaranteed post-show return."
  };

  return (
    <html lang="en">
      <head>
        <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }} 
        />
      </head>
      <body className="bg-black text-white antialiased">
        {children}
        {/* Footers are now handled by individual hub pages or the shared component */}
      </body>
    </html>
  )
}
