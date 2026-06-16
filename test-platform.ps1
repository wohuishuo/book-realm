$ErrorActionPreference = "Stop"

function Info($message) {
  Write-Host "[test] $message" -ForegroundColor Cyan
}

function Invoke-Json($method, $url, $body = $null) {
  if ($null -eq $body) {
    return Invoke-RestMethod -Method $method -Uri $url -TimeoutSec 15
  }
  $json = $body | ConvertTo-Json -Depth 8
  return Invoke-RestMethod -Method $method -Uri $url -ContentType "application/json" -Body $json -TimeoutSec 20
}

function Assert-Ok($name, $response) {
  if ($response.code -ne 0) {
    throw "$name failed: code=$($response.code), message=$($response.message)"
  }
  Write-Host "  OK $name"
}

$root = Split-Path -Parent $PSScriptRoot
$teamProjectDirName = -join ([char[]](0x56E2, 0x961F, 0x9879, 0x76EE))
$userCenterBackend = Join-Path (Join-Path (Join-Path $env:USERPROFILE $teamProjectDirName) "user-center") "backend"
$repos = @(
  @{ Name = "user-center"; Path = $userCenterBackend },
  @{ Name = "library"; Path = Join-Path $root "br-library-service" },
  @{ Name = "stats"; Path = Join-Path $root "br-event-stats" },
  @{ Name = "ai"; Path = Join-Path $root "br-ai-service" }
)

Info "running backend unit/integration tests"
foreach ($repo in $repos) {
  Info "mvn test: $($repo.Name)"
  Push-Location $repo.Path
  mvn test
  Pop-Location
}

Info "checking HTTP health"
Assert-Ok "user-center health" (Invoke-Json Get "http://localhost/api/health")
Assert-Ok "library health" (Invoke-Json Get "http://localhost:8082/api/health")
Assert-Ok "stats health" (Invoke-Json Get "http://localhost:8083/api/health")
Assert-Ok "ai health" (Invoke-Json Get "http://localhost:8084/api/health")

Info "running API smoke tests"

$login = Invoke-Json Post "http://localhost/api/user/login" @{
  userAccount = "root"
  userPassword = "12345678"
  loginType = "SmokeTest"
}
Assert-Ok "login root" $login
$userId = $login.data.user.id
if (-not $userId -or $userId -le 0) {
  throw "login did not return a valid user id"
}

$books = Invoke-Json Get "http://localhost:8082/api/books?q=%E8%A5%BF%E6%B8%B8&page=0&size=5"
Assert-Ok "search books" $books
$book = $books.data.items | Select-Object -First 1
if (-not $book) { throw "search returned no books" }

$detail = Invoke-Json Get "http://localhost:8082/api/books/$($book.id)"
Assert-Ok "book detail" $detail
$chapter = $detail.data.chapters | Select-Object -First 1
if (-not $chapter) { throw "book has no chapter" }

$chapterDetail = Invoke-Json Get "http://localhost:8082/api/chapters/$($chapter.id)"
Assert-Ok "chapter detail" $chapterDetail
$paragraph = $chapterDetail.data.paragraphs | Select-Object -First 1
if (-not $paragraph) { throw "chapter has no paragraph" }

$mark = Invoke-Json Post "http://localhost:8082/api/marks" @{
  userId = $userId
  bookId = $book.id
  chapterId = $chapter.id
  paragraphId = $paragraph.id
  paragraphSeq = $paragraph.seq
  markType = "note"
  note = "platform smoke test"
}
Assert-Ok "save note mark" $mark

$marks = Invoke-Json Get "http://localhost:8082/api/chapters/$($chapter.id)/marks?userId=$userId"
Assert-Ok "list marks" $marks
if (($marks.data | Where-Object { $_.paragraphId -eq $paragraph.id }).Count -eq 0) {
  throw "saved mark was not returned by list marks"
}

$comment = Invoke-Json Post "http://localhost:8082/api/comments" @{
  userId = $userId
  bookId = $book.id
  chapterId = $chapter.id
  paragraphId = $paragraph.id
  content = "platform smoke comment"
}
Assert-Ok "save paragraph comment" $comment

$liked = Invoke-Json Post "http://localhost:8082/api/comments/$($comment.data.id)/like?userId=$userId" $null
Assert-Ok "like paragraph comment" $liked
if ($liked.data.likeCount -lt 1) {
  throw "comment like count was not updated"
}

$interactions = Invoke-Json Get "http://localhost:8082/api/paragraphs/$($paragraph.id)/interactions?userId=$userId"
Assert-Ok "paragraph interactions" $interactions
if (($interactions.data.comments | Where-Object { $_.id -eq $comment.data.id }).Count -eq 0) {
  throw "saved comment was not returned by paragraph interactions"
}

$progress = Invoke-Json Post "http://localhost:8083/api/stats/progress" @{
  userId = $userId
  bookId = $book.id
  chapterId = $chapter.id
  paragraphIndex = 0
}
Assert-Ok "report reading progress" $progress

$summary = Invoke-Json Post "http://localhost:8084/api/ai/summary" @{
  chapterText = (($chapterDetail.data.paragraphs | Select-Object -First 3 | ForEach-Object { $_.content }) -join "`n")
}
Assert-Ok "ai summary" $summary

$ask = Invoke-Json Post "http://localhost:8084/api/ai/ask" @{
  bookId = $book.id
  chapterId = $chapter.id
  question = "这一章开头在讲什么?"
}
Assert-Ok "ai ask" $ask

Info "all platform tests passed"
