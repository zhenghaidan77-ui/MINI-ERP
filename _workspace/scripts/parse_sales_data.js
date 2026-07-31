const ExcelJS = require('exceljs');
const path = "c:\\Users\\FAMILY\\Downloads\\SELLER_INSIGHTS_VENDOR_ITEM_METRICS_(0) (51).xlsx";

async function analyze() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path);
  const sheet = workbook.worksheets[0];
  
  const data = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const vals = row.values;
    data.push({
      productName: String(vals[3] || ''),
      revenue: Number(vals[7]) || 0,
      salesCnt: Number(vals[9]) || 0,
      visitors: Number(vals[10]) || 0,
      views: Number(vals[11]) || 0,
      cvr: parseFloat(String(vals[13]).replace('%','')) || 0
    });
  });

  const sortedRev = [...data].sort((a,b) => b.revenue - a.revenue);
  const sortedVisitors = [...data].sort((a,b) => b.visitors - a.visitors);

  console.log("=== 탑 매출 (Top Revenue) ===");
  sortedRev.slice(0, 10).forEach(p => {
    if(p.revenue > 0 || p.visitors > 0)
      console.log(`${p.productName.substring(0, 30)}... | 매출:${p.revenue} | 방문자:${p.visitors} | CVR:${p.cvr}%`);
  });

  console.log("\n=== 탑 유입 (Top Visitors) ===");
  sortedVisitors.slice(0, 10).forEach(p => {
    if(p.visitors > 0)
      console.log(`${p.productName.substring(0, 30)}... | 방분자:${p.visitors} | 매출:${p.revenue} | CVR:${p.cvr}%`);
  });
}
analyze().catch(console.error);
