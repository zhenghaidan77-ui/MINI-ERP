const xlsx = require('xlsx');
const fs = require('fs');

const filePath = "c:\\Users\\FAMILY\\Downloads\\SELLER_INSIGHTS_VENDOR_ITEM_METRICS_(0) (55).xlsx";
const workbook = xlsx.readFile(filePath);
const sheet = workbook.Sheets['vendor item metrics'];
const rawData = xlsx.utils.sheet_to_json(sheet);

function cleanNumber(val) {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
        let numStr = val.replace(/,/g, '').replace(/%/g, '');
        return Number(numStr) || 0;
    }
    return 0;
}

const data = rawData.map(row => ({
    optionId: row['옵션 ID'],
    optionName: row['옵션명'],
    productName: row['상품명'],
    sales: cleanNumber(row['매출(원)']),
    orders: cleanNumber(row['주문']),
    salesQty: cleanNumber(row['판매량']),
    visitors: cleanNumber(row['방문자']),
    views: cleanNumber(row['조회']),
    cart: cleanNumber(row['장바구니']),
    cvr: cleanNumber(row['구매전환율']),
    itemWinnerRate: cleanNumber(row['아이템위너 비율(%)'])
})).filter(r => r.optionId !== undefined && r.sales >= 0);

// Sort all by sales descending
data.sort((a, b) => b.sales - a.sales);

// 1. Mid-Tier (Ranks 11 to 30) - Next Cash Cows
const midTier = data.slice(10, 30);

// 2. High Traffic, Low CVR (Visitors > 1000, CVR < 3%)
const highTrafficLowCvr = data.filter(r => r.visitors >= 1000 && r.cvr > 0 && r.cvr < 3.0);

// 3. Low Traffic, High CVR (Hidden Gems: Visitors between 100 and 1000, CVR > 10%)
const hiddenGems = data.filter(r => r.visitors >= 100 && r.visitors <= 1000 && r.cvr >= 10.0);

// 4. Buy Box Bleeders (Sales > 1,000,000 AND Winner Rate < 80%)
const buyBoxBleeders = data.filter(r => r.sales >= 1000000 && r.itemWinnerRate < 80);

const result = {
    midTier,
    highTrafficLowCvr,
    hiddenGems,
    buyBoxBleeders
};

fs.writeFileSync("detailed_analysis_result.json", JSON.stringify(result, null, 2));
console.log("Detailed analysis saved to detailed_analysis_result.json");
