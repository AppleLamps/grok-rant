@echo off
REM Stop all running servers
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0stop.ps1"

