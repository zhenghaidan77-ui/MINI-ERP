const ExcelJS = require('exceljs');

async function createExcel() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('마진계산기');

    sheet.columns = [
        { header: '구분', key: 'A', width: 40 },
        { header: '금액', key: 'B', width: 15 },
        { header: '산출근거', key: 'C', width: 55 },
        { header: '비고', key: 'D', width: 15 }
    ];

    sheet.addRow(['소비자 판매가', 13920, '온라인 최저가 고정', '620g*3묶음']);
    sheet.addRow(['쿠팡 카테고리 수수료(11.99%)', { formula: 'ROUND(B2*0.1199, 0)' }, '소비자 판매가 X 11.99%', '']);
    sheet.addRow(['로켓그로스 물류 고정비', 2420, '입고 + 출고 + 배송(소형 기준 합산)', '']);
    sheet.addRow(['쿠팡 판매 광고비(11%)', { formula: 'ROUND(B2*0.11, 0)' }, '최저가 노출 및 매출 유지를 위한 최소 광고비', '']);
    sheet.addRow(['물류 센터 보관료 및 리스트 비용(4%)', { formula: 'ROUND(B2*0.04, 0)' }, '반품 처리, 유통기한/재고 파손, 라벨비 작업비', '']);
    sheet.addRow(['쿠팡 공제 후 최종 정산금액', { formula: 'B2-SUM(B3:B6)' }, '2-(3+4+5+6)', '']);
    sheet.addRow(['아이비 마진(25%)', { formula: 'ROUND(B2*0.25, 0)' }, '사업 유지를 위한 최소 마진(목표치)', '']);
    sheet.addRow(['3개 세트 총 목표 원가', { formula: 'B7-B8' }, '7-8', '']);
    sheet.addRow(['개당 최대 목표 공급가', { formula: 'ROUND(B9/3, 0)' }, '9/3', '']);

    // Styling
    const centerAlign = { vertical: 'middle', horizontal: 'center' };
    const rightAlign = { vertical: 'middle', horizontal: 'right' };
    
    // Header
    const headerRow = sheet.getRow(1);
    headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        cell.font = { bold: true };
        cell.alignment = centerAlign;
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    for(let i = 2; i <= 10; i++) {
        const row = sheet.getRow(i);
        row.eachCell((cell, colNumber) => {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            if(colNumber === 2) {
                cell.alignment = rightAlign;
                cell.numFmt = '#,##0';
            } else {
                cell.alignment = centerAlign;
            }
        });
        
        if(i === 2) {
            for(let j=1; j<=3; j++) {
                const cell = row.getCell(j);
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2EFDA' } };
                cell.font = { color: { argb: 'FF375623' } };
                if (j === 2) cell.font.bold = true;
            }
        } else if (i === 7) {
            for(let j=1; j<=3; j++) {
                const cell = row.getCell(j);
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };
                cell.font = { bold: true };
            }
        } else if (i === 8 || i === 10) {
            for(let j=1; j<=3; j++) {
                const cell = row.getCell(j);
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF2CC' } };
                cell.font = { bold: true, color: { argb: 'FFFF0000' } };
            }
        }
    }

    await workbook.xlsx.writeFile('마진계산기.xlsx');
    console.log('마진계산기.xlsx has been created!');
}

createExcel().catch(console.error);
