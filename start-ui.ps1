# MIX - local preview (Windows)
$Host.UI.RawUI.WindowTitle = "MIX"
Set-Location $PSScriptRoot

Write-Host "MIX · Parker + STP + PegLab"

npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$loopback = "http://127.0.0.1:8910/"
$url = "http://mix.localhost:8910/"
$busy = $false
try {
  $conn = Get-NetTCPConnection -LocalPort 8910 -State Listen -ErrorAction Stop | Select-Object -First 1
  if ($conn) { $busy = $true }
} catch {}

Start-Process $loopback
if ($busy) {
  Write-Host "Already running. Opened $loopback"
  Write-Host "Also $url"
  exit 0
}

Write-Host "Open $loopback"
Write-Host "Also $url"
Write-Host "PegLab live lab: $($loopback)lab/"
$env:PORT = "8910"
$env:HOST = "127.0.0.1"
$env:LOCAL_HOST = "mix.localhost"
node scripts/static-preview.mjs dist
