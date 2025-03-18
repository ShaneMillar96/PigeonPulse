#!/bin/bash
set -e
DEPLOYMENT_DIR=$(ls -d /opt/codedeploy-agent/deployment-root/*/d-*/deployment-archive/client/dist 2>/dev/null || echo "")
if [ -n "$DEPLOYMENT_DIR" ]; then
    sudo mkdir -p /home/ec2-user/PigeonPulse/static
    sudo cp -r "$DEPLOYMENT_DIR"/* /home/ec2-user/PigeonPulse/static/
    sudo chown -R nginx:nginx /home/ec2-user/PigeonPulse/static
    sudo chmod -R 755 /home/ec2-user/PigeonPulse/static
else
    echo "Error: No dist directory found in deployment archive"
    exit 1
fi