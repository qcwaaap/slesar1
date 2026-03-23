#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

[[ -d "node_modules" ]] || {
  echo "Installing dependencies..."
  npm install
}

echo "Starting development server..."
npm run dev
