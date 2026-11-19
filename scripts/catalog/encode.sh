#!/usr/bin/env bash
# Re-encodes public/catalog from the captures already in scripts/catalog/raw/,
# without recording again (handy to tune start/duration in titles.json).
# The parameters live in update.mjs; see docs/catalog-media.md.
#   bash scripts/catalog/encode.sh [slug ...] [--repos <dir>]
set -euo pipefail
exec node "$(cd "$(dirname "$0")" && pwd)/update.mjs" --encode-only "$@"
