#!/bin/sh
# 如果.env存在，将VITE_API_BASE_URL注入到window.ENV
if [ -f /app/.env ]; then
  VITE_API_BASE_URL=$(grep '^VITE_API_BASE_URL=' /app/.env | cut -d '=' -f2-)
  if [ -n "$VITE_API_BASE_URL" ]; then
    echo "window.ENV={VITE_API_BASE_URL:'$VITE_API_BASE_URL'};" > /usr/share/nginx/html/env.js
  fi
fi
exec "$@"
