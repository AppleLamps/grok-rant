#!/bin/bash

# Stop all running servers

echo "🛑 Stopping Trump Letter Generator servers..."
echo ""

stopped=false

# Kill processes on port 8000 (backend)
backend_pids=$(lsof -ti:8000 2>/dev/null)
if [ ! -z "$backend_pids" ]; then
    echo "$backend_pids" | xargs kill -9 2>/dev/null
    echo "✓ Backend stopped (port 8000)"
    stopped=true
fi

# Kill processes on port 3000 (frontend)
frontend_pids=$(lsof -ti:3000 2>/dev/null)
if [ ! -z "$frontend_pids" ]; then
    echo "$frontend_pids" | xargs kill -9 2>/dev/null
    echo "✓ Frontend stopped (port 3000)"
    stopped=true
fi

if [ "$stopped" = false ]; then
    echo "ℹ️  No servers were running"
else
    echo ""
    echo "✅ All servers stopped successfully!"
fi

