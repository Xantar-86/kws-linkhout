# Maakt (of vervangt) de geplande taak die elke maandag om 18:00 het
# weekoverzicht op Facebook en Instagram zet. Zie scripts/weekoverzicht-pc.mjs.
#
# Eenmalig uitvoeren, als gewone gebruiker (geen beheerder nodig):
#   powershell -ExecutionPolicy Bypass -File scripts\weekoverzicht-pc-taak.ps1
#
# Weghalen: Unregister-ScheduledTask -TaskName "KWS weekoverzicht" -Confirm:$false

$ErrorActionPreference = "Stop"

$script = Join-Path $PSScriptRoot "weekoverzicht-pc.mjs"
$node = (Get-Command node.exe).Source
$geheim = Join-Path $env:USERPROFILE ".kws\weekoverzicht-geheim.txt"

if (-not (Test-Path $script)) { throw "Script niet gevonden: $script" }
if (-not (Test-Path $geheim)) { throw "Geheim niet gevonden: $geheim" }

# conhost --headless: node draait zonder consolevenster. Chrome opent wel,
# maar buiten beeld (de RBFA weigert een onzichtbare Chrome).
$actie = New-ScheduledTaskAction -Execute "conhost.exe" `
  -Argument "--headless `"$node`" `"$script`"" `
  -WorkingDirectory (Split-Path $script)

$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At 18:00

# Stond de pc om 18:00 uit of sliep hij, dan draait de taak zodra hij weer aan
# is. Het script zelf weigert op een andere dag dan maandag.
$instellingen = New-ScheduledTaskSettingsSet `
  -StartWhenAvailable `
  -ExecutionTimeLimit (New-TimeSpan -Minutes 15) `
  -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

Register-ScheduledTask -TaskName "KWS weekoverzicht" `
  -Description "Zet elke maandag om 18:00 het weekoverzicht van KWS Linkhout op Facebook en Instagram (kwslinkhout.be/matchday/weekoverzicht)." `
  -Action $actie -Trigger $trigger -Settings $instellingen -Force | Out-Null

Write-Host "Taak 'KWS weekoverzicht' staat klaar: elke maandag om 18:00."
Write-Host "Logboek: $env:LOCALAPPDATA\kws-weekoverzicht\log.txt"
