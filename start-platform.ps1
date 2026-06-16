$ErrorActionPreference = "Stop"

function Info($message) {
  Write-Host "[book-realm] $message" -ForegroundColor Cyan
}

function Listening($port) {
  $count = (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Measure-Object).Count
  return $count -gt 0
}

function Ensure-Database($name) {
  $mysqlBase = "$env:USERPROFILE\scoop\apps\mysql-lts\current"
  $mysql = Join-Path $mysqlBase "bin\mysql.exe"
  if (Test-Path $mysql) {
    & $mysql -u root -e "CREATE DATABASE IF NOT EXISTS $name DEFAULT CHARACTER SET utf8mb4;" 2>$null
  }
}

function Start-JarService($name, $dir, $port, $extraEnv = @{}) {
  if (Listening $port) {
    Info "$name already listening on $port"
    return
  }

  $jar = Get-ChildItem "$dir\target\*.jar" -ErrorAction SilentlyContinue |
    Where-Object Name -notlike "*original*" |
    Select-Object -First 1

  if (-not $jar) {
    Info "$name jar missing; building..."
    Push-Location $dir
    mvn -q -DskipTests package
    Pop-Location
    $jar = Get-ChildItem "$dir\target\*.jar" |
      Where-Object Name -notlike "*original*" |
      Select-Object -First 1
  }

  foreach ($key in $extraEnv.Keys) {
    [Environment]::SetEnvironmentVariable($key, $extraEnv[$key], "Process")
  }

  Info "starting $name on $port"
  Start-Process java -ArgumentList @("-jar", $jar.FullName) -WorkingDirectory $dir -WindowStyle Hidden
}

function Check-Http($name, $url) {
  try {
    $response = Invoke-RestMethod $url -TimeoutSec 8
    $ok = ($response.code -eq 0) -or ($response.status -eq "UP") -or ($response.ok -eq $true)
    return [pscustomobject]@{ Name = $name; OK = $ok; Detail = $url }
  } catch {
    return [pscustomobject]@{ Name = $name; OK = $false; Detail = $_.Exception.Message }
  }
}

$root = Split-Path -Parent $PSScriptRoot
$teamProjectDirName = -join ([char[]](0x56E2, 0x961F, 0x9879, 0x76EE))
$userCenterDir = Join-Path (Join-Path $env:USERPROFILE $teamProjectDirName) "user-center"
$libraryDir = Join-Path $root "br-library-service"
$statsDir = Join-Path $root "br-event-stats"
$aiDir = Join-Path $root "br-ai-service"

Info "starting infrastructure"

$mysqlBase = "$env:USERPROFILE\scoop\apps\mysql-lts\current"
if (-not (Listening 3306)) {
  Start-Process "$mysqlBase\bin\mysqld.exe" -ArgumentList "--defaults-file=$mysqlBase\my.ini" -WindowStyle Hidden
}

if (-not (Listening 6379)) {
  Start-Process "$env:USERPROFILE\scoop\apps\redis\current\redis-server.exe" -WindowStyle Hidden
}

if (-not (Listening 5672)) {
  $env:ERLANG_HOME = "$env:USERPROFILE\scoop\apps\erlang\current"
  $env:RABBITMQ_BASE = "C:\rabbitmq-data"
  $rabbit = "$env:USERPROFILE\scoop\apps\rabbitmq\current\sbin\rabbitmq-server.bat"
  Start-Process $rabbit -WorkingDirectory (Split-Path $rabbit) -WindowStyle Hidden
}

Info "starting user center docker compose"
Push-Location $userCenterDir
docker compose up -d
Pop-Location

Ensure-Database "book_realm_library"
Ensure-Database "book_realm_stats"

Start-JarService "library" $libraryDir 8082
Start-JarService "stats" $statsDir 8083

$aiEnv = @{}
if ($env:DEEPSEEK_API_KEY) {
  $aiEnv["DEEPSEEK_API_KEY"] = $env:DEEPSEEK_API_KEY
}
Start-JarService "ai" $aiDir 8084 $aiEnv

Info "waiting for services"
Start-Sleep -Seconds 20

$checks = @(
  [pscustomobject]@{ Name = "mysql:3306"; OK = (Listening 3306); Detail = "" },
  [pscustomobject]@{ Name = "redis:6379"; OK = (Listening 6379); Detail = "" },
  [pscustomobject]@{ Name = "rabbitmq:5672"; OK = (Listening 5672); Detail = "" },
  [pscustomobject]@{ Name = "rabbitmq-ui:15672"; OK = (Listening 15672); Detail = "" },
  (Check-Http "user-center" "http://localhost/api/health"),
  (Check-Http "library" "http://localhost:8082/api/health"),
  (Check-Http "stats" "http://localhost:8083/api/health"),
  (Check-Http "ai" "http://localhost:8084/api/health")
)

$checks | Format-Table -AutoSize

if ($checks.OK -contains $false) {
  throw "Some platform services are not healthy."
}

Info "platform is ready"
