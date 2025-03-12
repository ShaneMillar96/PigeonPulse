#!/bin/bash
set -e  # Stop script on first error

# Check if curl-minimal is installed and remove it
if rpm -q curl-minimal; then
  echo "Removing curl-minimal to prevent conflicts..."
  sudo yum remove -y curl-minimal
fi

# Ensure curl is installed
echo "Installing curl..."
sudo yum install -y curl

echo "Curl installed successfully."

echo "Stopping existing application (if running)..."
sudo pkill -f "dotnet" || true
sudo pkill -f "node" || true

echo "Updating system packages..."
sudo yum update -y

echo "Installing dependencies..."
sudo yum install -y git unzip curl
