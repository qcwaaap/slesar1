#!/usr/bin/env bash
set -euo pipefail

if ! command -v sshpass >/dev/null 2>&1; then
  echo "sshpass is required. Install it and retry:"
  echo "sudo apt-get update && sudo apt-get install -y sshpass"
  exit 1
fi

DEPLOY_HOST="${DEPLOY_HOST:-185.96.80.253}"
DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_PASSWORD="${DEPLOY_PASSWORD:-5fvXnL3A8Lvy}"
DEPLOY_PORT="${DEPLOY_PORT:-22}"

sshpass -p "$DEPLOY_PASSWORD" ssh -p "$DEPLOY_PORT" -o StrictHostKeyChecking=no "${DEPLOY_USER}@${DEPLOY_HOST}"
