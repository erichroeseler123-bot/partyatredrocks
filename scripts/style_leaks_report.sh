#!/usr/bin/env bash
set -euo pipefail

PATTERN='(bg-white/\[[0-9]|border-white/|text-zinc-|shadow-\[|bg-neon-|rgba\(|#00f2ff)'

# get hits (ignore backups) -> "path:line:match"
HITS="$(
  rg -n \
    --glob '!**/*.BAK_*' \
    --glob '!**/*.before_*' \
    --glob '!**/*.pre_*' \
    --glob '!**/*.ascii_fix_*' \
    --glob '!**/*.bak*' \
    --glob '!**/*.old*' \
    --glob '!**/*.tmp*' \
    "$PATTERN" \
    app components \
    || true
)"

if [[ -z "${HITS}" ]]; then
  echo "OK: no style leaks found."
  exit 0
fi

echo "Top offending files (by hit count):"
echo "${HITS}" \
  | awk -F: '{print $1}' \
  | sort \
  | uniq -c \
  | sort -nr \
  | head -n 25

echo
echo "First 120 hits (for context):"
echo "${HITS}" | head -n 120
