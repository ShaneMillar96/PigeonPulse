#!/bin/bash
set -e  # Stop script on first error

# Remove curl-minimal if it exists to prevent conflicts
sudo yum remove -y curl-minimal || true
sudo yum install -y curl || true

echo "Curl installed successfully."

echo "Stopping existing application (if running)..."
sudo pkill -f "dotnet"
sudo pkill -f "node"

echo "Updating system packages..."
sudo yum update -y

echo "Installing dependencies..."
sudo yum install -y git unzip curl
