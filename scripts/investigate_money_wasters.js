const ExcelJS = require('exceljs');
const path = "c:\\Users\\FAMILY\\Downloads\\A01262558_pa_total_campaign_20260601_20260630.xlsx";

async function investigate() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path);
  const sheet = workbook.worksheets[0];
  
  const data = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const vals = row.values;
    data.push({
      productName: String(vals[7] || ''),
      optionId: String(vals[8] || ''),
      impressions: Number(vals[13]) || 0,
      clicks: Number(vals[14]) || 0,
      spend: Number(vals[15]) || 0,
      orders: Number(vals[26]) || 0,
      revenue: Number(vals[32]) || 0,
    });
  });

  const prodMap = {};
  data.forEach(d => {
    const key = d.productName;
    if (!prodMap[key]) {
      prodMap[key] = { name: d.productName, optionId: d.optionId, imp: 0, clicks: 0, spend: 0, orders: 0, rev: 0 };
    }
    prodMap[key].imp += d.impressions;
    prodMap[key].clicks += d.clicks;
    prodMap[key].spend += d.spend;
    prodMap[key].orders += d.orders;
    prodMap[key].rev += d.revenue;
  });

  const prodList = Object.values(prodMap).map(p => {
    p.ctr = p.imp > 0 ? (p.clicks / p.imp) * 100 : 0;
    p.cvr = p.clicks > 0 ? (p.orders / p.clicks) * 100 : 0;
    p.roas = p.spend > 0 ? (p.rev / p.spend) * 100 : 0;
    return p;
  });

  // Get Money Wasters
  const moneyWasters = [...prodList].filter(p => p.roas < 100 && p.spend > 5000).sort((a,b) => b.spend - a.spend);
  
  console.log("=== 돈만 쓰는 상품 (Money Wasters) Top 10 ===");
  moneyWasters.slice(0, 10).forEach(p => {
    console.log(`[${p.optionId}] ${p.name.substring(0, 50)}... | 광고비:${p.spend} | 매출:${p.rev} | ROAS:${p.roas.toFixed(0)}%`);
  });

  // Get Top Winners for comparison
  const winners = [...prodList].filter(p => p.roas > 300).sort((a,b) => b.rev - a.rev);
  console.log("\n=== 돈 잘 버는 상품 (Winners) Top 5 (비교용) ===");
  winners.slice(0, 5).forEach(p => {
    console.log(`[${p.optionId}] ${p.name.substring(0, 50)}... | 광고비:${p.spend} | 매출:${p.rev} | ROAS:${p.roas.toFixed(0)}%`);
  });

}

investigate().catch(console.error);
