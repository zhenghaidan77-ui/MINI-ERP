const xlsx = require('xlsx');
const fs = require('fs');

const filePath = "c:\\Users\\FAMILY\\Downloads\\SELLER_INSIGHTS_VENDOR_ITEM_METRICS_(0) (53).xlsx";
const workbook = xlsx.readFile(filePath);

console.log("Sheets:", workbook.SheetNames);

workbook.SheetNames.forEach(sheetName => {
    console.log(`\n--- Sheet: ${sheetName} ---`);
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    if (data.length > 0) {
        console.log("Columns:");
        console.log(data[0]);
        console.log("First row of data:");
        if (data.length > 1) {
            console.log(data[1]);
        }
    } else {
        console.log("Empty sheet");
    }
});
