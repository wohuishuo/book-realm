# 书域平台 · 后端一键启动(本地开发/联调用)
# 用法:在 book-realm 目录运行  ./start-platform.ps1
# 起:本地 MySQL + Redis + RabbitMQ + 用户中心(Docker 四容器) + 书库服务(jar)
# 全部健康检查通过后,打印手机联调要用的局域网 IP。

$ErrorActionPreference = "Continue"
function Listening($port) { (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Measure-Object).Count -gt 0 }
function Step($msg) { Write-Host "── $msg" -ForegroundColor Cyan }

# ───── 1. 本地 MySQL(书库/统计服务用,3306)─────
$myBase = "$env:USERPROFILE\scoop\apps\mysql-lts\current"
if (-not (Listening 3306)) {
  Step "启动本地 MySQL..."
  Start-Process "$myBase\bin\mysqld.exe" -ArgumentList "--defaults-file=$myBase\my.ini" -WindowStyle Hidden
} else { Step "MySQL 已在运行" }

# ───── 2. 本地 Redis(6379)─────
if (-not (Listening 6379)) {
  Step "启动本地 Redis..."
  Start-Process "$env:USERPROFILE\scoop\apps\redis\current\redis-server.exe" -WindowStyle Hidden
} else { Step "Redis 已在运行" }

# ───── 3. RabbitMQ(5672 / 管理台 15672)─────
if (-not (Listening 5672)) {
  Step "启动 RabbitMQ..."
  $env:ERLANG_HOME = "$env:USERPROFILE\scoop\apps\erlang\current"
  $env:RABBITMQ_BASE = "C:\rabbitmq-data"   # ASCII 路径,避开中文用户名
  Start-Process rabbitmq-server -WindowStyle Hidden
} else { Step "RabbitMQ 已在运行" }

# ───── 4. 用户中心(Docker 四容器:前端 :80 / 后端 / MySQL / Redis)─────
Step "启动用户中心(docker compose)..."
$ucDir = "C:\Users\艾莉\团队项目\user-center"
if (Get-Command docker -ErrorAction SilentlyContinue) {
  Push-Location $ucDir; docker compose up -d 2>&1 | Select-Object -Last 2; Pop-Location
} else {
  Write-Host "⚠️ docker 不可用(Docker Desktop 没开?),用户中心未启动" -ForegroundColor Yellow
}

# ───── 5. 书库服务(本地 jar,:8082)─────
$libDir = "C:\Users\艾莉\知识数据库\起点-安卓项目\br-library-service"
$libJar = Get-ChildItem "$libDir\target\*.jar" -ErrorAction SilentlyContinue | Where-Object Name -notlike "*original*" | Select-Object -First 1
if (-not (Listening 8082)) {
  if (-not $libJar) {
    Step "书库 jar 不存在,构建中(首次较慢)..."
    Push-Location $libDir; mvn -q -DskipTests package; Pop-Location
    $libJar = Get-ChildItem "$libDir\target\*.jar" | Where-Object Name -notlike "*original*" | Select-Object -First 1
  }
  Step "启动书库服务..."
  # 建库(幂等)
  & "$myBase\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS book_realm_library DEFAULT CHARACTER SET utf8mb4;" 2>$null
  Start-Process java -ArgumentList "-jar", "`"$($libJar.FullName)`"" -WindowStyle Hidden
} else { Step "书库服务已在运行" }

# ───── 6. 健康检查 ─────
Step "等待就绪并健康检查(约 25 秒)..."
Start-Sleep -Seconds 25
$checks = @(
  @{ 名称 = "本地 MySQL (3306)";       OK = (Listening 3306) },
  @{ 名称 = "Redis (6379)";            OK = (Listening 6379) },
  @{ 名称 = "RabbitMQ (5672)";         OK = (Listening 5672) },
  @{ 名称 = "RabbitMQ 管理台 (15672)"; OK = (Listening 15672) }
)
try { $h = Invoke-RestMethod "http://localhost/api/health" -TimeoutSec 8; $checks += @{ 名称 = "用户中心(经 :80)"; OK = ($h.code -eq 0) } } catch { $checks += @{ 名称 = "用户中心(经 :80)"; OK = $false } }
try { $h = Invoke-RestMethod "http://localhost:8082/api/health" -TimeoutSec 8; $checks += @{ 名称 = "书库服务 (8082)"; OK = ($h.code -eq 0) } } catch { $checks += @{ 名称 = "书库服务 (8082)"; OK = $false } }

Write-Host ""
foreach ($c in $checks) { Write-Host ("  {0}  {1}" -f ($(if ($c.OK) { "✅" } else { "❌" })), $c.名称) }

# ───── 7. 给真机联调的局域网 IP(优先选有默认网关的网卡 = 真实 WiFi/以太网)─────
$ip = (Get-NetIPConfiguration -ErrorAction SilentlyContinue |
  Where-Object { $_.IPv4DefaultGateway -and $_.NetAdapter.Status -eq "Up" } |
  Select-Object -First 1).IPv4Address.IPAddress
if (-not $ip) { $ip = "<跑 ipconfig 手查>" }
Write-Host ""
Write-Host "📱 手机(同一 WiFi)访问后端用这个 IP:" -ForegroundColor Green
Write-Host "   用户中心:http://${ip}/api/      书库:http://${ip}:8082/api/" -ForegroundColor Green
Write-Host "   (App 的 baseUrl 常量填它;模拟器才用 10.0.2.2)"
