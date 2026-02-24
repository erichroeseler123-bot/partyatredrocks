#!/usr/bin/env bash
set -euo pipefail

# Contract: forbid raw "white/zinc" styling leaking into components/pages
PATTERN='(bg-white/|border-white/|text-zinc-|#00f2ff)'

rg -n \
  --glob '!app/globals.css' \
  --glob '!**/*.BAK_*' \
  --glob '!**/*.bak*' \
  --glob '!**/*.before_*' \
  --glob '!**/*.pre_*' \
  --glob '!**/*.ascii_fix_*' \
  --glob '!**/*.old*' \
  --glob '!**/*.tmp*' \
  "$PATTERN" \
  app components \
  || true
