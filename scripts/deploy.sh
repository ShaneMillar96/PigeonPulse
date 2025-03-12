#!/bin/bash
echo "Starting Backend (.NET API)..."
cd /home/ec2-user/PigeonPulse/server/src/PigeonPulse.Api
export ASPNETCORE_ENVIRONMENT=Development
nohup dotnet run --urls "http://0.0.0.0:5264" > backend.log 2>&1 &

echo "Preparing Frontend (React)..."
cd /home/ec2-user/PigeonPulse/client
echo "Cleaning old dependencies..."
rm -rf node_modules package-lock.json

echo "Installing dependencies..."
npm install

echo "Building frontend..."
npm run build

echo "Starting frontend..."
nohup npm run dev -- --host > frontend.log 2>&1 &
