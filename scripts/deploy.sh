#!/bin/bash

set -e

echo "Deploying application..."

# Ensure correct permissions
sudo chown -R ec2-user:ec2-user /home/ec2-user/PigeonPulse/
sudo chmod -R 755 /home/ec2-user/PigeonPulse/

# Run Flyway migration
echo "Running DB migration..."
/home/ec2-user/PigeonPulse/scripts/migrate.sh

# Restart services
echo "Restarting PigeonPulse API and Nginx..."
sudo systemctl restart pigeonpulse
sudo systemctl restart nginx

echo "Deployment successful."
