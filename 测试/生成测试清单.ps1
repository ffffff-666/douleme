$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$worktreeRoot = Split-Path -Parent $scriptDir
$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $worktreeRoot '..\..'))
$assetsRoot = Join-Path $repoRoot '素材'
$outputPath = Join-Path $scriptDir 'test-cases.generated.js'

if (-not (Test-Path $assetsRoot)) {
  throw "未找到素材目录：$assetsRoot"
}

function Get-CaseCategory([string]$name) {
  if ($name -match 'logo|emoji|星星人|Kitty|维尼|豆包') { return 'iconic' }
  if ($name -match '动漫|卡通|芭蕾|旋转木马') { return 'cute-anime' }
  if ($name -match '人像|情侣|库里|名画') { return 'photo-reference' }
  return 'other'
}

function To-PosixRelative([string]$basePath, [string]$targetPath) {
  $baseUri = [System.Uri]((Resolve-Path $basePath).Path + [System.IO.Path]::DirectorySeparatorChar)
  $targetUri = [System.Uri](Resolve-Path $targetPath).Path
  return [System.Uri]::UnescapeDataString($baseUri.MakeRelativeUri($targetUri).ToString())
}

$cases = @()
Get-ChildItem -Path $assetsRoot -Recurse -Directory | ForEach-Object {
  $dir = $_.FullName
  $original = @(
    (Join-Path $dir '原图.png'),
    (Join-Path $dir '原图.jpg'),
    (Join-Path $dir '原图.jpeg'),
    (Join-Path $dir '原图.webp')
  ) | Where-Object { Test-Path $_ } | Select-Object -First 1
  $target = @(
    (Join-Path $dir '拼豆图纸.png'),
    (Join-Path $dir '拼豆图纸.jpg'),
    (Join-Path $dir '拼豆图纸.jpeg'),
    (Join-Path $dir '拼豆图纸.webp')
  ) | Where-Object { Test-Path $_ } | Select-Object -First 1
  if (-not $original -or -not $target) { return }
  $name = Split-Path $dir -Leaf
  $id = ($name -replace '[^0-9A-Za-z一-龥]+', '-').Trim('-')
  if ([string]::IsNullOrWhiteSpace($id)) { $id = "case-$($cases.Count + 1)" }
  $cases += [ordered]@{
    id = $id
    name = $name
    category = Get-CaseCategory $name
    originalUrl = To-PosixRelative $scriptDir $original
    targetUrl = To-PosixRelative $scriptDir $target
  }
}

$json = $cases | ConvertTo-Json -Depth 5
$content = @"
window.GOD_DOU_TEST_CASES = $json;
"@
Set-Content -Path $outputPath -Value $content -Encoding UTF8
Write-Output "已生成测试清单：$outputPath"
Write-Output "样本数：$($cases.Count)"
