#!/bin/bash

LOG_FILE="/home/ec2-user/PigeonPulse/deploy.log"
DEPLOY_DIR="/home/ec2-user/PigeonPulse"
FRONTEND_DIR="$DEPLOY_DIR/frontend"
BACKEND_DIR="$DEPLOY_DIR/publish"

exec > >(tee -a "$LOG_FILE") 2>&1

echo "Starting deployment at $(date)"

# Change ownership
sudo chown -R ec2-user:ec2-user "$DEPLOY_DIR"
sudo chmod +x "$DEPLOY_DIR/scripts"/*.sh

# Start backend
if [ -f "$BACKEND_DIR/PigeonPulse.Api.dll" ]; then
  echo "Starting Backend (.NET API)..."
  cd "$BACKEND_DIR" || exit 1
  nohup dotnet PigeonPulse.Api.dll &
else
  echo "Error: Backend not found!" >&2
  exit 1
fi

# Start frontend
if [ -d "$FRONTEND_DIR" ]; then
  echo "Starting Frontend (React)..."
  cd "$FRONTEND_DIR" || exit 1
  nohup npm start &
else
  echo "Error: Frontend directory not found!" >&2
  exit 1
fi

echo "Deployment complete at $(date)"
