#!/bin/bash
set -e  # Stop execution on any error

# Define log directory
LOG_DIR="/var/log/pigeonpulse"
mkdir -p $LOG_DIR

# Start Backend (.NET API)
echo "Starting Backend (.NET API)..."
cd /home/ec2-user/PigeonPulse/server-publish
export ASPNETCORE_ENVIRONMENT=Development
nohup dotnet PigeonPulse.Api.dll --urls "http://0.0.0.0:5264" > $LOG_DIR/backend.log 2>&1 &

# Prepare Frontend (React)
echo "Preparing Frontend (React)..."
cd /home/ec2-user/PigeonPulse/client

echo "Cleaning old dependencies..."
rm -rf node_modules package-lock.json || echo "Failed to remove node_modules/package-lock.json"

echo "Installing dependencies..."
npm install || { echo "NPM install failed"; exit 1; }

echo "Building frontend..."
npm run build || { echo "Frontend build failed"; exit 1; }

echo "Starting frontend..."
nohup npm run dev -- --host > $LOG_DIR/frontend.log 2>&1 &

