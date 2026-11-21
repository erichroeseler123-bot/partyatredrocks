# Native PARR Rezdy checkout — November 21, 2026

New 2027 reservations use the existing PARR application and RezdyPay. Historical
Square payments, booking tokens, confirmation pages, and order operations remain.

- Suburban: P94HN4 / Rezdy ID 789849, $499 + $19.96 booking fee = $518.96.
- Van: PU8R6Y / Rezdy ID 789850, $699 + $27.96 booking fee = $726.96.
- One booking buys one private vehicle, with separate guest count (6 or 10).
- 43 official-source-verified 2027 dates, 6 Suburbans / 3 vans per date.
- Products are TRANSFER, not PRIVATE_TOUR. Rezdy's PRIVATE_TOUR type forces charter
  semantics and would close a whole multi-vehicle date after its first purchase.
- Old source field names `previewProductCode` and `PARR_PREVIEW_HIDDEN_PRODUCTS`
  remain compatibility aliases for the two products now promoted to Production.
- Product internal codes are now PARR_2027_SUBURBAN_API and PARR_2027_VAN_API.
  Do not rerun the old hidden-test setup against the promoted products.
- Test-only November 30, 2027 sessions are closed, not sold as concert service.
- All-day sessions reserve a service date; they do not promise midnight pickup.

## Reservation protection

Supplier queries use documented minTourStartTime/maxTourStartTime UTC filters and
minDateCreated=1970-01-01 to include older reservations. Exact Denver service-date
filtering happens after retrieval. Availability and checkout holds refresh the
legacy and new product reservations before calculating remaining capacity.

Private encrypted inventory uses atomic conditional writes. Ambiguous supplier
or payment outcomes hold capacity for review. A CONFIRMED status without the exact
settled payment does not produce a successful paid confirmation. Production
requests customer notifications from Rezdy; Preview suppresses them.

## Activation and rollback

PARR_NATIVE_REZDY_CHECKOUT_ENABLED=true enables the Production UI and APIs. Query
parameters cannot enable Production. The existing private storage, Rezdy API key,
documented RezdyPay public key, and PARR_SECRET are required; credentials never
belong in Git. Production hides the old-widget fallback.

After native checkout is verified live, close new sales on legacy P0U1MY and
PJM9GD without deleting either product or touching their existing reservations.
The /booking page keeps reservation lookup and routes new buyers to native checkout.

Before reverting to the previous deployment, restore the legacy booking mode and
session availability from the migration snapshots held outside this repository
under portfolio-operations/rezdy. Confirm native orders made since cutover and
subtract them from legacy capacity first. Do not reopen unrestricted legacy
checkout while native sales remain enabled. Production rollback target before
cutover: 64761965bb8c2f666b77e6e9d12f0512658c614c / dpl_EhuyvwJNcHhy8JZS7p1M5srLsuas.

## Verification limits

Automated tests simulate paid/declined/timed-out supplier responses, confirmation
lookup, duplicate submissions and final-vehicle contention. Live reads verify
sessions, quotes, existing reservations, private storage, and card-field loading.
No real card is charged merely to test deployment. A completed live payment and
its delivered customer email are separately observable after a real purchase.
