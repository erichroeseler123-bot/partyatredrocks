#!/usr/bin/env bash
set -euo pipefail

PATTERN='(bg-white/\[[0-9]|border-white/|text-zinc-|shadow-\[|bg-neon-|rgba\(|#00f2ff)'

rg -n \
  --glob '!**/*.BAK_*' \
  --glob '!**/*.before_*' \
  --glob '!**/*.pre_*' \
  --glob '!**/*.ascii_fix_*' \
  --glob '!**/*.bak*' \
  --glob '!**/*.old*' \
  --glob '!**/*.tmp*' \
  --glob '!app/globals.css' \
  "$PATTERN" \
  app components \
  || true
