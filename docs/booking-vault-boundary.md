# Booking Vault Boundary

Purpose: mark the files and paths in `partyatredrocks` that should be treated as protected booking-vault surfaces.

This document exists so cleanup work does not accidentally mutate payment, order, or confirmation behavior.

## Non-Negotiable Rule

Do not break existing Party at Red Rocks bookings.

That means:

- existing booking tokens must keep resolving
- existing confirmation pages must keep working
- existing Square payment paths must keep working
- existing webhook reconciliation must keep working
- existing operator order-follow-up must keep working

## Protected Files

These files should be treated as booking-vault surfaces.

- `app/api/private/pay/route.ts`
- `app/api/shared/pay/route.ts`
- `app/api/webhooks/square/route.ts`
- `lib/bookingLedger.ts`
- `lib/sharedConfirmation.ts`
- `app/booking/[token]/page.tsx`
- `app/internal/orders/page.tsx`
- `middleware.ts`

## Why These Files Are Protected

They directly affect one or more of:

- payment processing
- Square webhook verification and reconciliation
- booking confirmation state
- booking retrieval by token
- internal order operations
- durable booking ledger writes
- internal ops access control

## Cleanup-Safe Areas

These are usually safe to clean without changing booking truth.

- startup docs
- architecture docs
- content guides
- venue and artist content
- non-payment marketing pages
- repo organization and documentation clarity

## Unsafe Areas

Do not treat these as ordinary cleanup:

- payment APIs
- Square webhook handling
- booking-token pages
- internal order queue logic
- order ledger logic
- confirmation-email logic
- auth around internal ops pages

## Required Questions Before Editing A Protected File

1. Does this change affect money movement?
2. Does this change affect order status or booking confirmation?
3. Does this change affect how a paid customer retrieves their booking?
4. Does this change affect Square webhook reconciliation?
5. Is there a tested rollback path?

If any answer is yes, this is booking-system work, not simple cleanup.

## Operating Rule For Network Cleanup

As the wider system gets cleaned up:

- historical PARR bookings remain canonical here
- this repo continues to own existing PARR booking truth
- external routing or doctrine cleanup must not silently replace that truth

Any migration away from this repo for new execution must be explicit, staged, and reversible.
