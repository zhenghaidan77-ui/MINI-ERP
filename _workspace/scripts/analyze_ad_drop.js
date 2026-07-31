const ExcelJS = require('exceljs');
const path = "c:\\Users\\FAMILY\\Downloads\\A00823658_pa_total_campaign_20260721_20260722.xlsx";

async function analyze() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path);
  const sheet = workbook.worksheets[0];
  
  let totalImp = 0, totalClicks = 0, totalSpend = 0, totalOrders = 0, totalRev = 0;
  
  const kwMap = {};
  const prodMap = {};

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // skip header
    const vals = row.values;
    const product = String(vals[7] || '');
    const keyword = String(vals[12] || '');
    const imp = Number(vals[13]) || 0;
    const clicks = Number(vals[14]) || 0;
    const spend = Number(vals[15]) || 0;
    const orders = Number(vals[26]) || 0;
    const rev = Number(vals[32]) || 0;
    
    totalImp += imp;
    totalClicks += clicks;
    totalSpend += spend;
    totalOrders += orders;
    totalRev += rev;

    if (!kwMap[keyword]) kwMap[keyword] = { imp: 0, clicks: 0, spend: 0, rev: 0 };
    kwMap[keyword].imp += imp;
    kwMap[keyword].clicks += clicks;
    kwMap[keyword].spend += spend;
    kwMap[keyword].rev += rev;

    if (!prodMap[product]) prodMap[product] = { imp: 0, clicks: 0, spend: 0, rev: 0 };
    prodMap[product].imp += imp;
    prodMap[product].clicks += clicks;
    prodMap[product].spend += spend;
    prodMap[product].rev += rev;
  });
  
  console.log("=== [광고 성과 요약 (최근 2일)] ===");
  console.log(`노출:${totalImp}, 클릭:${totalClicks}, 광고비:${totalSpend}, 주문:${totalOrders}, 매출:${totalRev}`);
  console.log(`ROAS: ${totalSpend > 0 ? (totalRev/totalSpend*100).toFixed(0) : 0}%`);

  console.log("\n=== 주요 키워드 현황 ===");
  const kwList = Object.keys(kwMap).map(k => ({name: k, ...kwMap[k]})).sort((a,b) => b.imp - a.imp);
  kwList.slice(0, 10).forEach(k => console.log(`${k.name} | 노출:${k.imp} | 클릭:${k.clicks} | 광고비:${k.spend} | 매출:${k.rev}`));
  
  const targets = ["당면", "비타팝스 캔디", "푸주 500G"];
  console.log("\n=== 어제 껐던 키워드 상태 ===");
  targets.forEach(t => {
      const k = kwMap[t] || {imp:0, clicks:0, spend:0};
      console.log(`${t} | 노출:${k.imp} | 클릭:${k.clicks} | 광고비:${k.spend}`);
  });
}
analyze().catch(console.error);
