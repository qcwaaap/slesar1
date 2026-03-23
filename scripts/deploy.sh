#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

TARGET="${1:-server}"

[[ "$TARGET" == "server" ]] && exec bash ./scripts/deploy-rsync.sh
[[ "$TARGET" == "netlify" ]] && exec bash -lc 'echo "Deploying to Netlify (production)..."; npx netlify deploy --build --prod'
[[ "$TARGET" == "vercel" ]] && exec bash -lc 'echo "Deploying to Vercel (production)..."; npx vercel --prod'

echo "Unknown deploy target: $TARGET"
echo "Usage: ./scripts/deploy.sh [server|netlify|vercel]"
exit 1
