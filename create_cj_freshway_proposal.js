const ExcelJS = require('exceljs');

async function createProposal() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('CJ프레시웨이 제안 단가표');

    sheet.columns = [
        { header: '구분', key: 'category', width: 40 },
        { header: '금액 (원)', key: 'amount', width: 15 },
        { header: '산출 근거 및 설득 포인트', key: 'basis', width: 65 },
        { header: '비고', key: 'note', width: 15 }
    ];

    sheet.addRow(['쿠팡 소비자 판매가 (온라인 최저가)', 13920, '해천 굴소스 620g * 3묶음 기준', '']);
    sheet.addRow(['쿠팡 로켓배송 직매입 영업마진 (25%)', { formula: 'ROUND(B2*0.25, 0)' }, '로켓배송(1P) 입점 확정 및 상위 노출을 위해 쿠팡에 반드시 떼어줘야 할 고정 마진', '쿠팡 수익']);
    sheet.addRow(['쿠팡 직납(매입) 정산 단가', { formula: 'B2-B3' }, '쿠팡이 당사(IB F&B)로 지급하는 실제 정산 금액 (판매가 - 쿠팡마진)', '당사 매출']);
    sheet.addRow(['IB F&B 로켓배송 제반비용 (10%)', { formula: 'ROUND(B2*0.1, 0)' }, '쿠팡 밀크런 물류비, 필수 키워드 광고비, 반품/폐기 등 숨은 리스크 충당금', '고정비']);
    sheet.addRow(['IB F&B 벤더사 영업마진 (15%)', { formula: 'ROUND(B2*0.15, 0)' }, '중간 벤더사(당사) 사업 유지를 위한 최소 목표 마진', '당사 수익']);
    sheet.addRow(['CJ프레시웨이 3개 세트 총 목표 공급가', { formula: 'B4-B5-B6' }, '쿠팡 압도적 물량 발주를 조건으로 CJ프레시웨이가 맞춰주셔야 할 타겟 단가', '협상가']);
    sheet.addRow(['개당 최대 목표 공급가 (CJ프레시웨이)', { formula: 'ROUND(B7/3, 0)' }, '기존 WING 판매 시점보다 높은 물량 개런티를 무기로 단가 인하 압박', '개당 단가']);

    // Styling
    const centerAlign = { vertical: 'middle', horizontal: 'center' };
    const rightAlign = { vertical: 'middle', horizontal: 'right' };
    const leftAlign = { vertical: 'middle', horizontal: 'left' };
    
    const headerRow = sheet.getRow(1);
    headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        cell.font = { bold: true };
        cell.alignment = centerAlign;
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    for(let i = 2; i <= 8; i++) {
        const row = sheet.getRow(i);
        row.height = 25;
        row.eachCell((cell, colNumber) => {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            if(colNumber === 2) {
                cell.alignment = rightAlign;
                if(i > 1) cell.numFmt = '#,##0';
            } else {
                cell.alignment = colNumber === 1 || colNumber === 4 ? centerAlign : leftAlign;
            }
        });
        
        // Color coding
        if(i === 2) {
            sheet.getRow(i).getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2EFDA' } };
            sheet.getRow(i).getCell(1).font = { color: { argb: 'FF375623' } };
        }
        if (i === 4) {
            sheet.getRow(i).getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };
            sheet.getRow(i).getCell(1).font = { bold: true };
        }
        if (i === 7 || i === 8) {
            for(let j=1; j<=4; j++) {
                const cell = sheet.getRow(i).getCell(j);
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF2CC' } };
                cell.font = { bold: true, color: { argb: 'FFFF0000' } };
            }
        }
    }

    await workbook.xlsx.writeFile('CJ프레시웨이_단가협상_시뮬레이션.xlsx');
    console.log('생성 완료');
}

createProposal().catch(console.error);
