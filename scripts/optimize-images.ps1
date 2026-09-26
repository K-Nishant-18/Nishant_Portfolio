# Optimize the public image assets into lean WebP files.
# Reusable: run again anytime new source PNGs are dropped into /public.
#
# Usage (PowerShell):
#   ./scripts/optimize-images.ps1
#
# Requires ImageMagick 7 (magick) on PATH or set MAGICK env to the binary.
#
# Outputs are written next to the sources and referenced by the app code,
# so the originals can be deleted from /public once verified.

$ErrorActionPreference = 'Stop'

$magick = if ($env:MAGICK) { $env:MAGICK } else { 'magick' }
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

# Skip already-converted files (compare by timestamp).
function Convert-Optimized {
    param([string]$Src, [string]$Dst, [string]$Resize, [string]$Quality = '82')

    if (-not (Test-Path -LiteralPath $Src)) {
        Write-Warning "Missing source: $Src"
        return
    }
    if ((Test-Path -LiteralPath $Dst) -and (Get-Item -LiteralPath $Dst).LastWriteTime -ge (Get-Item -LiteralPath $Src).LastWriteTime) {
        Write-Output "skip  $Dst"
        return
    }
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Dst) | Out-Null
    & $magick $Src -auto-orient -strip -filter Lanczos -resize $Resize -quality $Quality $Dst 2>&1 | Out-Null
    $kb = [math]::Round((Get-Item -LiteralPath $Dst).Length / 1KB, 1)
    Write-Output ("webp  {0,8} KB  {1}" -f $kb, $Dst)
}

$projectImages = @(
    @{ Name = 'collegia';   Src = 'public/collegiaMockup.png' },
    @{ Name = 'cultural';   Src = 'public/cultural.png' },
    @{ Name = '0xkid';      Src = 'public/0xkidMockup.png' },
    @{ Name = 'skillbloom'; Src = 'public/skillbloom.png' },
    @{ Name = 'portfolio';  Src = 'public/portfolio.png' }
)

# 1. Project covers: 1920w detail hero + 320w index thumbnail
foreach ($p in $projectImages) {
    Convert-Optimized -Src $p.Src -Dst "public/projects/$($p.Name).webp" -Resize '1920x' -Quality '82'
    Convert-Optimized -Src $p.Src -Dst "public/projects/$($p.Name)-thumb.webp" -Resize '320x' -Quality '80'
}

# 2. About image-trail gallery (rendered ~96x160css px -> 320w plenty)
1..10 | ForEach-Object {
    Convert-Optimized -Src "public/images/$_.png" -Dst "public/images/$_.webp" -Resize '320x' -Quality '80'
}

# 3. Hero photos (rendered ~20-25vw, shown twice on page)
Convert-Optimized -Src 'public/Hero-1.png' -Dst 'public/Hero-1.webp' -Resize '1200x' -Quality '80'
Convert-Optimized -Src 'public/Hero-2.png' -Dst 'public/Hero-2.webp' -Resize '1200x' -Quality '80'

Write-Output 'done'