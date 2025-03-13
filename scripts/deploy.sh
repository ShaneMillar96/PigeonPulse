#!/bin/bash
set -e

LOG_DIR="/home/ec2-user/pigeonpulse-logs"
mkdir -p "$LOG_DIR"
chmod 755 "$LOG_DIR"

# Log start time
echo "Deployment started at $(date)" >> "$LOG_DIR/deploy.log"

# Verify static directory (populated by appspec.yml)
echo "Verifying static directory..." >> "$LOG_DIR/deploy.log"
if [ ! -f "/home/ec2-user/PigeonPulse/static/index.html" ]; then
  echo "Error: static directory is missing index.html - deployment artifact may be incomplete" >> "$LOG_DIR/deploy.log"
  ls -la /home/ec2-user/PigeonPulse/static >> "$LOG_DIR/deploy.log" 2>&1
  exit 1
fi
sudo chown -R nginx:nginx /home/ec2-user/PigeonPulse/static
sudo chmod -R 755 /home/ec2-user/PigeonPulse/static
echo "Static directory contents:" >> "$LOG_DIR/deploy.log"
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