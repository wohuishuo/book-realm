$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
if (-not $env:USER_CENTER_ROOT) {
    $teamProject = -join ([char[]](0x56E2, 0x961F, 0x9879, 0x76EE))
    $env:USER_CENTER_ROOT = Join-Path (Join-Path $env:USERPROFILE $teamProject) 'user-center'
}
if (-not $env:LIBRARY_ROOT) { $env:LIBRARY_ROOT = Join-Path (Split-Path $root -Parent) 'br-library-service' }
if (-not $env:STATS_ROOT) { $env:STATS_ROOT = Join-Path (Split-Path $root -Parent) 'br-event-stats' }
if (-not $env:AI_ROOT) { $env:AI_ROOT = Join-Path (Split-Path $root -Parent) 'br-ai-service' }

Push-Location $root
try {
    New-Item -ItemType Directory -Force reports | Out-Null
    docker compose -f docker-compose.bdd.yml up -d --build --wait
    if ($LASTEXITCODE -ne 0) { throw "Platform startup failed with exit code $LASTEXITCODE" }
    $env:AUTH_URL = 'http://127.0.0.1:8080/api'
    npm run bdd:api
    if ($LASTEXITCODE -ne 0) { throw "Cucumber failed with exit code $LASTEXITCODE" }
} finally {
    docker compose -f docker-compose.bdd.yml logs --no-color | Set-Content reports/platform-services.log
    docker compose -f docker-compose.bdd.yml down -v
    Pop-Location
}
