#!/bin/bash
set -e

LOG_DIR="/home/ec2-user/pigeonpulse-logs"
LOG_FILE="$LOG_DIR/deploy.log"
mkdir -p "$LOG_DIR"
chmod 755 "$LOG_DIR"
echo "Deployment started at $(date)" >> "$LOG_FILE"

# Verify deployed files
echo "Listing deployed backend files..." >> "$LOG_FILE"
ls -l /home/ec2-user/PigeonPulse/ >> "$LOG_FILE" 2>&1
echo "Listing deployed static files..." >> "$LOG_FILE"
ls -l /home/ec2-user/PigeonPulse/static/ >> "$LOG_FILE" 2>&1

# Validate required files
if [ ! -f /home/ec2-user/PigeonPulse/PigeonPulse.Api.dll ]; then
  echo "Error: PigeonPulse.Api.dll not found" >> "$LOG_FILE"
  exit 1
fi
if [ ! -f /home/ec2-user/PigeonPulse/static/index.html ]; then
  echo "Error: index.html not found in static directory" >> "$LOG_FILE"
  exit 1
fi

# Ensure static directory exists and set permissions
echo "Setting permissions for static files..." >> "$LOG_FILE"
sudo mkdir -p /home/ec2-user/PigeonPulse/static
sudo chown -R nginx:nginx /home/ec2-user/PigeonPulse/static
sudo chmod -R 755 /home/ec2-user/PigeonPulse/static

# Create and configure systemd service
echo "Starting backend service..." >> "$LOG_FILE"
sudo bash -c "cat > /etc/systemd/system/pigeonpulse.service <<EOF
[Unit]
Description=PigeonPulse API Service
After=network.target

[Service]
WorkingDirectory=/home/ec2-user/PigeonPulse/publish
ExecStart=/usr/bin/dotnet /home/ec2-user/PigeonPulse/publish/PigeonPulse.Api.dll --urls http://0.0.0.0:5264
Restart=always
RestartSec=10
SyslogIdentifier=pigeonpulse
User=ec2-user
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=ASPNETCORE_LOGGING__CONSOLE__LOGLEVEL__DEFAULT=Debug

[Install]
WantedBy=multi-user.target
EOF"
sudo systemctl daemon-reload
sudo systemctl restart pigeonpulse

sudo systemctl enable pigeonpulse.service
sudo systemctl start pigeonpulse.service
sleep 5
if ! sudo systemctl status pigeonpulse.service >> "$LOG_FILE" 2>&1; then
  echo "Error: Backend service failed to start" >> "$LOG_FILE"
  sudo journalctl -u pigeonpulse.service -b >> "$LOG_FILE" 2>&1
  exit 1
fi

# Copy static files from the correct location
echo "Copying static files..." >> "$LOG_FILE"
sudo cp -r /home/ec2-user/PigeonPulse/publish/static/* /home/ec2-user/PigeonPulse/static/

# Update Nginx configuration
echo "Updating Nginx configuration..." >> "$LOG_FILE"
sudo bash -c "cat > /etc/nginx/conf.d/pigeonpulse.conf <<EOF
server {
    listen 80;
    server_name 13.48.248.248;

    root /home/ec2-user/PigeonPulse/static;
    index index.html index.htm;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:5264;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF"

# Restart Nginx
echo "Restarting Nginx..." >> "$LOG_FILE"
if ! sudo nginx -t >> "$LOG_FILE" 2>&1; then
  echo "Error: Nginx configuration test failed" >> "$LOG_FILE"
  exit 1
fi
if ! sudo systemctl restart nginx >> "$LOG_FILE" 2>&1; then
  echo "Error: Nginx restart failed" >> "$LOG_FILE"
  exit 1
fi

echo "Deployment completed at $(date)" >> "$LOG_FILE"
exit 0
