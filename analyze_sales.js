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
})).filter(r => r.optionId !== undefined);

let totalSales = 0;
let totalOrders = 0;
let totalVisitors = 0;
let totalViews = 0;
let totalSalesQty = 0;

data.forEach(r => {
    totalSales += r.sales;
    totalOrders += r.orders;
    totalVisitors += r.visitors;
    totalViews += r.views;
    totalSalesQty += r.salesQty;
});

const overallCvr = totalVisitors > 0 ? (totalOrders / totalVisitors * 100).toFixed(2) : 0;

const sortedBySales = [...data].sort((a, b) => b.sales - a.sales).slice(0, 10);
const sortedByOrders = [...data].sort((a, b) => b.orders - a.orders).slice(0, 10);
const sortedByCvr = [...data].filter(a => a.visitors > 50).sort((a, b) => b.cvr - a.cvr).slice(0, 10);
const sortedByLost = [...data].filter(a => a.sales === 0 && a.visitors > 0).sort((a, b) => b.visitors - a.visitors).slice(0, 10);

const result = {
    summary: {
        totalItems: data.length,
        totalSales,
        totalOrders,
        totalSalesQty,
        totalVisitors,
        totalViews,
        overallCvr
    },
    topSales: sortedBySales,
    topOrders: sortedByOrders,
    topCvr: sortedByCvr,
    highTrafficZeroSales: sortedByLost
};

fs.writeFileSync("sales_analysis_result_55.json", JSON.stringify(result, null, 2));
console.log("Analysis saved to sales_analysis_result_55.json");
