# Party at Red Rocks - Architecture Summary

**partyatredrocks.com** is a Vercel-hosted Next.js 15 App Router application that combines build-time generated concert content, programmatic SEO landing pages, and booking/payment flows for Red Rocks Amphitheatre and other Denver-area venues.

## Core Technical Profile

- **Framework & Rendering**: Next.js 15 (App Router) with React 18 using a hybrid rendering model. Most pages are statically generated at build time for speed and SEO, with dynamic server rendering applied only where needed.
- **Styling & Interactions**: Tailwind CSS for clean, responsive design, paired with Framer Motion for animations and Swiper for carousels.
- **Content Generation**: Custom pre-build scripts process event data and media, enabling automatic creation of venue, artist, and month-specific pages.
- **Media & Visuals**: Locally optimized WebP assets combined with a custom image loader, plus Mapbox GL integration for venue and pickup mapping.
- **Booking & Payments**: Dedicated booking routes and components for shared shuttles and private rides (Suburban/Sprinter), with integrations to Stripe and Square for payment processing.
- **Infrastructure**: Deployed on Vercel with Blob storage for media and Edge Config support.

## What the Architecture Enables

- **Fast seasonal updates**: New concert data can be processed, pages generated, and deployed quickly.
- **Strong SEO performance**: Programmatic long-tail landing pages for artists, venues, guides, and specific shows.
- **Efficient operator workflow**: Designed for a small team to manage content, media, and ride conversions with minimal overhead.
- **Good user experience**: Responsive marketing pages that highlight practical logistics like door-to-door service, guaranteed returns, and group coordination while guiding visitors smoothly toward booking.

## What It Is Not

- A lightweight static HTML or Markdown-only site.
- A no-code platform such as WordPress, Squarespace, or Wix.
- A heavy client-side single-page application.

## Recommended One-Liner

Party at Red Rocks is a Vercel-hosted Next.js 15 App Router application that combines build-time generated concert content, programmatic SEO landing pages, and booking/payment flows for Red Rocks and Denver-area transportation.
