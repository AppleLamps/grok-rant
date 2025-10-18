@echo off
REM This batch file launches the PowerShell script with proper cleanup handling
REM The PowerShell script ensures servers are stopped when the window is closed

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start.ps1"

