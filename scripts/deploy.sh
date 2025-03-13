#!/bin/bash
set -e  # Stop execution on any error

# Define log directory (use a directory the deployment user can access)
LOG_DIR="/home/ec2-user/pigeonpulse-logs"
mkdir -p $LOG_DIR
chmod 755 $LOG_DIR  # Ensure the directory is writable

# Start Backend (.NET API)
echo "Starting Backend (.NET API)..."
cd /home/ec2-user/PigeonPulse/server-publish || { echo "Failed to cd into server-publish"; exit 1; }
export ASPNETCORE_ENVIRONMENT=Development
nohup dotnet PigeonPulse.Api.dll --urls "http://0.0.0.0:5264" > $LOG_DIR/backend.log 2>&1 &

# Prepare Frontend (React)
echo "Preparing Frontend (React)..."
cd /home/ec2-user/PigeonPulse/client || { echo "Failed to cd into client"; exit 1; }

echo "Installing dependencies..."
npm install || { echo "NPM install failed"; exit 1; }

echo "Building frontend..."
npm run build || { echo "Frontend build failed"; exit 1; }

echo "Starting frontend..."
nohup npm run dev -- --host > $LOG_DIR/frontend.log 2>&1 &

echo "Deployment completed successfully"
exit 0