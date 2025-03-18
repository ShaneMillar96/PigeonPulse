#!/bin/bash
set -e

LOG_FILE="/home/ec2-user/before_install.log"
echo "BeforeInstall started at $(date)" >> "$LOG_FILE"

# Log environment variables and deployment details
echo "Environment: $DEPLOYMENT_GROUP_NAME, $LIFECYCLE_EVENT" >> "$LOG_FILE"
echo "Current directory: $(pwd)" >> "$LOG_FILE"

# Clean up any ongoing deployment state
echo "Cleaning up any ongoing deployment state..." >> "$LOG_FILE"
sudo rm -f /opt/codedeploy-agent/deployment-root/ongoing-deployment 2>> "$LOG_FILE" || true

# Stop services
echo "Stopping Nginx and pigeonpulse services..." >> "$LOG_FILE"
sudo systemctl stop nginx 2>> "$LOG_FILE" || true
sudo systemctl stop pigeonpulse.service 2>> "$LOG_FILE" || true

# Clean deployment directory without deleting it
DEPLOY_DIR="/home/ec2-user/PigeonPulse"
echo "Cleaning up contents of $DEPLOY_DIR..." >> "$LOG_FILE"
if [ -d "$DEPLOY_DIR" ]; then
  sudo find "$DEPLOY_DIR" -mindepth 1 -delete 2>> "$LOG_FILE" || { echo "Failed to clean contents of $DEPLOY_DIR" >> "$LOG_FILE"; exit 1; }
else
  echo "Creating $DEPLOY_DIR..." >> "$LOG_FILE"
  sudo mkdir -p "$DEPLOY_DIR"
  sudo chown ec2-user:ec2-user "$DEPLOY_DIR"
fi

echo "BeforeInstall completed at $(date)" >> "$LOG_FILE"
