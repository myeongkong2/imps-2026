param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")),
  [string]$OutputDir = (Join-Path $PSScriptRoot "..\data\r_cv")
)

$ErrorActionPreference = "Stop"
$summarySource = Get-ChildItem -LiteralPath $ProjectRoot -Recurse -Filter "TAN_BN_10fold_summary.csv" | Select-Object -First 1
if (-not $summarySource) { throw "Could not locate TAN_BN_10fold_summary.csv" }
$resultDir = $summarySource.DirectoryName
$cases = @(Import-Csv (Join-Path $resultDir "netica_cases_discrete.csv"))
$predictions = @(Import-Csv (Join-Path $resultDir "TAN_BN_10fold_predictions.csv"))

if ($cases.Count -ne $predictions.Count) {
  throw "Case and prediction row counts differ."
}

$variables = @(
  "age_group", "sex", "physical_health", "cognitive_function",
  "psychological_condition", "social_resources",
  "socioeconomic_resources", "health_behavior"
)

$rows = for ($i = 0; $i -lt $cases.Count; $i++) {
  $row = [ordered]@{
    row_id = [int]$predictions[$i].row_id
    fold = [int]$predictions[$i].fold
    observed = $predictions[$i].observed
    probability_limited = [double]$predictions[$i].probability_limited
  }
  foreach ($variable in $variables) { $row[$variable] = $cases[$i].$variable }
  [pscustomobject]$row
}

function Get-Aggregate([object[]]$Subset) {
  $n = $Subset.Count
  if ($n -eq 0) {
    return [ordered]@{ n = 0; limited_n = 0; observed_limited = $null; mean_cv_probability = $null }
  }
  $limited = @($Subset | Where-Object observed -eq "limited").Count
  $meanProbability = ($Subset | Measure-Object probability_limited -Average).Average
  [ordered]@{
    n = $n
    limited_n = $limited
    observed_limited = $limited / $n
    mean_cv_probability = [double]$meanProbability
  }
}

function Get-Auc([object[]]$Subset) {
  $ordered = @($Subset | Sort-Object probability_limited)
  $positiveCount = @($ordered | Where-Object observed -eq "limited").Count
  $negativeCount = $ordered.Count - $positiveCount
  if ($positiveCount -eq 0 -or $negativeCount -eq 0) { return $null }

  $rankSum = 0.0
  $index = 0
  while ($index -lt $ordered.Count) {
    $end = $index
    while ($end + 1 -lt $ordered.Count -and [double]$ordered[$end + 1].probability_limited -eq [double]$ordered[$index].probability_limited) {
      $end++
    }
    $averageRank = (($index + 1) + ($end + 1)) / 2.0
    for ($j = $index; $j -le $end; $j++) {
      if ($ordered[$j].observed -eq "limited") { $rankSum += $averageRank }
    }
    $index = $end + 1
  }
  ($rankSum - ($positiveCount * ($positiveCount + 1) / 2.0)) / ($positiveCount * $negativeCount)
}

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

$stateResults = foreach ($variable in $variables) {
  foreach ($group in ($rows | Group-Object $variable)) {
    $aggregate = Get-Aggregate @($group.Group)
    [pscustomobject][ordered]@{
      variable = $variable
      state = $group.Name
      n = $aggregate.n
      limited_n = $aggregate.limited_n
      observed_limited = $aggregate.observed_limited
      mean_cv_probability = $aggregate.mean_cv_probability
    }
  }
}
$stateResults | Export-Csv (Join-Path $OutputDir "state_results.csv") -NoTypeInformation -Encoding utf8

$pairResults = for ($i = 0; $i -lt $variables.Count; $i++) {
  for ($j = $i + 1; $j -lt $variables.Count; $j++) {
    $variable1 = $variables[$i]
    $variable2 = $variables[$j]
    foreach ($group in ($rows | Group-Object $variable1, $variable2)) {
      $state1 = $group.Group[0].$variable1
      $state2 = $group.Group[0].$variable2
      $aggregate = Get-Aggregate @($group.Group)
      [pscustomobject][ordered]@{
        variable1 = $variable1
        state1 = $state1
        variable2 = $variable2
        state2 = $state2
        n = $aggregate.n
        limited_n = $aggregate.limited_n
        observed_limited = $aggregate.observed_limited
        mean_cv_probability = $aggregate.mean_cv_probability
      }
    }
  }
}
$pairResults | Export-Csv (Join-Path $OutputDir "pair_results.csv") -NoTypeInformation -Encoding utf8

$threshold = 0.174231825715066
$tp = @($rows | Where-Object { $_.observed -eq "limited" -and $_.probability_limited -ge $threshold }).Count
$fn = @($rows | Where-Object { $_.observed -eq "limited" -and $_.probability_limited -lt $threshold }).Count
$fp = @($rows | Where-Object { $_.observed -eq "independent" -and $_.probability_limited -ge $threshold }).Count
$tn = @($rows | Where-Object { $_.observed -eq "independent" -and $_.probability_limited -lt $threshold }).Count
$overall = Get-Aggregate $rows

$foldMetrics = foreach ($foldGroup in ($rows | Group-Object fold | Sort-Object { [int]$_.Name })) {
  $aggregate = Get-Aggregate @($foldGroup.Group)
  [pscustomobject][ordered]@{
    fold = [int]$foldGroup.Name
    n = $aggregate.n
    limited_n = $aggregate.limited_n
    observed_limited = $aggregate.observed_limited
    mean_cv_probability = $aggregate.mean_cv_probability
    auc = Get-Auc @($foldGroup.Group)
  }
}
$foldMetrics | Export-Csv (Join-Path $OutputDir "fold_metrics.csv") -NoTypeInformation -Encoding utf8

$sorted = @($rows | Sort-Object probability_limited)
$calibration = for ($bin = 0; $bin -lt 10; $bin++) {
  $start = [math]::Floor($bin * $sorted.Count / 10)
  $end = [math]::Floor(($bin + 1) * $sorted.Count / 10) - 1
  $subset = @($sorted[$start..$end])
  $aggregate = Get-Aggregate $subset
  [pscustomobject][ordered]@{
    decile = $bin + 1
    n = $aggregate.n
    observed_limited = $aggregate.observed_limited
    mean_cv_probability = $aggregate.mean_cv_probability
    min_probability = [double]$subset[0].probability_limited
    max_probability = [double]$subset[-1].probability_limited
  }
}
$calibration | Export-Csv (Join-Path $OutputDir "calibration_deciles.csv") -NoTypeInformation -Encoding utf8

$summary = [ordered]@{
  model = "TAN BN classifier"
  validation = "ordinary non-stratified 10-fold cross-validation"
  n = $overall.n
  limited_n = $overall.limited_n
  observed_limited = $overall.observed_limited
  mean_cv_probability = $overall.mean_cv_probability
  auc = Get-Auc $rows
  youden_threshold = $threshold
  sensitivity = $tp / ($tp + $fn)
  specificity = $tn / ($tn + $fp)
  accuracy = ($tp + $tn) / $rows.Count
  ppv = $tp / ($tp + $fp)
  npv = $tn / ($tn + $fn)
  confusion_matrix = [ordered]@{ tp = $tp; fn = $fn; fp = $fp; tn = $tn }
}
$summaryJson = $summary | ConvertTo-Json -Depth 5
[IO.File]::WriteAllText((Join-Path $OutputDir "summary.json"), $summaryJson, [Text.UTF8Encoding]::new($false))

Write-Host "Public aggregate summaries written to $OutputDir"
