# PowerShell script to start both servers with proper cleanup
# This ensures servers are stopped when the window is closed or Ctrl+C is pressed

Write-Host "🚀 Starting Trump Letter Generator..." -ForegroundColor Cyan
Write-Host ""

# Check if Python virtual environment exists
if (-not (Test-Path "backend\venv")) {
    Write-Host "❌ Python virtual environment not found!" -ForegroundColor Red
    Write-Host "Please run setup first:" -ForegroundColor Yellow
    Write-Host "  cd backend"
    Write-Host "  python -m venv venv"
    Write-Host "  venv\Scripts\activate"
    Write-Host "  pip install -r requirements.txt"
    exit 1
}

# Store process objects for cleanup
$backendProcess = $null
$frontendProcess = $null

# Cleanup function to stop all servers
function Stop-Servers {
    Write-Host ""
    Write-Host "🧹 Stopping servers..." -ForegroundColor Yellow
    
    # Kill processes on port 8000 (backend)
    $port8000 = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue
    if ($port8000) {
        $port8000 | ForEach-Object {
            Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
        }
        Write-Host "✓ Backend stopped (port 8000)" -ForegroundColor Green
    }
    
    # Kill processes on port 3000 (frontend)
    $port3000 = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
    if ($port3000) {
        $port3000 | ForEach-Object {
            Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
        }
        Write-Host "✓ Frontend stopped (port 3000)" -ForegroundColor Green
    }
    
    # Also stop the process objects if they exist
    if ($backendProcess -and !$backendProcess.HasExited) {
        Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
    }
    if ($frontendProcess -and !$frontendProcess.HasExited) {
        Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue
    }
    
    Write-Host "✅ All servers stopped!" -ForegroundColor Green
}

# Register cleanup on script exit (Ctrl+C or window close)
$null = Register-EngineEvent PowerShell.Exiting -Action {
    Stop-Servers
}

# Trap Ctrl+C
trap {
    Stop-Servers
    exit
}

try {
    # Start backend
    Write-Host "🐍 Starting Python backend (port 8000)..." -ForegroundColor Yellow
    $backendProcess = Start-Process -FilePath "backend\venv\Scripts\python.exe" -ArgumentList "backend\main.py" -PassThru -WindowStyle Minimized
    
    # Wait for backend to start
    Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Gray
    Start-Sleep -Seconds 3
    
    # Start frontend
    Write-Host "⚛️  Starting Next.js frontend (port 3000)..." -ForegroundColor Yellow
    $frontendProcess = Start-Process -FilePath "npm.cmd" -ArgumentList "run", "dev" -PassThru -WindowStyle Minimized
    
    Write-Host ""
    Write-Host "✅ Both servers started successfully!" -ForegroundColor Green
    Write-Host "   Backend:  http://localhost:8000" -ForegroundColor Cyan
    Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📝 Note: Servers are running in minimized windows" -ForegroundColor Gray
    Write-Host "🛑 Press Ctrl+C or close this window to stop all servers" -ForegroundColor Yellow
    Write-Host ""
    
    # Keep script running and monitor processes
    while ($true) {
        # Check if processes are still running
        if ($backendProcess.HasExited) {
            Write-Host "⚠️  Backend process exited unexpectedly!" -ForegroundColor Red
            break
        }
        if ($frontendProcess.HasExited) {
            Write-Host "⚠️  Frontend process exited unexpectedly!" -ForegroundColor Red
            break
        }
        
        Start-Sleep -Seconds 2
    }
}
catch {
    Write-Host "❌ Error occurred: $_" -ForegroundColor Red
}
finally {
    # Cleanup on exit
    Stop-Servers
}

