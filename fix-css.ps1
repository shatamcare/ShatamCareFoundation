# PowerShell script to fix the corrupted CSS file
$cssPath = "src/index.css"
$content = Get-Content $cssPath -Raw

# Find the last proper closing brace before any corruption
$lines = Get-Content $cssPath
$cleanLines = @()
$foundHighContrastSection = $false

foreach ($line in $lines) {
    if ($line -match "High contrast mode support") {
        $foundHighContrastSection = $true
    }
    
    if ($foundHighContrastSection -and $line -match "^\s*}\s*$" -and -not ($line -match "File touched")) {
        $cleanLines += $line
        break  # Stop here, this should be the final closing brace
    } else {
        $cleanLines += $line
    }
}

# Write the clean content back
Set-Content $cssPath -Value $cleanLines
Write-Host "CSS file cleaned successfully"
