#!/bin/bash
set -e

echo "Checking if curl-minimal is installed..." >> /home/ec2-user/before_install.log
if rpm -q curl-minimal; then
  echo "Replacing curl-minimal with curl..." >> /home/ec2-user/before_install.log
  sudo dnf swap -y curl-minimal curl
fi

echo "Ensuring curl is installed..." >> /home/ec2-user/before_install.log
sudo yum install -y curl || { echo "Failed to install curl" >> /home/ec2-user/before_install.log; exit 1; }

echo "Stopping existing application (if running)..." >> /home/ec2-user/before_install.log
sudo pkill -f "dotnet" || true
sudo pkill -f "node" || true

echo "Cleaning up previous deployment..." >> /home/ec2-user/before_install.log
DEPLOY_DIR="/home/ec2-user/PigeonPulse"
if [ -d "$DEPLOY_DIR" ]; then
  echo "Removing old deployment files..." >> /home/ec2-user/before_install.log
  sudo rm -rf "$DEPLOY_DIR"/*
fi

echo "Creating fresh deployment directory..." >> /home/ec2-user/before_install.log
sudo mkdir -p "$DEPLOY_DIR"
sudo chown ec2-user:ec2-user "$DEPLOY_DIR"

# Ensure /home/ec2-user has proper permissions for Nginx to traverse
echo "Fixing permissions on /home/ec2-user..." >> /home/ec2-user/before_install.log
sudo chmod 755 /home/ec2-user

echo "Before install steps completed successfully." >> /home/ec2-user/before_install.log