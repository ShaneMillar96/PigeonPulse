#!/bin/bash
cd /home/ec2-user/PigeonPulse/client

echo "Removing old dependencies..."
rm -rf node_modules package-lock.json

echo "Installing dependencies..."
npm install
