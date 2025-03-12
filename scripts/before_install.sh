#!/bin/bash
echo "Stopping existing application (if running)..."
sudo pkill -f "dotnet"
sudo pkill -f "node"

echo "Updating system packages..."
sudo yum update -y

echo "Installing dependencies..."
sudo yum install -y git unzip curl
