#!/bin/bash
echo "Starting Backend (.NET API)..."
cd /home/ec2-user/PigeonPulse/server/src/PigeonPulse.Api
export ASPNETCORE_ENVIRONMENT=Development
nohup dotnet run --urls "http://0.0.0.0:5264" > backend.log 2>&1 &

echo "Starting Frontend (React)..."
cd /home/ec2-user/PigeonPulse/client
nohup npm install && npm run build && npm start > frontend.log 2>&1 &
