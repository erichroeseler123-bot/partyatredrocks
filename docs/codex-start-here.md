# Codex Start Here

This is the fastest safe entry point for a fresh session in `partyatredrocks`.

## What This Repo Is

`partyatredrocks.com` is a booking-critical operator application.

It is not just a content site.
It contains:

- booking and payment flows
- internal order operations
- booking-token pages
- Square payment and webhook handling
- confirmation and ledger logic

That means this repo has protected booking-vault files.

## Read These First

Start with:

- `README.md`
- `docs/stakeholder-architecture.md`
- `docs/booking-vault-boundary.md`

Those three files should tell you:

- what the repo does
- which files are protected
- what can be cleaned safely
- what would count as booking-system change instead of cleanup

## Core Role

`partyatredrocks` is still the canonical booking truth for Party at Red Rocks orders that already exist here.

That means:

- existing booking tokens remain valid here
- existing confirmation pages remain here
- existing Square payment and webhook reconciliation remain here
- internal operator order management remains here

Do not treat cleanup work as permission to move or replace historical booking truth.

## Protected Booking-Vault Surfaces

Read `docs/booking-vault-boundary.md` before editing anything related to:

- payment routes
- Square webhook routes
- booking ledgers
- booking token pages
- internal order operations
- confirmation email logic

## Safe Default Session Pattern

Use this order:

1. Read the startup docs
2. Determine whether the task is cleanup or booking-system work
3. If it touches protected booking-vault files, stop and define a migration-safe plan first
4. If it does not, proceed with docs, routing clarity, or content cleanup

## Practical Rule

If a change can affect:

- money
- order status
- confirmation delivery
- booking retrieval
- webhook reconciliation

it is not simple cleanup.

It is booking-system work and needs a rollback path.
