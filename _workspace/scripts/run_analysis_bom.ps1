$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
try {
    $wb = $excel.Workbooks.Open("C:\Users\FAMILY\Desktop\2026 아이비 _(0) (49).xlsx")
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
        
        $is_bulk = ($name -match '3개|5개|6개|12개|50개')
        
        $aov = if ($orders -gt 0) { $revenue / $orders } else { 0 }
        
        $data += [PSCustomObject]@{
            Name = $name
            IsBulk = $is_bulk
            CVR = $cvr
            Revenue = $revenue
            Orders = $orders
            Traffic = $traffic
            AOV = $aov
        }
    }

    $wb.Close($false)
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}

$bulk_items = $data | Where-Object { $_.IsBulk }
$single_items = $data | Where-Object { -not $_.IsBulk }

$bulk_cvr = if ($bulk_items) { ($bulk_items | Measure-Object -Property CVR -Average).Average } else { 0 }
$single_cvr = if ($single_items) { ($single_items | Measure-Object -Property CVR -Average).Average } else { 0 }

$output = "--- 아이비 데이터 분석 결과 (푸단테 로직 적용) ---`r`n`r`n"
$output += "💡 [핵심 가설 검증] 대용량 vs 소량 상품 CVR 비교`r`n"
$output += " - 대용량(3개 이상 묶음) 평균 전환율: {0:N2}%`r`n" -f $bulk_cvr
$output += " - 소량(1~2개 낱개) 평균 전환율: {0:N2}%`r`n`r`n" -f $single_cvr

if ($bulk_cvr -gt $single_cvr) {
    $output += " ➔ 결론: 아이비 고객 역시 대용량 구매를 선호합니다. 대용량 묶음 상품에 마케팅 예산을 집중하세요.`r`n`r`n"
} else {
    $output += " ➔ 결론: 소량 단품의 전환율이 더 높습니다. 단품 위주로 마케팅 예산을 재편하세요.`r`n`r`n"
}

$output += "💰 [탑 트래픽 캐시카우 효율 검증 (조회수 기준 Top 3)]`r`n"
$top_traffic = $data | Sort-Object -Property Traffic -Descending | Select-Object -First 3
foreach ($item in $top_traffic) {
    $output += "상품명: $($item.Name)`r`n"
    $output += " ➔ 조회수: $($item.Traffic) | CVR: $($item.CVR)% | 매출: {0:N0}원 | 1건당 객단가: {1:N0}원`r`n`r`n" -f $item.Revenue, $item.AOV
}

$output | Out-File -FilePath "d:\NATAS Harnes-menu\_workspace\scripts\ivy_result.md" -Encoding UTF8
