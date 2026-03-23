#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

[[ -d "node_modules" ]] || {
  echo "Installing dependencies..."
  npm install
}

echo "Building production bundle..."
npm run build

echo "Starting production server..."
npm run start
