# PowerShell script to stop all running servers
Write-Host "🛑 Stopping Trump Letter Generator servers..." -ForegroundColor Yellow
Write-Host ""

$stopped = $false

# Kill processes on port 8000 (backend)
$port8000 = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue
if ($port8000) {
    $port8000 | ForEach-Object {
        Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
    }
    Write-Host "✓ Backend stopped (port 8000)" -ForegroundColor Green
    $stopped = $true
}

# Kill processes on port 3000 (frontend)
$port3000 = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($port3000) {
    $port3000 | ForEach-Object {
        Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
    }
    Write-Host "✓ Frontend stopped (port 3000)" -ForegroundColor Green
    $stopped = $true
}

if (-not $stopped) {
    Write-Host "ℹ️  No servers were running" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "✅ All servers stopped successfully!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Press any key to close..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

