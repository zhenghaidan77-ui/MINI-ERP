const ExcelJS = require('exceljs');

async function createProposal() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('해천 굴소스 로켓배송 제안서(최종)');

    sheet.columns = [
        { header: '항목', key: 'category', width: 25 },
        { header: '세부 내용', key: 'details', width: 60 },
        { header: '기대 효과 (BM 핵심 소구점)', key: 'benefits', width: 60 }
    ];

    sheet.addRow(['제안사 명', '주식회사 아이비에프엔비 (IB F&B Co., Ltd.)', '식품 전문 수입/유통의 안정적인 벤더사']);
    sheet.addRow(['제안 카테고리', '식품 / 소스·조미료 (해천 굴소스 620g 큐브형)', '쿠팡 내 필수 조미료 카테고리 트래픽 견인']);
    sheet.addRow(['핵심 상품 구성', '해천 굴소스 620g * 3개 세트 (묶음 기획)', '객단가 상승 및 로켓배송 박스 효율(합포장) 극대화']);
    sheet.addRow(['단가 및 마진 경쟁력', '소비자가 13,920원 / 3개 세트 쿠팡 매입가 10,440원 (개당 3,480원)', '소비자가 대비 쿠팡의 영업 마진 25% 완벽 보장']);
    sheet.addRow(['시장 경쟁력 (온라인 최저가)', '타 유통채널 대비 압도적인 온라인 최저가 고정납품', '로켓배송 내 소스류 가격 경쟁력 1위 달성 및 독점적 지위']);
    sheet.addRow(['물류 및 재고 안정성', '국내 최대 B2B 식자재 유통망 [CJ프레시웨이] 공식 공급 계약 및 물류 인프라 100% 연동', '대기업(CJ) 물류망을 활용한 대규모 발주 무제한 대응. 결품(OOS) 0% 보장 및 입고 기일 완벽 준수']);
    sheet.addRow(['향후 협업 계획', 'CJ프레시웨이의 막강한 소싱력을 바탕으로, 해천 굴소스 외 대용량 식자재 및 신규 소스류 로켓배송 지속 런칭', '단발성 납품이 아닌, BM님 카테고리의 볼륨을 지속적으로 팽창시키는 핵심 메가 벤더 파트너로 성장']);

    const centerAlign = { vertical: 'middle', horizontal: 'center' };
    const leftAlign = { vertical: 'middle', horizontal: 'left' };
    
    const headerRow = sheet.getRow(1);
    headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0073E6' } };
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.alignment = centerAlign;
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    for(let i = 2; i <= 8; i++) {
        const row = sheet.getRow(i);
        row.height = 35;
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
        
        if(i === 4) { // Highlight the corrected pricing
            sheet.getRow(i).getCell(2).font = { bold: true, color: { argb: 'FF0000FF' } }; 
            sheet.getRow(i).getCell(3).font = { bold: true, color: { argb: 'FF0000FF' } };
        }
    }

    await workbook.xlsx.writeFile('해천굴소스_로켓배송_입점제안서_최종수정본.xlsx');
    console.log('생성 완료');
}

createProposal().catch(console.error);
