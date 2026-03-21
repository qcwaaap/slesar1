#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v sshpass >/dev/null 2>&1; then
  echo "sshpass is required. Install it and retry:"
  echo "sudo apt-get update && sudo apt-get install -y sshpass"
  exit 1
fi

if ! command -v rsync >/dev/null 2>&1; then
  echo "rsync is required. Install it and retry:"
  echo "sudo apt-get update && sudo apt-get install -y rsync"
  exit 1
fi

DEPLOY_HOST="${DEPLOY_HOST:-185.96.80.253}"
DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_PASSWORD="${DEPLOY_PASSWORD:-5fvXnL3A8Lvy}"
DEPLOY_PORT="${DEPLOY_PORT:-22}"
DEPLOY_PATH="${DEPLOY_PATH:-/opt/slesar1}"
APP_PORT="${APP_PORT:-3000}"

if [ ! -d "node_modules" ]; then
  echo "Installing local dependencies..."
  npm install
fi

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
  --exclude "out" \
  ./ "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"

echo "Installing dependencies and restarting app on server..."
sshpass -p "$DEPLOY_PASSWORD" ssh -p "$DEPLOY_PORT" -o StrictHostKeyChecking=no \
  "${DEPLOY_USER}@${DEPLOY_HOST}" "DEPLOY_PATH='$DEPLOY_PATH' APP_PORT='$APP_PORT' bash -s" <<'EOF'
  set -euo pipefail
  export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"

  if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
    echo "Node.js/npm not found. Installing Node.js 20..."
    apt-get update
    apt-get install -y curl ca-certificates gnupg
    install -m 0755 -d /etc/apt/keyrings
    if [ ! -f /etc/apt/keyrings/nodesource.gpg ]; then
      curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
    fi
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" > /etc/apt/sources.list.d/nodesource.list
    apt-get update
    apt-get install -y nodejs
  fi

  cd "$DEPLOY_PATH"
  npm install --omit=dev
  pkill -f "next start -p $APP_PORT" || true
  nohup npm run start -- -p "$APP_PORT" > app.log 2>&1 &
  sleep 2
  echo "Deploy complete. App running on port $APP_PORT"
EOF
