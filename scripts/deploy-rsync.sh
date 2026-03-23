#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

command -v sshpass >/dev/null 2>&1 || {
  echo "sshpass is required. Install it and retry:"
  echo "sudo apt-get update && sudo apt-get install -y sshpass"
  exit 1
}
command -v rsync >/dev/null 2>&1 || {
  echo "rsync is required. Install it and retry:"
  echo "sudo apt-get update && sudo apt-get install -y rsync"
  exit 1
}

DEPLOY_HOST="${DEPLOY_HOST:-37.140.192.36}"
DEPLOY_USER="${DEPLOY_USER:-u2908498}"
DEPLOY_PASSWORD="${DEPLOY_PASSWORD:-hITl1W0xY8o3Aj9V}"
DEPLOY_PORT="${DEPLOY_PORT:-22}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/u2908498/data/www/cardizel.com}"
APP_PORT="${APP_PORT:-3000}"

[[ -d "node_modules" ]] || {
  echo "Installing local dependencies..."
  npm install
}

echo "Building project locally..."
npm run build

echo "Ensuring remote directory exists..."
sshpass -p "$DEPLOY_PASSWORD" ssh -p "$DEPLOY_PORT" -o StrictHostKeyChecking=no \
  "${DEPLOY_USER}@${DEPLOY_HOST}" "mkdir -p '$DEPLOY_PATH'"

echo "Syncing files with rsync..."
sshpass -p "$DEPLOY_PASSWORD" rsync -az --delete --info=progress2 \
  -e "ssh -p $DEPLOY_PORT -o StrictHostKeyChecking=no" \
  --exclude ".git" \
  --exclude "node_modules" \
  --exclude ".next/cache" \
  ./ "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"

echo "Copying static export (out/) into domain root..."
sshpass -p "$DEPLOY_PASSWORD" ssh -p "$DEPLOY_PORT" -o StrictHostKeyChecking=no \
  "${DEPLOY_USER}@${DEPLOY_HOST}" "DEPLOY_PATH='$DEPLOY_PATH' bash -s" <<'EOF'
  set -euo pipefail
  cd "$DEPLOY_PATH"

  if [ -d "out" ]; then
    # Hosting provider expects index.html + _next/ directly in the domain root.
    rm -rf ./index.html ./404.html ./_next
    cp -R ./out/. ./
  else
    echo "WARN: out/ directory not found. Did build generate static export?"
  fi

  echo "Deploy complete. Static site should be served from domain root."
EOF
