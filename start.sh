#!/bin/bash

# Start both frontend and backend servers

echo "🚀 Starting Trump Letter Generator..."
echo ""

# Check if Python virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "❌ Python virtual environment not found!"
    echo "Please run setup first:"
    echo "  cd backend"
    echo "  python -m venv venv"
    echo "  source venv/bin/activate  # or venv\\Scripts\\activate on Windows"
    echo "  pip install -r requirements.txt"
    exit 1
fi

# Start backend in background
echo "🐍 Starting Python backend (port 8000)..."
cd backend
source venv/bin/activate 2>/dev/null || venv\\Scripts\\activate 2>/dev/null
python main.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "⚛️  Starting Next.js frontend (port 3000)..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers started!"
echo "   Backend:  http://localhost:8000"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait

