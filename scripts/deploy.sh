#!/bin/bash
set -e

LOG_DIR="/home/ec2-user/pigeonpulse-logs"
mkdir -p "$LOG_DIR"
chmod 755 "$LOG_DIR"

# Stop any existing service to free resources
echo "Stopping existing service (if running)..." >> "$LOG_DIR/deploy.log"
sudo systemctl stop pigeonpulse.service 2>> "$LOG_DIR/deploy.log" || true

# Prepare Frontend (React) first to avoid resource contention
echo "Preparing Frontend (React)..." >> "$LOG_DIR/deploy.log"
cd /home/ec2-user/PigeonPulse/client || { echo "Failed to cd into client" >> "$LOG_DIR/deploy.log"; exit 1; }
timeout 300 npm install >> "$LOG_DIR/deploy.log" 2>&1 || { echo "NPM install timed out or failed" >> "$LOG_DIR/deploy.log"; exit 1; }
timeout 300 npm run build >> "$LOG_DIR/deploy.log" 2>&1 || { echo "Frontend build timed out or failed" >> "$LOG_DIR/deploy.log"; exit 1; }
sudo mkdir -p /home/ec2-user/PigeonPulse/static
sudo cp -r dist/* /home/ec2-user/PigeonPulse/static/ || { echo "Failed to copy frontend build" >> "$LOG_DIR/deploy.log"; exit 1; }
sudo chown -R nginx:nginx /home/ec2-user/PigeonPulse/static  # Change to nginx user for web server
sudo chmod -R 755 /home/ec2-user/PigeonPulse/static

# Start Backend (.NET API) after frontend is done
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

# Restart Nginx to pick up new static files
echo "Restarting Nginx..." >> "$LOG_DIR/deploy.log"
sudo systemctl restart nginx 2>> "$LOG_DIR/deploy.log" || { echo "Nginx restart failed" >> "$LOG_DIR/deploy.log"; exit 1; }

echo "Deployment completed successfully" >> "$LOG_DIR/deploy.log"
exit 0