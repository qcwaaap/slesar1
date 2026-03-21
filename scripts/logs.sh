#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-all}" # all | backend | frontend

if ! command -v sshpass >/dev/null 2>&1; then
  echo "sshpass is required. Install it and retry:"
  echo "sudo apt-get update && sudo apt-get install -y sshpass"
  exit 1
fi

DEPLOY_HOST="${DEPLOY_HOST:-185.96.80.253}"
DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_PASSWORD="${DEPLOY_PASSWORD:-5fvXnL3A8Lvy}"
DEPLOY_PORT="${DEPLOY_PORT:-22}"
DEPLOY_PATH="${DEPLOY_PATH:-/opt/slesar1}"
LOG_FILE="${LOG_FILE:-$DEPLOY_PATH/app.log}"

case "$MODE" in
  all|backend|frontend) ;;
  *)
    echo "Unknown mode: $MODE"
    echo "Usage: ./scripts/logs.sh [all|backend|frontend]"
    exit 1
    ;;
esac

echo "Streaming $MODE logs from ${DEPLOY_USER}@${DEPLOY_HOST}:${LOG_FILE}"

sshpass -p "$DEPLOY_PASSWORD" ssh -t -p "$DEPLOY_PORT" -o StrictHostKeyChecking=no \
  "${DEPLOY_USER}@${DEPLOY_HOST}" "MODE='$MODE' LOG_FILE='$LOG_FILE' bash -s" <<'EOF'
set -euo pipefail

if [ ! -f "$LOG_FILE" ]; then
  echo "Log file not found: $LOG_FILE"
  exit 1
fi

is_backend_line() {
  case "$1" in
    *"/api/"*|*"send-email"*|*"API получил данные"*|*"Ошибка в API"*|*"SMTP"*|*"Письмо отправлено"*|*"EAUTH"*|*"ESOCKET"*)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

tail -n 100 -F "$LOG_FILE" | while IFS= read -r line; do
  if is_backend_line "$line"; then
    kind="backend"
  else
    kind="frontend"
  fi

  case "$MODE" in
    all)
      printf '[%s] %s\n' "$kind" "$line"
      ;;
    backend)
      [ "$kind" = "backend" ] && printf '%s\n' "$line"
      ;;
    frontend)
      [ "$kind" = "frontend" ] && printf '%s\n' "$line"
      ;;
  esac
done
EOF
