#!/bin/bash
set -e
cd /home/ec2-user/PigeonPulse/client || { echo "Error: Client directory not found"; exit 1; }
npm install
npm run build
mkdir -p /home/ec2-user/PigeonPulse/static
cp -r dist/* /home/ec2-user/PigeonPulse/static/
chown -R nginx:nginx /home/ec2-user/PigeonPulse/static
chmod -R 755 /home/ec2-user/PigeonPulse/static