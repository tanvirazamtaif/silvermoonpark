#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --no-input

# Run migrations
python manage.py migrate

# Seed production database with initial data (optional, don't fail build)
python manage.py seed_production || echo "Seeding skipped or already done"
