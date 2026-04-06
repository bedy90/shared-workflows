param (
    [string]$latestTag = ""
)

# Identification de la plage de commits
if ([string]::IsNullOrWhiteSpace($latestTag)) {
    try {
        $latestTag = git describe --tags --abbrev=0 2>$null
    } catch {
        $latestTag = $null
    }
}

if ($null -eq $latestTag -or $latestTag -eq "") {
    $revRange = "HEAD"
    Write-Host "ℹ️ Aucun tag trouvé, démarrage depuis l'origine."
} else {
    $revRange = "$latestTag..HEAD"
    Write-Host "🔎 Analyse des changements depuis le tag : $latestTag"
}

# Extraction des commits et génération du Markdown
$techDetails = "`n`n### 🛠️ Détails Techniques`n"
$workItems = @()
$commitList = ""

$gitLogs = git log $revRange --pretty=format:"%h - %s"
if ($null -eq $gitLogs -or $gitLogs.Count -eq 0) {
    Write-Host "⚠️ Aucun commit trouvé dans la plage spécifiée."
    exit 0
}

foreach ($line in $gitLogs) {
    $commitList += "- $line`n"
    # Extraction des WorkItems (#12345)
    if ($line -match "#(\d+)") {
        $workItems += $matches[0]
    }
}

if ($workItems.Count -gt 0) {
    $uniqueWorkItems = $workItems | Select-Object -Unique
    $techDetails += "#### 🔗 WorkItems`n" + ($uniqueWorkItems -join ", ") + "`n"
}

$techDetails += "`n#### 📜 Liste des Commits`n" + $commitList

# Export pour GitHub Actions (multiline support)
$EOF = [System.Guid]::NewGuid().ToString()
"TECH_DETAILS<<$EOF" >> $env:GITHUB_OUTPUT
$techDetails >> $env:GITHUB_OUTPUT
"$EOF" >> $env:GITHUB_OUTPUT

Write-Host "✅ Patchnote généré avec succès."
