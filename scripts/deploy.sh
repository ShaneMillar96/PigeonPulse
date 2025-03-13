#!/bin/bash
set -e

LOG_DIR="/home/ec2-user/pigeonpulse-logs"
mkdir -p "$LOG_DIR"
chmod 755 "$LOG_DIR"

# Log start time
echo "Deployment started at $(date)" >> "$LOG_DIR/deploy.log"

# Stop any existing service to free resources
echo "Stopping existing service (if running)..." >> "$LOG_DIR/deploy.log"
sudo systemctl stop pigeonpulse.service 2>> "$LOG_DIR/deploy.log" || true

# Validate client directory
echo "Validating client directory..." >> "$LOG_DIR/deploy.log"
if [ ! -d "/home/ec2-user/PigeonPulse/client" ]; then
  echo "Error: Client directory not found" >> "$LOG_DIR/deploy.log"
  exit 1
fi
ls -la /home/ec2-user/PigeonPulse/client >> "$LOG_DIR/deploy.log" 2>&1

# Prepare Frontend (React) with retries
echo "Preparing Frontend (React)..." >> "$LOG_DIR/deploy.log"
cd /home/ec2-user/PigeonPulse/client || { echo "Failed to cd into client" >> "$LOG_DIR/deploy.log"; exit 1; }
rm -rf node_modules dist
MAX_ATTEMPTS=3
for ((i=1; i<=MAX_ATTEMPTS; i++)); do
  echo "Attempt $i of $MAX_ATTEMPTS: Running npm install..." >> "$LOG_DIR/deploy.log"
  if timeout 300 npm install >> "$LOG_DIR/deploy.log" 2>&1; then
    break
  elif [ $i -eq $MAX_ATTEMPTS ]; then
    echo "NPM install failed after $MAX_ATTEMPTS attempts" >> "$LOG_DIR/deploy.log"
    exit 1
  fi
  sleep 5
done

for ((i=1; i<=MAX_ATTEMPTS; i++)); do
  echo "Attempt $i of $MAX_ATTEMPTS: Running npm run build..." >> "$LOG_DIR/deploy.log"
  if timeout 300 npm run build >> "$LOG_DIR/deploy.log" 2>&1; then
    break
  elif [ $i -eq $MAX_ATTEMPTS ]; then
    echo "Frontend build failed after $MAX_ATTEMPTS attempts" >> "$LOG_DIR/deploy.log"
    exit 1
  fi
  sleep 5
done

# Validate and copy dist contents
echo "Listing dist directory contents..." >> "$LOG_DIR/deploy.log"
ls -la dist >> "$LOG_DIR/deploy.log" 2>&1 || { echo "dist directory is empty or missing" >> "$LOG_DIR/deploy.log"; exit 1; }
sudo mkdir -p /home/ec2-user/PigeonPulse/static
sudo cp -r dist/* /home/ec2-user/PigeonPulse/static/ || { echo "Failed to copy frontend build" >> "$LOG_DIR/deploy.log"; exit 1; }
sudo chown -R nginx:nginx /home/ec2-user/PigeonPulse/static
sudo chmod -R 755 /home/ec2-user/PigeonPulse/static
echo "Verified static directory contents:" >> "$LOG_DIR/deploy.log"
ls -la /home/ec2-user/PigeonPulse/static >> "$LOG_DIR/deploy.log" 2>&1

# Start Backend (.NET API)
echo "Starting Backend (.NET API)..." >> "$LOG_DIR/deploy.log"
cd /home/ec2-user/PigeonPulse/server-publish || { echo "Failed to cd into server-publish" >> "$LOG_DIR/deploy.log"; exit 1; }
export ASPNETCORE_ENVIRONMENT=Production
if [ ! -f /etc/systemd/system/pigeonpulse.service ]; then
  cat <<EOF | sudo tee /etc/systemd/system/pigeonpulse.service
[Unit]
Description=PigeonPulse API Service
After=network.target

[Service]
WorkingDirectory=/home/ec2-user/PigeonPulse/server-publish
ExecStart=/usr/bin/dotnet PigeonPulse.Api.dll --urls "http://0.0.0.0:5264"
Restart=always
RestartSec=10
SyslogIdentifier=pigeonpulse
User=ec2-user
Environment=ASPNETCORE_ENVIRONMENT=Production

[Install]
WantedBy=multi-user.target
EOF
  sudo systemctl daemon-reload
  sudo systemctl enable pigeonpulse.service
fi
sudo systemctl restart pigeonpulse.service
sleep 5
if ! sudo systemctl status pigeonpulse.service >> "$LOG_DIR/deploy.log" 2>&1; then
  echo "Backend service failed to start" >> "$LOG_DIR/deploy.log"
  exit 1
fi

# Restart Nginx with validation
echo "Restarting Nginx..." >> "$LOG_DIR/deploy.log"
if ! sudo systemctl restart nginx 2>> "$LOG_DIR/deploy.log"; then
  echo "Nginx restart failed" >> "$LOG_DIR/deploy.log"
  exit 1
fi
if ! sudo nginx -t >> "$LOG_DIR/deploy.log" 2>&1; then
  echo "Nginx configuration test failed" >> "$LOG_DIR/deploy.log"
  exit 1
fi

echo "Deployment completed successfully at $(date)" >> "$LOG_DIR/deploy.log"
exit 0