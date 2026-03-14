param(
  [Parameter(Mandatory = $true)]
  [string]$InputPath,

  [Parameter(Mandatory = $true)]
  [string]$OutputPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.IO.Compression.FileSystem

function Get-EntryText {
  param(
    [Parameter(Mandatory = $true)]
    [System.IO.Compression.ZipArchive]$Zip,

    [Parameter(Mandatory = $true)]
    [string]$Name
  )

  $entry = $Zip.Entries | Where-Object { $_.FullName -eq $Name }
  if (-not $entry) {
    return $null
  }

  $reader = New-Object System.IO.StreamReader($entry.Open())
  try {
    return $reader.ReadToEnd()
  } finally {
    $reader.Close()
  }
}

function Get-CellValue {
  param(
    [Parameter(Mandatory = $true)]
    $Cell,

    [Parameter(Mandatory = $true)]
    [string[]]$SharedStrings
  )

  $cellType = ""
  if ($Cell.PSObject.Properties["t"]) {
    $cellType = [string]$Cell.t
  }

  $cellValue = $null
  if ($Cell.PSObject.Properties["v"]) {
    $cellValue = $Cell.v
  }

  if ($cellType -eq "s" -and $cellValue) {
    $index = [int]$Cell.v
    if ($index -lt $SharedStrings.Count) {
      return [string]$SharedStrings[$index]
    }
  }

  if ($Cell.PSObject.Properties["is"] -and $Cell.is -and $Cell.is.t) {
    return [string]$Cell.is.t
  }

  if ($cellValue) {
    return [string]$cellValue
  }

  return ""
}

function Get-ColumnIndex {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Reference
  )

  $letters = ($Reference -replace "[^A-Z]", "")
  $index = 0
  foreach ($char in $letters.ToCharArray()) {
    $index = ($index * 26) + ([int][char]$char - [int][char]'A' + 1)
  }
  return $index
}

function Convert-WorksheetToObjects {
  param(
    [Parameter(Mandatory = $true)]
    [xml]$SheetXml,

    [Parameter(Mandatory = $true)]
    [string[]]$SharedStrings
  )

  $rows = @($SheetXml.worksheet.sheetData.row)
  if ($rows.Count -eq 0) {
    return @()
  }

  $headerMap = @{}
  foreach ($cell in @($rows[0].c)) {
    $headerMap[(Get-ColumnIndex $cell.r)] = Get-CellValue -Cell $cell -SharedStrings $SharedStrings
  }

  $headers = @{}
  foreach ($key in $headerMap.Keys) {
    $headers[$key] = [string]$headerMap[$key]
  }

  $objects = @()
  foreach ($row in $rows | Select-Object -Skip 1) {
    $obj = [ordered]@{}
    foreach ($columnIndex in $headers.Keys | Sort-Object) {
      $obj[$headers[$columnIndex]] = ""
    }

    foreach ($cell in @($row.c)) {
      $columnIndex = Get-ColumnIndex $cell.r
      if ($headers.ContainsKey($columnIndex)) {
        $obj[$headers[$columnIndex]] = Get-CellValue -Cell $cell -SharedStrings $SharedStrings
      }
    }

    if ($obj["name"]) {
      $objects += [pscustomobject]$obj
    }
  }

  return $objects
}

$zip = [System.IO.Compression.ZipFile]::OpenRead($InputPath)
try {
  [xml]$workbookXml = Get-EntryText -Zip $zip -Name "xl/workbook.xml"
  [xml]$relsXml = Get-EntryText -Zip $zip -Name "xl/_rels/workbook.xml.rels"
  [xml]$sharedXml = Get-EntryText -Zip $zip -Name "xl/sharedStrings.xml"

  $sharedStrings = @()
  if ($sharedXml -and $sharedXml.sst.si) {
    foreach ($item in @($sharedXml.sst.si)) {
      if ($item.t) {
        $sharedStrings += [string]$item.t
      } elseif ($item.r) {
        $parts = @()
        foreach ($run in @($item.r)) {
          if ($run.t) {
            $parts += [string]$run.t
          }
        }
        $sharedStrings += ($parts -join "")
      } else {
        $sharedStrings += ""
      }
    }
  }

  $sheet = @($workbookXml.workbook.sheets.sheet)[0]
  $relationshipId = $sheet.GetAttribute("id", "http://schemas.openxmlformats.org/officeDocument/2006/relationships")
  $target = (@($relsXml.Relationships.Relationship) | Where-Object { $_.Id -eq $relationshipId }).Target
  [xml]$sheetXml = Get-EntryText -Zip $zip -Name ("xl/" + $target)

  $objects = Convert-WorksheetToObjects -SheetXml $sheetXml -SharedStrings $sharedStrings
  $json = $objects | ConvertTo-Json -Depth 6

  $parent = Split-Path -Parent $OutputPath
  if ($parent) {
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
  }

  Set-Content -Path $OutputPath -Value $json -Encoding UTF8
  Write-Output ("Imported " + $objects.Count + " rows to " + $OutputPath)
} finally {
  $zip.Dispose()
}
