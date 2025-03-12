#!/bin/bash
set -e  # Exit immediately if any command fails

echo "Checking if curl-minimal is installed..."
if rpm -q curl-minimal; then
  echo "Replacing curl-minimal with curl..."
  sudo dnf swap -y curl-minimal curl
fi

echo "Ensuring curl is installed..."
sudo yum install -y curl

echo "Stopping existing application (if running)..."
sudo pkill -f "dotnet" || true
sudo pkill -f "node" || true

echo "Updating system packages..."
sudo yum update -y

echo "Installing dependencies..."
sudo yum install -y git unzip curl

echo "Cleaning up previous deployment..."
DEPLOY_DIR="/home/ec2-user/PigeonPulse"
if [ -d "$DEPLOY_DIR" ]; then
  echo "Removing old deployment files..."
  sudo rm -rf "$DEPLOY_DIR"
fi

echo "Creating fresh deployment directory..."
sudo mkdir -p "$DEPLOY_DIR"
sudo chown ec2-user:ec2-user "$DEPLOY_DIR"

echo "Before install steps completed successfully."
