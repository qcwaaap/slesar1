#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-all}" # all | backend | frontend

command -v sshpass >/dev/null 2>&1 || {
  echo "sshpass is required. Install it and retry:"
  echo "sudo apt-get update && sudo apt-get install -y sshpass"
  exit 1
}

DEPLOY_HOST="${DEPLOY_HOST:-37.140.192.36}"
DEPLOY_USER="${DEPLOY_USER:-u2908498}"
DEPLOY_PASSWORD="${DEPLOY_PASSWORD:-hITl1W0xY8o3Aj9V}"
DEPLOY_PORT="${DEPLOY_PORT:-22}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/u2908498/data/www/cardizel.com}"
LOG_FILE="${LOG_FILE:-$DEPLOY_PATH/app.log}"

[[ "$MODE" == "all" || "$MODE" == "backend" || "$MODE" == "frontend" ]] || {
  echo "Unknown mode: $MODE"
  echo "Usage: ./scripts/logs.sh [all|backend|frontend]"
  exit 1
}

echo "Streaming $MODE logs from ${DEPLOY_USER}@${DEPLOY_HOST}:${LOG_FILE}"

sshpass -p "$DEPLOY_PASSWORD" ssh -t -p "$DEPLOY_PORT" -o StrictHostKeyChecking=no \
  "${DEPLOY_USER}@${DEPLOY_HOST}" "MODE='$MODE' LOG_FILE='$LOG_FILE' bash -s" <<'EOF'
set -euo pipefail

[ -f "$LOG_FILE" ] || {
  echo "Log file not found: $LOG_FILE"
  exit 1
}

tail -n 100 -F "$LOG_FILE" | awk -v MODE="$MODE" '
function is_backend_line(line) {
  return (
    line ~ /\/api\// ||
    line ~ /send-email/ ||
    line ~ /API получил данные/ ||
    line ~ /Ошибка в API/ ||
    line ~ /SMTP/ ||
    line ~ /Письмо отправлено/ ||
    line ~ /EAUTH/ ||
    line ~ /ESOCKET/
  );
}
{
  sub(/\r$/, "", $0);
  kind = is_backend_line($0) ? "backend" : "frontend";
  if (MODE == "all" || MODE == kind) {
    if (MODE == "all") printf("[%s] %s\n", kind, $0);
    else printf("%s\n", $0);
  }
}
'
EOF
