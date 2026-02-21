# Stop all CMS servers
# Usage: .\scripts\stop-cms.ps1

Write-Host "Stopping all Node processes..." -ForegroundColor Red
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "All servers stopped!" -ForegroundColor Green
