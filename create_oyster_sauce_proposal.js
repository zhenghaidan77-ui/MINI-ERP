const ExcelJS = require('exceljs');

async function createProposal() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('해천 굴소스 로켓배송 제안서');

    sheet.columns = [
        { header: '항목', key: 'category', width: 25 },
        { header: '세부 내용', key: 'details', width: 50 },
        { header: '기대 효과 (BM 핵심 소구점)', key: 'benefits', width: 45 }
    ];

    sheet.addRow(['제안사 명', '주식회사 아이비에프엔비 (IB F&B Co., Ltd.)', '식품 전문 수입/유통의 안정적인 벤더사']);
    sheet.addRow(['제안 카테고리', '식품 / 소스·조미료 (해천 굴소스 620g 큐브형)', '쿠팡 내 필수 조미료 카테고리 트래픽 견인']);
    sheet.addRow(['핵심 상품 구성', '해천 굴소스 620g * 3개 세트 (묶음 기획)', '객단가 상승 및 로켓배송 박스 효율(합포장) 극대화']);
    sheet.addRow(['단가 및 마진 경쟁력', '소비자가 13,920원 / 3개 세트 공급가 4,263원 (개당 1,421원)', '쿠팡 측에 25%~30% 이상의 압도적 마진 제공 보장']);
    sheet.addRow(['시장 경쟁력 (온라인 최저가)', '타 유통채널 대비 압도적인 온라인 최저가 고정납품', '로켓배송 내 소스류 가격 경쟁력 1위 달성 및 독점적 지위']);
    sheet.addRow(['물류 및 재고 안정성', '중국 직수입 라인업 완비 및 국내 자체 창고 보유', '로켓 물류센터 입고 기일 100% 준수, 결품(Out of Stock) 원천 차단']);
    sheet.addRow(['향후 협업 계획', '해천 브랜드 타 라인업 및 신규 중화 소스 런칭 예정', 'BM님 카테고리의 지속적인 매출 및 마진 볼륨 확대 기여']);

    // Styling
    const centerAlign = { vertical: 'middle', horizontal: 'center' };
    const leftAlign = { vertical: 'middle', horizontal: 'left' };
    
    // Header
    const headerRow = sheet.getRow(1);
    headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0073E6' } };
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.alignment = centerAlign;
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    for(let i = 2; i <= 8; i++) {
        const row = sheet.getRow(i);
        row.height = 30;
        row.eachCell((cell, colNumber) => {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            if(colNumber === 1) {
                cell.alignment = centerAlign;
                cell.font = { bold: true, color: { argb: 'FF333333' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
            } else {
                cell.alignment = leftAlign;
            }
        });
    }

    await workbook.xlsx.writeFile('해천굴소스_로켓배송_입점제안서.xlsx');
    console.log('해천굴소스 엑셀 생성 완료');
}

createProposal().catch(console.error);
