const ExcelJS = require('exceljs');
const path = "c:\\Users\\FAMILY\\Downloads\\A01262558_pa_total_campaign_20260601_20260630.xlsx";

async function peek() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path);
  
  console.log("Sheets:", workbook.worksheets.map(s => s.name));
  
  for (const sheet of workbook.worksheets) {
    console.log(`\n--- Sheet: ${sheet.name} ---`);
    const headerRow = sheet.getRow(1).values;
    console.log("Columns:", headerRow);
    for (let i = 2; i <= 5; i++) {
        const row = sheet.getRow(i).values;
        if (row && row.length > 0) {
            console.log(`Row ${i}:`, row);
        }
    }
    console.log("Row count:", sheet.rowCount);
  }
}

peek().catch(console.error);
