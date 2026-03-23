#!/usr/bin/env bash
set -euo pipefail

command -v sshpass >/dev/null 2>&1 || {
  echo "sshpass is required. Install it and retry:"
  echo "sudo apt-get update && sudo apt-get install -y sshpass"
  exit 1
}

DEPLOY_HOST="${DEPLOY_HOST:-37.140.192.36}"
DEPLOY_USER="${DEPLOY_USER:-u2908498}"
DEPLOY_PASSWORD="${DEPLOY_PASSWORD:-hITl1W0xY8o3Aj9V}"
DEPLOY_PORT="${DEPLOY_PORT:-22}"

sshpass -p "$DEPLOY_PASSWORD" ssh -p "$DEPLOY_PORT" -o StrictHostKeyChecking=no "${DEPLOY_USER}@${DEPLOY_HOST}"

