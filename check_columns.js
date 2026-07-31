const xlsx = require('xlsx');

const filePath = "c:\\Users\\FAMILY\\Downloads\\SELLER_INSIGHTS_VENDOR_ITEM_METRICS_(0) (55).xlsx";
const workbook = xlsx.readFile(filePath);
const sheet = workbook.Sheets['vendor item metrics'];
const rawData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

if (rawData.length > 0) {
    console.log("Columns:", rawData[0]);
    console.log("First Row:", rawData[1]);
}
