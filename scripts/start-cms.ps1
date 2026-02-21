# Start CMS servers script voor LOKALE ontwikkeling
# Voor productie gebruik je Netlify Identity (geen lokale server nodig)
# Usage: .\scripts\start-cms.ps1

$ErrorActionPreference = "SilentlyContinue"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Lokale CMS ontwikkeling" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Voor productie gebruik je Netlify Identity:" -ForegroundColor Yellow
Write-Host "- Geen decap-server nodig" -ForegroundColor Yellow
Write-Host "- Multi-provider login (GitHub, Google, Email)" -ForegroundColor Yellow
Write-Host ""

Write-Host "Stopping existing Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

Write-Host "Cleaning Next.js cache..." -ForegroundColor Yellow
Remove-Item -Path ".next\dev\lock" -ErrorAction SilentlyContinue

Write-Host "Starting Decap CMS proxy server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npx decap-server"

Start-Sleep -Seconds 2

Write-Host "Starting Next.js dev server..." -ForegroundColor Green
Write-Host ""
Write-Host "Admin beschikbaar op: http://localhost:3000/admin" -ForegroundColor Cyan
Write-Host ""
npm run dev
