#!/bin/sh
# Start as root (lets Unraid's Tailscale hook set up networking), then run the app as PUID:PGID.
set -e
PUID="${PUID:-99}"; PGID="${PGID:-100}"
if [ "$(id -u)" = "0" ]; then
  mkdir -p "$DATA_DIR"
  chown -R "$PUID:$PGID" "$DATA_DIR"
  exec su-exec "$PUID:$PGID" "$@"
fi
exec "$@"
