# Party At Red Rocks Visual System Contract

This repo now treats the shared Red Rocks booking flow as the visual anchor for the rest of the site.

Anchor route:
- `/book/red-rocks-amphitheatre/custom/shared`

Anchor files:
- `app/book/[venue]/custom/shared/page.tsx`
- `app/book/[venue]/shared/SharedBookingPage.tsx`
- `components/booking/BookingVisualHero.tsx`
- `app/globals.css`

## Purpose

The goal is to stop redesigning page-by-page and start applying one rendering system across page families.

This contract defines the visual rules other pages should inherit before any new redesign work happens.

## Non-Negotiable Rules

### 1. Page Skeleton

Every important page should resolve to this order:

1. Hero
2. Primary action
3. Core content blocks
4. Trust / support information
5. Final CTA

No page should invent a different top-level rhythm without a strong reason.

### 2. Layout Width + Spacing

- Main content width should stay inside a centered max-width container.
- Section spacing should be generous but predictable.
- Do not mix tight stacked sections with oversized one-off gaps.
- Mobile spacing should compress before desktop spacing does.

Practical target:
- one shared outer page container
- one shared vertical section rhythm
- one shared card padding rhythm

### 3. Typography

Use one clear hierarchy:

- eyebrow / kicker
- headline
- support copy
- metadata / labels

Do not add extra headline sizes unless the page truly needs them.

The booking hero is the reference:
- uppercase heavy headline
- small uppercase eyebrow
- one support paragraph

### 4. CTA System

There are only two CTA classes of importance:

- primary booking CTA
- secondary exploration CTA

Rules:
- one primary CTA style
- one secondary CTA style
- primary CTA should appear above the fold on high-intent pages
- CTA copy should stay action-first and short

Approved primary CTA patterns:
- `Book Shared Seats`
- `Book Shuttle`
- `Book This Venue`
- `Compare Ride Options`

Approved secondary CTA patterns:
- `View Lineup`
- `Transportation Guide`
- `View Private Vehicles`

### 5. Card System

Cards should share:

- rounded corners
- dark surface treatment
- one border treatment
- one shadow language
- one hover movement language

Do not create custom card chrome for each page family.

### 6. Image System

This is mandatory.

#### Aspect Ratios

- `16:9` for heroes and standard content cards
- `1:1` for avatar/headliner/thumbnail elements

#### Rendering Rules

- always use a consistent image container
- always crop inside the container
- always provide a fallback
- do not render ad hoc raw image shapes

#### Source Rules

Use the existing media pipeline:
- `scripts/build-media.mjs`
- `scripts/build-media-blob.mjs`
- `lib/getDynamicImage.ts`
- `lib/media/resolver.ts`
- `lib/media/selectImage.ts`

If a page needs a new image source, add it to the existing media process instead of bypassing it.

### 7. Color + Surface Rules

The current site remains on the established PARR palette:

- background: deep navy
- primary accent: cyan
- warm accent: orange
- white text on dark surfaces

Source of truth:
- `app/globals.css`

Use existing brand utilities where possible:
- `brand-page`
- `brand-panel`
- `brand-card`
- `brand-kicker`
- `brand-link`
- `brand-button-primary`
- `brand-glass-bar`

No page family should reintroduce a separate palette.

## What Gets Extracted First

Do not extract everything at once.

### Phase 1

Apply the booking anchor system to:

- `/red-rocks`
- `/week/red-rocks`
- `/red-rocks/transportation`
- `/venues/red-rocks-amphitheatre`

These are the highest-value non-booking surfaces.

### Phase 2

Apply the same system to:

- show pages
- artist pages
- guide hub and top guide templates

### Phase 3

Apply it to secondary editorial and long-tail pages.

## Extraction Targets

Only extract pieces that clearly repeat.

First extraction candidates:

1. shared hero shell
2. shared section shell
3. shared CTA row
4. shared card wrapper
5. shared image frame rules

Do not build a giant design framework before these pieces are proven across multiple pages.

## Ownership Map

- visual tokens and shared utilities: `app/globals.css`
- booking anchor layout: `app/book/[venue]/shared/SharedBookingPage.tsx`
- booking hero reference: `components/booking/BookingVisualHero.tsx`
- image source logic: `lib/getDynamicImage.ts`, `lib/media/*`

## Guardrails

Do not:

- redesign page-by-page without referring back to this contract
- add new one-off CTA styles
- add new card chrome for a single route
- introduce raw image rendering outside the shared image rules
- create a repo-wide mega UI framework before the first page families are aligned

Do:

- use the booking page as the visual contract
- port proven patterns outward
- keep changes surgical
- verify mobile first
- preserve the existing clean routing/schema/booking logic while visual work expands
