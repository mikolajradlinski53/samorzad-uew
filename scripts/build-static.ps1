# Builds a static export by stubbing out features unsupported with output: export:
#   app/api/                     — Route Handlers
#   strefa-dzialacza/*.tsx       — Server Actions + auth (stubbed with empty page)
#   middleware.ts                — Middleware
# All originals are restored in the finally block regardless of outcome.

$projectRoot = (Get-Item $PSScriptRoot).Parent.FullName
$enc = [System.Text.Encoding]::UTF8
$stub = "export default function Page() { return null }`n"

# Dirs to move entirely (api works fine via .NET Move)
$dirsToMove = @(
  @{ src = Join-Path $projectRoot "app\api"; bak = Join-Path $env:TEMP ("ssuew_api_" + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()) }
)

# Files to stub (rename .tsx → .tsx.bak, write empty stub in place)
$strefaBase = Join-Path $projectRoot "app\(public)\strefa-dzialacza"
$filesToStub = @(
  Join-Path $strefaBase "page.tsx"
  Join-Path $strefaBase "dashboard\page.tsx"
  Join-Path $strefaBase "lista-obecnosci\page.tsx"
)

# Single files to move (middleware)
$filesToMove = @(
  @{ src = Join-Path $projectRoot "middleware.ts"; bak = Join-Path $env:TEMP ("ssuew_mw_" + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds() + ".ts") }
)

$movedDirs   = @{}
$movedFiles  = @{}
$stubbedFiles = @()

try {
  # Move api directory
  foreach ($item in $dirsToMove) {
    if (Test-Path -LiteralPath $item.src) {
      [System.IO.Directory]::Move($item.src, $item.bak)
      $movedDirs[$item.src] = $item.bak
      Write-Host ("→ hidden dir: " + (Split-Path $item.src -Leaf))
    }
  }

  # Move single files
  foreach ($item in $filesToMove) {
    if (Test-Path -LiteralPath $item.src) {
      [System.IO.File]::Move($item.src, $item.bak)
      $movedFiles[$item.src] = $item.bak
      Write-Host ("→ hidden file: " + (Split-Path $item.src -Leaf))
    }
  }

  # Stub strefa-dzialacza pages
  foreach ($f in $filesToStub) {
    if (Test-Path -LiteralPath $f) {
      $bak = $f + ".bak"
      [System.IO.File]::Move($f, $bak)
      [System.IO.File]::WriteAllText($f, $stub, $enc)
      $stubbedFiles += $f
      Write-Host ("→ stubbed: " + (Split-Path $f -Leaf) + " in " + (Split-Path $f -Parent | Split-Path -Leaf))
    }
  }

  $env:NEXT_STATIC_EXPORT = "true"
  npm run build
  if ($LASTEXITCODE -ne 0) { throw "Build failed with exit code $LASTEXITCODE" }
  Write-Host "`n✓ Static export complete — files are in ./out`n"
} finally {
  $env:NEXT_STATIC_EXPORT = ""

  # Restore stubbed pages
  foreach ($f in $stubbedFiles) {
    $bak = $f + ".bak"
    if (Test-Path -LiteralPath $bak) {
      if (Test-Path -LiteralPath $f) { Remove-Item -LiteralPath $f -Force }
      [System.IO.File]::Move($bak, $f)
      Write-Host ("→ restored: " + (Split-Path $f -Leaf))
    }
  }

  # Restore single files
  foreach ($src in $movedFiles.Keys) {
    $bak = $movedFiles[$src]
    if (Test-Path -LiteralPath $bak) {
      if (-not (Test-Path -LiteralPath $src)) {
        [System.IO.File]::Move($bak, $src)
        Write-Host ("→ restored: " + (Split-Path $src -Leaf))
      }
    }
  }

  # Restore dirs
  foreach ($src in $movedDirs.Keys) {
    $bak = $movedDirs[$src]
    if (Test-Path -LiteralPath $bak) {
      if (-not (Test-Path -LiteralPath $src)) {
        [System.IO.Directory]::Move($bak, $src)
        Write-Host ("→ restored dir: " + (Split-Path $src -Leaf))
      } else {
        Remove-Item -LiteralPath $bak -Recurse -Force
      }
    }
  }
}
