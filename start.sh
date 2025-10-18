#!/bin/bash

# Start both frontend and backend servers with proper cleanup

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

# Cleanup function to stop all servers
cleanup() {
    echo ""
    echo "🧹 Stopping servers..."
    
    # Kill backend process
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "✓ Backend stopped"
    fi
    
    # Kill frontend process
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "✓ Frontend stopped"
    fi
    
    # Also kill any processes on ports 8000 and 3000 as backup
    lsof -ti:8000 | xargs kill -9 2>/dev/null
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    
    echo "✅ All servers stopped!"
    exit 0
}

# Register cleanup on script exit (Ctrl+C, terminal close, etc.)
trap cleanup EXIT INT TERM

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
echo "📝 Note: Servers will automatically stop when you close this terminal or press Ctrl+C"
echo "🛑 Press Ctrl+C to stop all servers"
echo ""

# Wait for processes (will trigger cleanup trap on exit)
wait

