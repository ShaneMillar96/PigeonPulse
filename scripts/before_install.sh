#!/bin/bash
set -e

LOG_FILE="/home/ec2-user/before_install.log"
echo "BeforeInstall started at $(date)" >> "$LOG_FILE"

# Stop services
echo "Stopping Nginx and pigeonpulse services..." >> "$LOG_FILE"
sudo systemctl stop nginx 2>> "$LOG_FILE" || true
sudo systemctl stop pigeonpulse.service 2>> "$LOG_FILE" || true

# Clean deployment directory
DEPLOY_DIR="/home/ec2-user/PigeonPulse"
echo "Cleaning up $DEPLOY_DIR..." >> "$LOG_FILE"
if [ -d "$DEPLOY_DIR" ]; then
  sudo rm -rf "$DEPLOY_DIR"/* 2>> "$LOG_FILE" || { echo "Failed to clean $DEPLOY_DIR" >> "$LOG_FILE"; exit 1; }
fi

echo "BeforeInstall completed at $(date)" >> "$LOG_FILE"