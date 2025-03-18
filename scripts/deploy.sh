#!/bin/bash

set -e

LOG_FILE="/home/ec2-user/pigeonpulse-logs/deploy.log"
mkdir -p /home/ec2-user/pigeonpulse-logs
chmod 755 /home/ec2-user/pigeonpulse-logs
echo "Deployment started at $(date)" >> "$LOG_FILE"

# Validate required files
if [ ! -f /home/ec2-user/PigeonPulse/publish/PigeonPulse.Api.dll ]; then
  echo "Error: PigeonPulse.Api.dll not found" >> "$LOG_FILE"
  exit 1
fi
if [ ! -f /home/ec2-user/PigeonPulse/publish/static/index.html ]; then
  echo "Error: index.html not found" >> "$LOG_FILE"
  exit 1
fi

# Create and configure systemd service
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

[Install]
WantedBy=multi-user.target
EOF"

sudo systemctl daemon-reload
sudo systemctl restart pigeonpulse
sudo systemctl enable pigeonpulse.service

# Update Nginx configuration
sudo bash -c "cat > /etc/nginx/conf.d/pigeonpulse.conf <<EOF
server {
    listen 80;
    server_name dev.pigeonpulse.com;
    root /home/ec2-user/PigeonPulse/publish/static;
    index index.html index.htm;
    location / { try_files \$uri \$uri/ /index.html; }
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

sudo systemctl restart nginx

echo "Deployment completed successfully at $(date)" >> "$LOG_FILE"
exit 0
