$ErrorActionPreference = 'Stop'
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { throw 'GitHub CLI (gh) is required.' }
gh auth status
if ($LASTEXITCODE -ne 0) { throw 'Run gh auth login before configuring branch protection.' }

$repositories = @{
    'wohuishuo/book-realm' = 'specifications'
    'wohuishuo/user-center-team-project' = 'verify'
    'wohuishuo/br-library-service' = 'verify'
    'wohuishuo/br-event-stats' = 'verify'
    'wohuishuo/br-ai-service' = 'verify'
    'wohuishuo/br-reader-app' = 'verify'
}

foreach ($entry in $repositories.GetEnumerator()) {
    $body = @{
        required_status_checks = @{ strict = $true; contexts = @($entry.Value) }
        enforce_admins = $true
        required_pull_request_reviews = @{
            dismiss_stale_reviews = $true
            require_code_owner_reviews = $false
            required_approving_review_count = 0
        }
        restrictions = $null
        required_conversation_resolution = $true
    } | ConvertTo-Json -Depth 6
    $tempFile = [System.IO.Path]::GetTempFileName()
    try {
        [System.IO.File]::WriteAllText(
            $tempFile,
            $body,
            [System.Text.UTF8Encoding]::new($false)
        )
        gh api --method PUT -H 'Accept: application/vnd.github+json' "repos/$($entry.Key)/branches/main/protection" --input $tempFile
        if ($LASTEXITCODE -ne 0) { throw "Failed to protect $($entry.Key)" }
    }
    finally {
        Remove-Item -LiteralPath $tempFile -Force -ErrorAction SilentlyContinue
    }
    Write-Host "Protected $($entry.Key): $($entry.Value) required."
}
