#!/bin/bash
set -e

# Define log directory
LOG_DIR="/home/ec2-user/pigeonpulse-logs"
mkdir -p "$LOG_DIR"
chmod 755 "$LOG_DIR"

# Start Backend (.NET API) as a service
echo "Starting Backend (.NET API)..." >> "$LOG_DIR/deploy.log"
cd /home/ec2-user/PigeonPulse/server-publish || { echo "Failed to cd into server-publish" >> "$LOG_DIR/deploy.log"; exit 1; }
export ASPNETCORE_ENVIRONMENT=Production
# Create a service file if not exists
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
sleep 5  # Give it time to start
sudo systemctl status pigeonpulse.service >> "$LOG_DIR/deploy.log" 2>&1

# Prepare Frontend (React) - Build for production
echo "Preparing Frontend (React)..." >> "$LOG_DIR/deploy.log"
cd /home/ec2-user/PigeonPulse/client || { echo "Failed to cd into client" >> "$LOG_DIR/deploy.log"; exit 1; }
npm install >> "$LOG_DIR/deploy.log" 2>&1 || { echo "NPM install failed" >> "$LOG_DIR/deploy.log"; exit 1; }
npm run build >> "$LOG_DIR/deploy.log" 2>&1 || { echo "Frontend build failed" >> "$LOG_DIR/deploy.log"; exit 1; }
# Copy build output to a static directory (e.g., for Nginx or direct serving)
sudo mkdir -p /home/ec2-user/PigeonPulse/static
sudo cp -r build/* /home/ec2-user/PigeonPulse/static/ || { echo "Failed to copy frontend build" >> "$LOG_DIR/deploy.log"; exit 1; }
sudo chown -R ec2-user:ec2-user /home/ec2-user/PigeonPulse/static
sudo chmod -R 755 /home/ec2-user/PigeonPulse/static

echo "Deployment completed successfully" >> "$LOG_DIR/deploy.log"
exit 0