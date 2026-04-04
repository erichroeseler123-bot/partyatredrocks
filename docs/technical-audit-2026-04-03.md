# Party at Red Rocks Technical Audit

Date: 2026-04-03
Site: https://www.partyatredrocks.com/
Repo: `/home/ewrewr12/partyatredrocks`

## Executive Summary

`partyatredrocks.com` is a full Next.js App Router application deployed on Vercel. It is not a lightweight static or Markdown-rendered site. The codebase combines marketing pages, booking flows, generated venue and artist content, operational APIs, and a build-time content pipeline.

The site is optimized for a small operator workflow: publish show-season content quickly, support shuttle and private transport conversions, and keep ride-day logistics visible. From a technical perspective, it is a hybrid of static generation, server-rendered routes, generated content, and external service integrations.

## Actual Stack

Primary framework and runtime:
- Next.js 15 App Router
- React 18
- Node.js build pipeline
- Vercel deployment target

Core UI and frontend dependencies:
- Tailwind CSS
- Framer Motion
- Lucide React
- Swiper
- Mapbox GL / react-map-gl

Operational and backend dependencies:
- Stripe
- Square
- Axios
- Vercel Blob
- Vercel Edge Config

Evidence:
- `package.json` uses `next`, `react`, `react-dom`, `tailwindcss`, `framer-motion`, `stripe`, `square`, `mapbox-gl`, and `react-map-gl`.
- `next.config.js` contains App Router-era Next config, redirects, image loader configuration, and `experimental.inlineCss`.

Relevant files:
- `/home/ewrewr12/partyatredrocks/package.json`
- `/home/ewrewr12/partyatredrocks/next.config.js`

## Build and Content Pipeline

This repo is not just "render some pages". Its build process generates data before Next compiles.

The `build` script runs:
1. Node version verification
2. event build script
3. quick Red Rocks event build script
4. media build script
5. blob media build script
6. `next build`

This means the app depends on precomputed content and media snapshots, not only source TSX pages.

Relevant scripts from `package.json`:
- `build-events`
- `build-quick-red-rocks-events`
- `build-media`
- `build-media-blob`
- `next build`

Implication:
- the site behaves like a generated-content publishing system layered on top of Next, not a hand-authored static brochure site

## Routing and Site Architecture

The app uses the `app/` directory with a mix of static, generated, and dynamic routes.

Top-level route categories include:
- homepage and core marketing pages
- booking and checkout flows
- venue pages
- artist pages
- scene and guide hubs
- operational APIs
- legal and support pages

Examples:
- homepage: `/home/ewrewr12/partyatredrocks/app/page.tsx`
- booking hub: `/home/ewrewr12/partyatredrocks/app/book`
- contact page: `/home/ewrewr12/partyatredrocks/app/contact/page.tsx`
- privacy page: `/home/ewrewr12/partyatredrocks/app/privacy/page.tsx`
- terms page: `/home/ewrewr12/partyatredrocks/app/terms/page.tsx`
- Red Rocks content hub: `/home/ewrewr12/partyatredrocks/app/red-rocks`
- guide hub: `/home/ewrewr12/partyatredrocks/app/guide`
- venues hub: `/home/ewrewr12/partyatredrocks/app/venues`
- search: `/home/ewrewr12/partyatredrocks/app/search/page.tsx`
- APIs: `/home/ewrewr12/partyatredrocks/app/api`

This is a hub-and-spoke route system with strong programmatic expansion across artists, venues, months, and logistics pages.

## Rendering Model

The site is a hybrid rendering app.

Observed behavior and build output indicate:
- many pages are statically prerendered
- some routes use SSG with generated params
- some routes are dynamic and server-rendered on demand
- metadata and Open Graph output are generated through Next route/page conventions

This makes the app operationally closer to a content platform than to a simple marketing site.

## Media and Image Strategy

The site currently mixes:
- local optimized media in `public/`
- build-generated media data
- a custom Next image loader for Unsplash-hosted remote assets
- direct local `<img>` usage for some performance-sensitive homepage media

Relevant config:
- `images.loader = "custom"`
- `loaderFile = "./unsplash-loader.js"`

Recent production work also moved several homepage assets to local WebP files for tighter control of LCP and card media behavior.

Important note:
- this is not a pure `next/image` everywhere setup; the site has custom image delivery decisions in different parts of the UI

## Booking and Commerce Layer

The site is not just informational. It includes real booking-oriented application logic.

Signals in the repo:
- booking pages under `app/book/...`
- booking state pages under `app/booking/...`
- payment-related APIs
- Square and Stripe dependencies
- private booking form components
- support/booking share components

That makes the site part content site, part operational booking app.

## Social Proof and External Integrations

The site uses external sources and social proof rather than being entirely self-contained.

Observed or configured integrations include:
- Instagram / Facebook style social proof surfaces
- Google Maps / venue and pickup mapping support
- Spotify and artist/media enrichment APIs
- Vercel Blob media caching
- payment platform integration

This is one reason the site feels lean at the UI layer while still being technically richer underneath.

## SEO and Content Expansion Strategy

The codebase is built to scale long-tail landing pages rather than just a handful of marketing screens.

The structure supports:
- venue-specific transportation pages
- artist-specific pages
- month-specific concert pages
- guide and comparison pages
- logistics and FAQ content

This is a deliberate SEO/content architecture, not incidental page sprawl.

## Current Operational Observations

As of this audit:
- `/contact` now exists as a real route and no longer falls through to the not-found page
- legal pages exist as real routes
- homepage media has been optimized heavily for production performance
- the app is presently in a production-good performance state, though not stripped to the bone

## What This Site Is

Most accurate technical description:
- a Vercel-hosted Next.js App Router application
- with build-time event/media generation
- with programmatic SEO landing pages
- with booking and payment flows
- with a custom image/media strategy
- designed for a small operator to ship seasonal content and convert bookings quickly

## What It Is Not

It is not:
- a simple static HTML site
- a Markdown-only site
- a no-code builder site
- a WordPress, Squarespace, Wix, or Shopify implementation
- a minimal brochure site with a few hand-authored pages

## Recommended Short Description

If you need a concise, accurate technical summary for future use:

> Party at Red Rocks is a Next.js 15 App Router site on Vercel that combines generated concert-content pages, SEO landing pages, and real booking flows for shuttle and private transport to Red Rocks and other Colorado venues.

