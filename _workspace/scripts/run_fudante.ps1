$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
try {
    $wb = $excel.Workbooks.Open("C:\Users\FAMILY\Desktop\푸단테 7.4~6일.xlsx", [Type]::Missing, $true)
    $ws = $wb.Sheets.Item(1)

    $lastRow = $ws.Cells.SpecialCells(11).Row

    $data = @()
    for ($i = 2; $i -le $lastRow; $i++) {
        $optionName = $ws.Cells.Item($i, 2).Text
        $productName = $ws.Cells.Item($i, 3).Text
        
        $name = if ([string]::IsNullOrWhiteSpace($optionName)) { $productName } else { $optionName }
        if ([string]::IsNullOrWhiteSpace($name)) { continue }
        
        $revenueVal = $ws.Cells.Item($i, 7).Value2
        $ordersVal = $ws.Cells.Item($i, 8).Value2
        $trafficVal = $ws.Cells.Item($i, 11).Value2
        $cvr_text = $ws.Cells.Item($i, 13).Text
        
        $cvr = 0.0
        if ($cvr_text -match "([\d\.]+)") {
            $cvr = [double]$matches[1]
        }
        
        $revenue = if ($revenueVal) { [double]$revenueVal } else { 0 }
        $orders = if ($ordersVal) { [double]$ordersVal } else { 0 }
        $traffic = if ($trafficVal) { [double]$trafficVal } else { 0 }
        
        $is_bulk = ($name -match '3|4|5|6|7|8|9|10|12|50')
        
        $data += [PSCustomObject]@{
            Name = $name
            IsBulk = $is_bulk
            CVR = $cvr
            Revenue = $revenue
            Orders = $orders
            Traffic = $traffic
        }
    }

    # Output Cash Cows
    Write-Output "=== CASH_COW ==="
    $cashCows = $data | Where-Object { $_.Revenue -gt 0 } | Sort-Object Revenue -Descending | Select-Object -First 3
    foreach ($item in $cashCows) {
        Write-Output "- $($item.Name) : REV $($item.Revenue) / CVR $($item.CVR)% / TRF $($item.Traffic)"
    }

    # Output Black Holes
    Write-Output "
=== BLACK_HOLE ==="
    $blackHoles = $data | Where-Object { $_.Traffic -gt 5 -and $_.Orders -eq 0 } | Sort-Object Traffic -Descending | Select-Object -First 3
    foreach ($item in $blackHoles) {
        Write-Output "- $($item.Name) : TRF $($item.Traffic) / CVR 0%"
    }

    # Hidden Gems
    Write-Output "
=== HIDDEN_GEM ==="
    $hiddenGems = $data | Where-Object { $_.Traffic -gt 2 -and $_.Traffic -lt 30 -and $_.CVR -ge 5 } | Sort-Object CVR -Descending | Select-Object -First 3
    foreach ($item in $hiddenGems) {
        Write-Output "- $($item.Name) : CVR $($item.CVR)% / TRF $($item.Traffic) / REV $($item.Revenue)"
    }

    # Bulk vs Single
    $active = $data | Where-Object { $_.Traffic -gt 0 }
    $bulk = $active | Where-Object { $_.IsBulk -eq $true }
    $single = $active | Where-Object { $_.IsBulk -eq $false }

    $bulkAvgCvr = if ($bulk.Count -gt 0) { ($bulk | Measure-Object CVR -Average).Average } else { 0 }
    $singleAvgCvr = if ($single.Count -gt 0) { ($single | Measure-Object CVR -Average).Average } else { 0 }

    Write-Output "
=== BULK_VS_SINGLE ==="
    Write-Output "- BULK CVR: $($bulkAvgCvr)%"
    Write-Output "- SINGLE CVR: $($singleAvgCvr)%"

} finally {
    $wb.Close($false)
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($ws) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($wb) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}