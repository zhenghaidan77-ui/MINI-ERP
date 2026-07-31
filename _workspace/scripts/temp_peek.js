const ExcelJS = require('exceljs');
const path = "c:\\Users\\FAMILY\\Downloads\\SELLER_INSIGHTS_VENDOR_ITEM_METRICS_(0) (51).xlsx";

async function peek() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path);
  const sheet = workbook.worksheets[0];
  
  const headerRow = sheet.getRow(1).values;
  console.log("Headers:", headerRow);
  
  for (let i = 2; i <= 3; i++) {
     console.log("Row", i, ":", sheet.getRow(i).values);
  }
  console.log("Total rows:", sheet.rowCount);
}
peek().catch(console.error);
