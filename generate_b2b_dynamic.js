const ExcelJS = require('exceljs');
const path = require('path');

async function createDynamicB2B() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('자동계산 도매 공급표');

    // Column Widths
    sheet.getColumn(1).width = 5;  // No
    sheet.getColumn(2).width = 25; // 제품명
    sheet.getColumn(3).width = 15; // 규격
    sheet.getColumn(4).width = 15; // 매입 원가
    sheet.getColumn(5).width = 15; // 부대비용
    sheet.getColumn(6).width = 15; // 기준 원가
    sheet.getColumn(7).width = 15; // 당사 마진
    sheet.getColumn(8).width = 15; // 물류비
    sheet.getColumn(9).width = 18; // 도매공급가(VAT별도)
    sheet.getColumn(10).width = 15; // 부가세
    sheet.getColumn(11).width = 18; // 최종결제액

    // === Section 1: Settings (공통 설정) ===
    sheet.mergeCells('B2:C2');
    sheet.getCell('B2').value = '⚙️ 공통 설정값 (여기만 수정하세요)';
    sheet.getCell('B2').font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
    sheet.getCell('B2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
    sheet.getCell('B2').alignment = { vertical: 'middle', horizontal: 'center' };

    // B3: Margin
    sheet.getCell('B3').value = '목표 마진율 (%)';
    sheet.getCell('C3').value = 0.15; // 15%
    sheet.getCell('C3').numFmt = '0%';
    
    // B4: Extra Cost %
    sheet.getCell('B4').value = '부대비용 요율 (%)';
    sheet.getCell('C4').value = 0.02; // 2%
    sheet.getCell('C4').numFmt = '0%';

    // B5: Logistics cost per unit (Percentage)
    sheet.getCell('B5').value = '물류비 요율 (%)';
    sheet.getCell('C5').value = 0.03; // 3%
    sheet.getCell('C5').numFmt = '0%';

    // Style settings area
    for(let i=3; i<=5; i++) {
        sheet.getCell(`B${i}`).font = { bold: true };
        sheet.getCell(`B${i}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        sheet.getCell(`B${i}`).border = { top: { style:'thin' }, left: { style:'thin' }, bottom: { style:'thin' }, right: { style:'thin' } };
        
        sheet.getCell(`C${i}`).font = { bold: true, color: { argb: 'FFC00000' } };
        sheet.getCell(`C${i}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } }; // Yellow background for editable cells
        sheet.getCell(`C${i}`).border = { top: { style:'thin' }, left: { style:'thin' }, bottom: { style:'thin' }, right: { style:'thin' } };
        sheet.getCell(`C${i}`).alignment = { horizontal: 'right' };
    }

    // === Section 2: Data Table ===
    sheet.addRow([]);
    sheet.addRow([]); // Row 7

    const headers = ['No', '제품명', '규격', '매입 원가', '부대비용', '기준 원가', '당사 마진', '물류비', '도매공급가 (VAT별도)', '부가세 (10%)', '최종 결제액 (VAT포함)'];
    const headerRow = sheet.addRow(headers); // Row 8
    
    headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
    headerRow.height = 30;

    const products = [
        { no: 1, name: '비타민 캔디', size: '1kg', cost: 7800 },
        { no: 2, name: '비타민 캔디', size: '500g', cost: 5950 },
        { no: 3, name: '비타민 캔디', size: '200g', cost: 1950 }
    ];

    let rowIndex = 9;
    products.forEach(p => {
        const row = sheet.addRow([
            p.no,
            p.name,
            p.size,
            p.cost, // D (원가)
            { formula: `D${rowIndex}*$C$4` }, // E: 부대비용 (원가 * 요율)
            { formula: `D${rowIndex}+E${rowIndex}` }, // F: 기준원가
            { formula: `F${rowIndex}*$C$3` }, // G: 마진 (기준원가 * 마진율)
            { formula: `F${rowIndex}*$C$5` }, // H: 물류비 (기준원가 * 물류비요율)
            { formula: `F${rowIndex}+G${rowIndex}+H${rowIndex}` }, // I: 공급가
            { formula: `I${rowIndex}*0.1` }, // J: 부가세
            { formula: `I${rowIndex}+J${rowIndex}` } // K: 최종결제액
        ]);

        // Formatting
        row.eachCell((cell, colNumber) => {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            if ([1, 2, 3].includes(colNumber)) {
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            } else {
                cell.alignment = { vertical: 'middle', horizontal: 'right' };
                cell.numFmt = '#,##0"원"';
            }
        });

        // Highlights
        row.getCell(6).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } }; // 기준원가
        row.getCell(9).font = { bold: true, color: { argb: 'FFC00000' } }; // 공급가
        row.getCell(9).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2EFDA' } };
        row.getCell(11).font = { bold: true, color: { argb: 'FFFF0000' } }; // 최종결제액
        row.getCell(11).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF2CC' } };

        rowIndex++;
    });

    // Save
    const desktopPath = path.join('C:', 'Users', 'FAMILY', 'Desktop');
    const outPath = path.join(desktopPath, '비타민캔디_자동계산_도매단가표_퍼센트적용.xlsx');

    try {
        await workbook.xlsx.writeFile(outPath);
        console.log('Successfully created:', outPath);
    } catch (err) {
        console.error('Error creating excel:', err);
    }
}

createDynamicB2B();
