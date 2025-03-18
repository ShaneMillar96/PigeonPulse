#!/bin/bash

LOG_FILE="/home/ec2-user/PigeonPulse/deploy.log"
DEPLOY_DIR="/home/ec2-user/PigeonPulse"

# Ensure scripts directory exists
if [ ! -d "$DEPLOY_DIR/scripts" ]; then
  mkdir -p "$DEPLOY_DIR/scripts"
  sudo chown ec2-user:ec2-user "$DEPLOY_DIR/scripts"
fi

# Stop services
sudo systemctl stop nginx
sudo systemctl stop pigeonpulse.service
sleep 2

if sudo systemctl is-active --quiet nginx || sudo systemctl is-active --quiet pigeonpulse.service; then
  echo "Error: Services did not stop properly." >> "$LOG_FILE"
  exit 1
fi

# Clean old deployment, but keep logs/configs
sudo find "$DEPLOY_DIR" -mindepth 1 ! -path "$DEPLOY_DIR/pigeonpulse-logs/*" -delete

# Ensure correct permissions for scripts
sudo chown -R ec2-user:ec2-user "$DEPLOY_DIR"
sudo chmod +x "$DEPLOY_DIR/scripts"/*.sh
