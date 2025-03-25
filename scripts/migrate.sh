#!/bin/bash

set -e

echo "Starting Flyway migration..."

# Example: these should be passed in securely via env vars in CodeBuild or SSM
FLYWAY_URL="jdbc:postgresql://pigeonpulse-dev.cbiqqummoi67.eu-north-1.rds.amazonaws.com:5432/pigeonpulse-dev"
FLYWAY_USER="pigeonpulse"
FLYWAY_PASSWORD="pigeonpulse96"

docker run --rm \
  -v /home/ec2-user/PigeonPulse/database/application/migrations:/flyway/sql \
  flyway/flyway \
  -url="$FLYWAY_URL" \
  -user="$FLYWAY_USER" \
  -password="$FLYWAY_PASSWORD" \
  -schemas=public \
  -outOfOrder=true \
  -connectRetries=5 \
  migrate


echo "Flyway migration complete."

