#!/usr/bin/env bash
set -euo pipefail

# Load NVM explicitly (redundant but safe for subshells)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 24 >/dev/null 2>&1 || true

# Call the real codex binary
exec /home/ewrewr12/.config/nvm/versions/node/v20.20.0/bin/codex "$@"
