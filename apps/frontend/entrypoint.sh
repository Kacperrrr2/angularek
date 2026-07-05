#!/bin/sh
set -e

if [ -n "$BACKEND_URL" ]; then
  echo "window.__env = { backendUrl: '${BACKEND_URL}' };" > /workspace/apps/frontend/public/env.js
fi

exec npx nx serve frontend --host 0.0.0.0 --port 4200 --allowed-hosts .run.app
