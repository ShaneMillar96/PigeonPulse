#!/bin/bash
set -e

LOG_FILE="/home/ec2-user/before_install.log"
echo "Starting before_install.sh at $(date)" >> "$LOG_FILE"

# Ensure log file is writable
touch "$LOG_FILE"
chmod 644 "$LOG_FILE"

# Check if curl is already installed to avoid unnecessary swaps
echo "Checking if curl is installed..." >> "$LOG_FILE"
if ! command -v curl &> /dev/null; then
  if rpm -q curl-minimal; then
    echo "Replacing curl-minimal with curl..." >> "$LOG_FILE"
    timeout 120 sudo dnf swap -y curl-minimal curl >> "$LOG_FILE" 2>&1 || { echo "Failed to swap curl-minimal with curl" >> "$LOG_FILE"; exit 1; }
  fi
  echo "Ensuring curl is installed..." >> "$LOG_FILE"
  timeout 120 sudo yum install -y curl >> "$LOG_FILE" 2>&1 || { echo "Failed to install curl" >> "$LOG_FILE"; exit 1; }
else
  echo "curl is already installed, skipping installation..." >> "$LOG_FILE"
fi

echo "Stopping existing application (if running)..." >> "$LOG_FILE"
sudo pkill -f "dotnet" || true
sudo pkill -f "node" || true

echo "Cleaning up previous deployment..." >> "$LOG_FILE"
DEPLOY_DIR="/home/ec2-user/PigeonPulse"
if [ -d "$DEPLOY_DIR" ]; then
  echo "Removing old deployment files..." >> "$LOG_FILE"
  sudo rm -rf "$DEPLOY_DIR"/* >> "$LOG_FILE" 2>&1 || { echo "Failed to remove old deployment files" >> "$LOG_FILE"; exit 1; }
fi

echo "Creating fresh deployment directory..." >> "$LOG_FILE"
sudo mkdir -p "$DEPLOY_DIR" >> "$LOG_FILE" 2>&1 || { echo "Failed to create deployment directory" >> "$LOG_FILE"; exit 1; }
sudo chown ec2-user:ec2-user "$DEPLOY_DIR" >> "$LOG_FILE" 2>&1 || { echo "Failed to set ownership of deployment directory" >> "$LOG_FILE"; exit 1; }

# Ensure /home/ec2-user has proper permissions for Nginx to traverse
echo "Fixing permissions on /home/ec2-user..." >> "$LOG_FILE"
sudo chmod 755 /home/ec2-user >> "$LOG_FILE" 2>&1 || { echo "Failed to set permissions on /home/ec2-user" >> "$LOG_FILE"; exit 1; }

# Test connectivity to CodeDeploy endpoint
echo "Testing connectivity to CodeDeploy endpoint..." >> "$LOG_FILE"
curl -I https://codedeploy.eu-north-1.amazonaws.com >> "$LOG_FILE" 2>&1 || { echo "Failed to reach CodeDeploy endpoint" >> "$LOG_FILE"; exit 1; }

echo "Before install steps completed successfully at $(date)." >> "$LOG_FILE"
exit 0