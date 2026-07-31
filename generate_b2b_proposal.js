const ExcelJS = require('exceljs');
const path = require('path');

async function createB2BProposal() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('B2B 도매 공급 단가표');

    // Set Column Widths
    sheet.getColumn(1).width = 5;  // No
    sheet.getColumn(2).width = 30; // 제품명
    sheet.getColumn(3).width = 15; // 규격
    sheet.getColumn(4).width = 15; // 매입 원가
    sheet.getColumn(5).width = 15; // 당사 마진율
    sheet.getColumn(6).width = 15; // 마진 금액
    sheet.getColumn(7).width = 18; // 도매 공급가(VAT별도)
    sheet.getColumn(8).width = 15; // 부가세(10%)
    sheet.getColumn(9).width = 18; // 최종 합계(VAT포함)
    sheet.getColumn(10).width = 40; // 산출근거 및 비고

    // Title
    sheet.mergeCells('A1:J1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = '비타민 캔디 B2B 도매 공급 단가표 (최소 마진 적용)';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getRow(1).height = 40;

    sheet.addRow([]); // Empty row for spacing

    // Headers
    const headers = ['No', '제품명', '규격', '매입 원가(원)', '당사 마진율', '마진 금액(원)', '도매 공급가(VAT별도)', '부가세(10%)', '최종 합계(VAT포함)', '산출근거 및 비고'];
    const headerRow = sheet.addRow(headers);
    
    // Header Styling
    headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
    headerRow.height = 25;

    // Data Rows
    const data = [
        [1, '비타민 캔디', '1kg', 7800, 0.10],
        [2, '비타민 캔디', '500g', 5950, 0.10],
        [3, '비타민 캔디', '200g', 1950, 0.10]
    ];

    let rowIndex = 4;
    data.forEach(item => {
        const row = sheet.addRow([
            item[0], // No
            item[1], // 제품명
            item[2], // 규격
            item[3], // 매입 원가
            item[4], // 당사 마진율 (10%)
            { formula: `D${rowIndex}*E${rowIndex}` }, // 마진 금액
            { formula: `D${rowIndex}+F${rowIndex}` }, // 도매 공급가
            { formula: `G${rowIndex}*0.1` },          // 부가세
            { formula: `G${rowIndex}+H${rowIndex}` }, // 최종 합계
            '물류비/부대비용 방어 목적의 최소 10% 마진만 반영' // 비고
        ]);

        // Format Cells
        row.getCell(4).numFmt = '#,##0"원"';
        row.getCell(5).numFmt = '0%';
        row.getCell(6).numFmt = '#,##0"원"';
        row.getCell(7).numFmt = '#,##0"원"';
        row.getCell(8).numFmt = '#,##0"원"';
        row.getCell(9).numFmt = '#,##0"원"';

        row.eachCell((cell, colNumber) => {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            if ([1, 2, 3, 5, 10].includes(colNumber)) {
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            } else {
                cell.alignment = { vertical: 'middle', horizontal: 'right' };
            }
        });
        
        // Highlight supply price
        row.getCell(7).font = { bold: true, color: { argb: 'FFC00000' } };
        row.getCell(9).font = { bold: true };
        
        rowIndex++;
    });

    sheet.addRow([]);
    
    // Notes section
    sheet.mergeCells(`A${rowIndex+1}:J${rowIndex+1}`);
    const note1 = sheet.getCell(`A${rowIndex+1}`);
    note1.value = '※ 본 단가는 최소 마진(10%)으로 책정된 도매 특별 공급가입니다. (마진율 변경 시 공급가 자동 계산)';
    note1.font = { bold: true };
    
    sheet.mergeCells(`A${rowIndex+2}:J${rowIndex+2}`);
    sheet.getCell(`A${rowIndex+2}`).value = '※ 배송비 및 기타 조건은 별도 협의를 따릅니다.';

    // Save to Desktop
    const desktopPath = path.join('C:', 'Users', 'FAMILY', 'Desktop');
    const outPath = path.join(desktopPath, '비타민캔디_B2B_도매공급_제안단가표.xlsx');

    try {
        await workbook.xlsx.writeFile(outPath);
        console.log('Successfully created:', outPath);
    } catch (err) {
        console.error('Error creating excel:', err);
    }
}

createB2BProposal();
