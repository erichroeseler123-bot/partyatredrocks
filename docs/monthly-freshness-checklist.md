# Monthly Freshness Checklist

Purpose: keep high-intent SEO pages accurate, current-year specific, and operationally useful.

Cadence: run once per month (first week) and after major venue policy changes.

## 1) Red Rocks Cluster Review
- Check: `/guide/red-rocks-intelligence-hub`
- Check: `/guide/logistics/parking-lots`
- Check: `/guide/logistics/weather-prep`
- Check: `/guide/transportation/shuttle-vs-uber`
- Check: `/guide/show-night-strategy/post-show-pickup-plan`
- Verify parking guidance still matches current venue operations.
- Verify weather/altitude copy is season-appropriate.
- Verify ride/pickup recommendations still align with current flow.

## 2) Venue Reference Pages Review
- Check: `/venues/red-rocks-amphitheatre`
- Check: `/venues/mission-ballroom`
- Check: `/venues/fiddlers-green-amphitheatre`
- Check: `/venues/fillmore-auditorium`
- Check: `/venues/gothic-theatre`
- Check: `/venues/cervantes-masterpiece`
- Check: `/venues/ogden-theatre`
- Check: `/venues/ball-arena`
- Confirm each page reads venue-specific (not templated).
- Confirm FAQ answers still match real pickup/parking behavior.
- Confirm internal links to `/find` and `/week` are intact.

## 3) Weekly Discovery Surfaces
- Check: `/week`
- Check: `/week/red-rocks`
- Check: `/week/search`
- Confirm events load from snapshots and dates look current.
- Confirm intro/FAQ copy still matches booking + pickup flow.

## 4) Pickup Guidance Review
- Check: `/find`
- Confirm post-show meetup guidance is clear and accurate.
- Confirm CTA path to booking still works end-to-end.
- Confirm unpaid/partial/paid messaging remains honest.

## 5) Current-Year Reference Sweep
- Search for stale year strings (example command):

```bash
rg -n "2025|2024" app data/components docs
```

- Update copy that should reference the active season/year.
- Keep historical references only where intentionally archival.

## 6) Spot-Check Schema + Internal Linking
- Venue and guide pages: breadcrumb JSON-LD still present.
- FAQ schema appears only where real FAQ sections exist.
- Key links present among: guide pages, venue pages, `/week`, `/find`.

## 7) Snapshot/Data Health Spot Check
- Run event build:

```bash
npm run build-events
```

- Confirm expected outputs under `data/snapshots/` were refreshed.
- Spot-check one venue snapshot and `all-2026` for obvious data drift.

## 8) Ops Follow-Through
- Open `/internal/orders?view=needs-action`.
- Resolve manual handoff rows: send payment requests from Rezdy dashboard.
- Verify URL handoff rows still have valid payment links.

## Monthly Run Log (copy/paste)
- Month:
- Reviewer:
- Red Rocks pages updated:
- Venue pages updated:
- `/week` or `/find` updates:
- Year-reference fixes:
- Snapshot build run: yes/no
- Outstanding issues:
- Follow-up owner:
