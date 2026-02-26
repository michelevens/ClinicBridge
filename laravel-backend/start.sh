#!/bin/bash
set -e

echo "=== Starting ClinicBridge Backend ==="
echo "PORT: ${PORT:-8000}"
echo "APP_ENV: ${APP_ENV}"
echo "DB_HOST: ${DB_HOST}"

echo "=== Running migrations ==="
php artisan migrate --force 2>&1 || echo "Migration failed with exit code $?"

echo "=== Starting PHP server ==="
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}" 2>&1
