#!/bin/bash

set -e

echo "Running BeforeInstall script..."

# Clean up old deployment files
sudo rm -rf /home/ec2-user/PigeonPulse/publish/*
sudo rm -rf /home/ec2-user/PigeonPulse/scripts/*

echo "BeforeInstall script complete."
