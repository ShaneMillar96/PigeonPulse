#!/bin/bash
set -e

LOG_FILE="/home/ec2-user/before_install.log"

# Log start time
echo "BeforeInstall started at $(date)" >> "$LOG_FILE"

# Stop all relevant services to free resources
echo "Stopping Nginx service..." >> "$LOG_FILE"
sudo systemctl stop nginx 2>> "$LOG_FILE" || true

echo "Stopping pigeonpulse service..." >> "$LOG_FILE"
sudo systemctl stop pigeonpulse.service 2>> "$LOG_FILE" || true

# Kill any lingering processes
echo "Killing existing dotnet and node processes..." >> "$LOG_FILE"
sudo pkill -9 -f "dotnet" 2>> "$LOG_FILE" || true
sudo pkill -9 -f "node" 2>> "$LOG_FILE" || true
sudo pkill -9 -f "npm" 2>> "$LOG_FILE" || true

# Wait for processes to terminate
sleep 2

# Verify no processes are running
echo "Verifying no dotnet or node processes are running..." >> "$LOG_FILE"
if pgrep -f "dotnet" || pgrep -f "node" || pgrep -f "npm"; then
  echo "Error: Some processes are still running" >> "$LOG_FILE"
  ps aux | grep -E "dotnet|node|npm" >> "$LOG_FILE"
  exit 1
fi

# Check if curl-minimal is installed
echo "Checking if curl-minimal is installed..." >> "$LOG_FILE"
if rpm -q curl-minimal; then
  echo "Replacing curl-minimal with curl..." >> "$LOG_FILE"
  sudo dnf swap -y curl-minimal curl 2>> "$LOG_FILE" || { echo "Failed to swap curl" >> "$LOG_FILE"; exit 1; }
fi

echo "Ensuring curl is installed..." >> "$LOG_FILE"
sudo yum install -y curl 2>> "$LOG_FILE" || { echo "Failed to install curl" >> "$LOG_FILE"; exit 1; }

# Clean up previous deployment
echo "Cleaning up previous deployment..." >> "$LOG_FILE"
DEPLOY_DIR="/home/ec2-user/PigeonPulse"
if [ -d "$DEPLOY_DIR" ]; then
  echo "Removing old deployment files..." >> "$LOG_FILE"
  sudo rm -rf "$DEPLOY_DIR"/* 2>> "$LOG_FILE" || { echo "Failed to remove old deployment files" >> "$LOG_FILE"; exit 1; }
fi

echo "Creating fresh deployment directory..." >> "$LOG_FILE"
sudo mkdir -p "$DEPLOY_DIR"
sudo mkdir -p "$DEPLOY_DIR/static"
sudo chown ec2-user:ec2-user "$DEPLOY_DIR"
sudo chown nginx:nginx "$DEPLOY_DIR/static"

# Ensure /home/ec2-user has proper permissions for Nginx to traverse
echo "Fixing permissions on /home/ec2-user..." >> "$LOG_FILE"
sudo chmod 755 /home/ec2-user

echo "BeforeInstall completed successfully at $(date)" >> "$LOG_FILE"