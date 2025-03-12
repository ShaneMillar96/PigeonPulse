#!/bin/bash
set -e  # Stop script on first error

echo "Checking if curl-minimal is installed..."
if rpm -q curl-minimal; then
  echo "Replacing curl-minimal with curl..."
  sudo dnf swap -y curl-minimal curl
fi

echo "Ensuring curl is installed..."
sudo yum install -y curl

echo "Curl installation complete."

echo "Stopping existing application (if running)..."
sudo pkill -f "dotnet" || true
sudo pkill -f "node" || true

echo "Updating system packages..."
sudo yum update -y

echo "Installing dependencies..."
sudo yum install -y git unzip curl
