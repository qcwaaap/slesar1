#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

TARGET="${1:-server}"

case "$TARGET" in
  server)
    bash ./scripts/deploy-rsync.sh
    ;;
  netlify)
    echo "Deploying to Netlify (production)..."
    npx netlify deploy --build --prod
    ;;
  vercel)
    echo "Deploying to Vercel (production)..."
    npx vercel --prod
    ;;
  *)
    echo "Unknown deploy target: $TARGET"
    echo "Usage: ./scripts/deploy.sh [server|netlify|vercel]"
    exit 1
    ;;
esac
