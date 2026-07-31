const ExcelJS = require('exceljs');

async function createProposal() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('CJ프레시웨이 단가협상표 (최종)');

    sheet.columns = [
        { header: '구분', key: 'category', width: 42 },
        { header: '금액 (원)', key: 'amount', width: 18 },
        { header: '비율 (%)', key: 'ratio', width: 12 },
        { header: '산출 근거 및 설득 포인트 (MD 압박용)', key: 'basis', width: 80 }
    ];

    sheet.addRow(['쿠팡 소비자 판매가 (온라인 최저가)', 13920, '100%', '해천 굴소스 620g * 3묶음 기준 (시장 최저가 방어 필수)']);
    sheet.addRow(['(-) 쿠팡 로켓배송 직매입 영업마진', { formula: 'ROUND(B2*0.25, 0)' }, '25%', '로켓배송(1P) 입점 확정 및 발주 유도를 위해 쿠팡에 무조건 떼어줘야 하는 고정 마진 (타협 불가)']);
    sheet.addRow(['(=) 쿠팡 직납(매입) 정산 단가', { formula: 'B2-B3' }, '75%', '쿠팡이 당사(IB F&B)로 지급하는 실제 정산 금액 (당사 매출)']);
    sheet.addRow(['(-) IB F&B 로켓배송 제반비용', { formula: 'ROUND(B2*0.1, 0)' }, '10%', '쿠팡 밀크런 물류비, 성장장려금, 키워드 광고비, 반품/폐기 리스크 충당금 (고정비)']);
    sheet.addRow(['(-) IB F&B 벤더사 영업마진', { formula: 'ROUND(B2*0.15, 0)' }, '15%', '당사 벤더 사업 유지를 위한 최소 목표 마진 (하한선)']);
    sheet.addRow(['(=) CJ프레시웨이 3개 세트 총 목표 공급가', { formula: 'B4-B5-B6' }, '50%', '★ 쿠팡 압도적 물량 발주를 조건으로 CJ프레시웨이가 맞춰주셔야 할 타겟 단가 (마지노선)']);
    sheet.addRow(['(=) 개당 최대 목표 공급가 (CJ프레시웨이)', { formula: 'ROUND(B7/3, 0)' }, '-', '👉 결론: 개당 2,320원 이하로 맞춰주지 않으면 쿠팡 로켓배송 납품 불가능 (단가 인하 강력 압박)']);

    // Styling
    const centerAlign = { vertical: 'middle', horizontal: 'center' };
    const rightAlign = { vertical: 'middle', horizontal: 'right' };
    const leftAlign = { vertical: 'middle', horizontal: 'left' };
    
    const headerRow = sheet.getRow(1);
    headerRow.height = 30;
    headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } }; // Dark blue
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // White text
        cell.alignment = centerAlign;
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    for(let i = 2; i <= 8; i++) {
        const row = sheet.getRow(i);
        row.height = 35;
        row.eachCell((cell, colNumber) => {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            if(colNumber === 2) {
                cell.alignment = rightAlign;
                cell.numFmt = '#,##0';
            } else if (colNumber === 3) {
                cell.alignment = centerAlign;
            } else {
                cell.alignment = colNumber === 1 ? centerAlign : leftAlign;
            }
        });
        
        // Color coding
        if(i === 2) {
            sheet.getRow(i).getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2EFDA' } };
            sheet.getRow(i).getCell(1).font = { bold: true, color: { argb: 'FF375623' } };
        }
        if (i === 4) {
            for(let j=1; j<=4; j++) {
                sheet.getRow(i).getCell(j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDEBF7' } };
                sheet.getRow(i).getCell(j).font = { bold: true };
            }
        }
        if (i === 7) {
            for(let j=1; j<=4; j++) {
                sheet.getRow(i).getCell(j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE699' } };
                sheet.getRow(i).getCell(j).font = { bold: true };
            }
        }
        if (i === 8) {
            for(let j=1; j<=4; j++) {
                sheet.getRow(i).getCell(j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF0000' } };
                sheet.getRow(i).getCell(j).font = { bold: true, color: { argb: 'FFFFFFFF' } };
            }
        }
    }

    await workbook.xlsx.writeFile('CJ프레시웨이_단가압박_최종시뮬레이션.xlsx');
}

createProposal().catch(console.error);
