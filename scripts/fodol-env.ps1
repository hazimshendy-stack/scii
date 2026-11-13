# =============================================================================
# FODOL — local run environment
# =============================================================================
# Dot-source this before running the server or the ingest CLI:
#
#     . .\scripts\fodol-env.ps1
#     cd server; npm start
#
# It pins the two external tool paths and generates development secrets on
# first run. DEVELOPMENT ONLY — production secrets must come from the real
# environment, never from a file in the repository.
# =============================================================================

$repoRoot = Split-Path -Parent $PSScriptRoot

# Refresh PATH so newly installed tools (ImageMagick) resolve in this shell.
$env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
            [Environment]::GetEnvironmentVariable("Path", "User")

# --- External tools ---------------------------------------------------------
$mutool = Join-Path $repoRoot ".tools\mupdf\mupdf-1.26.0-windows\mutool.exe"
if (Test-Path $mutool) {
    $env:FODOL_MUTOOL_PATH = $mutool
    Write-Host "[fodol] mutool      : $mutool" -ForegroundColor DarkGray
} else {
    Write-Warning "[fodol] mutool not found at $mutool — ingest will be unavailable."
}

$magick = Get-Command magick -ErrorAction SilentlyContinue
if ($magick) {
    $env:FODOL_IMAGE_TOOL = $magick.Source
    Write-Host "[fodol] imagemagick : $($magick.Source)" -ForegroundColor DarkGray
} else {
    Write-Warning "[fodol] ImageMagick not found on PATH — watermarking will be unavailable."
}

# --- Development secrets ----------------------------------------------------
# Generated once into .dev-secrets.env (gitignored) and reused, so sessions
# and watermark placements stay stable across restarts during development.
$secretFile = Join-Path $repoRoot ".dev-secrets.env"

if (-not (Test-Path $secretFile)) {
    Write-Host "[fodol] generating development secrets..." -ForegroundColor DarkGray
    $lines = @(
        "# Auto-generated development secrets. NEVER use these in production.",
        "FODOL_GRANT_SIGNING_KEY=$([Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(48)).Replace('+','-').Replace('/','_').TrimEnd('='))",
        "FODOL_SESSION_SIGNING_KEY=$([Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(48)).Replace('+','-').Replace('/','_').TrimEnd('='))",
        "FODOL_WATERMARK_KEY=$([Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(48)).Replace('+','-').Replace('/','_').TrimEnd('='))",
        "FODOL_IP_HASH_KEY=$([Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(48)).Replace('+','-').Replace('/','_').TrimEnd('='))",
        "FODOL_ADMIN_TOKEN=$([Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32)).Replace('+','-').Replace('/','_').TrimEnd('='))"
    )
    Set-Content -Path $secretFile -Value $lines -Encoding UTF8
}

foreach ($line in Get-Content $secretFile) {
    if ($line -match '^\s*#' -or $line -notmatch '=') { continue }
    $parts = $line.Split('=', 2)
    [Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim(), 'Process')
}

# --- Server configuration ---------------------------------------------------
if (-not $env:FODOL_PORT) { $env:FODOL_PORT = "8787" }
if (-not $env:FODOL_STORAGE_ROOT) { $env:FODOL_STORAGE_ROOT = Join-Path $repoRoot "private-storage" }
if (-not $env:FODOL_ALLOWED_ORIGINS) {
    $env:FODOL_ALLOWED_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:8787,http://127.0.0.1:8787"
}
if (-not $env:NODE_ENV) { $env:NODE_ENV = "development" }

Write-Host "[fodol] storage     : $env:FODOL_STORAGE_ROOT" -ForegroundColor DarkGray
Write-Host "[fodol] admin token : $env:FODOL_ADMIN_TOKEN" -ForegroundColor DarkGray
Write-Host "[fodol] port        : $env:FODOL_PORT" -ForegroundColor DarkGray
Write-Host "[fodol] environment ready." -ForegroundColor Green
