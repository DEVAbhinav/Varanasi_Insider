#!/bin/bash

# Start Azure Functions in background
echo "🚀 Starting Azure Functions on port 7071..."
cd api
func start --port 7071 &
FUNC_PID=$!

# Wait for Azure Functions to start
sleep 5

# Start Next.js dev server
echo "🚀 Starting Next.js dev server on port 3000..."
cd ..
npm run dev

# Cleanup on exit
trap "kill $FUNC_PID" EXIT
