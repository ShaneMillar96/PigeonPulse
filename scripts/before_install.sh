#!/bin/bash
set -e

LOG_FILE="/home/ec2-user/before_install.log"
echo "BeforeInstall started at $(date)" >> "$LOG_FILE"

# Stop services
echo "Stopping Nginx and pigeonpulse services..." >> "$LOG_FILE"
sudo systemctl stop nginx 2>> "$LOG_FILE" || true
sudo systemctl stop pigeonpulse.service 2>> "$LOG_FILE" || true

# Kill lingering processes
echo "Killing dotnet, node, and npm processes..." >> "$LOG_FILE"
sudo pkill -9 -f "dotnet" 2>> "$LOG_FILE" || true
sudo pkill -9 -f "node" 2>> "$LOG_FILE" || true
sudo pkill -9 -f "npm" 2>> "$LOG_FILE" || true

# Wait for processes to terminate
sleep 2

# Clean up deployment directory
DEPLOY_DIR="/home/ec2-user/PigeonPulse"
echo "Cleaning up $DEPLOY_DIR..." >> "$LOG_FILE"
if [ -d "$DEPLOY_DIR" ]; then
  sudo rm -rf "$DEPLOY_DIR"/* 2>> "$LOG_FILE" || { echo "Failed to clean $DEPLOY_DIR" >> "$LOG_FILE"; exit 1; }
fi

# Create fresh directories
echo "Creating fresh directories..." >> "$LOG_FILE"
sudo mkdir -p "$DEPLOY_DIR"
sudo mkdir -p "$DEPLOY_DIR/static"
sudo mkdir -p "$DEPLOY_DIR/server-publish"
sudo chown ec2-user:ec2-user "$DEPLOY_DIR"
sudo chown nginx:nginx "$DEPLOY_DIR/static"
sudo chmod 755 "$DEPLOY_DIR"
sudo chmod 755 "$DEPLOY_DIR/static"

echo "BeforeInstall completed at $(date)" >> "$LOG_FILE"