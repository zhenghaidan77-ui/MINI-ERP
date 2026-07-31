const ExcelJS = require('exceljs');

async function createProposal() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('로켓배송 제안서');

    sheet.columns = [
        { header: '항목', key: 'category', width: 25 },
        { header: '세부 내용', key: 'details', width: 50 },
        { header: '기대 효과 (쿠팡 측 이점)', key: 'benefits', width: 40 }
    ];

    sheet.addRow(['제안사 명', 'NATAS (가칭)', '안정적인 파트너십 구축']);
    sheet.addRow(['주력 카테고리', '반려동물 용품 / 하네스', '고수요 카테고리 매출 견인']);
    sheet.addRow(['핵심 경쟁력 1: 물류 안정성', '기구축된 하네스 자체 물류/재고 시스템(API 연동 가능)', '품절 방지 및 로켓배송 납품 기일 100% 준수']);
    sheet.addRow(['핵심 경쟁력 2: 단가 경쟁력', '중국 직수입 라인 구축 완료 (중간 유통 마진 제거)', '경쟁사 대비 15~20% 저렴한 공급가 제공 가능']);
    sheet.addRow(['예상 공급가 / 마진율', '개당 1,421원 (공급가) / 쿠팡 마진율 30% 이상 보장', '로켓배송 카테고리 내 최고 수준의 마진 확보']);
    sheet.addRow(['품질 관리(QC)', '현지 및 국내 2-track 교차 검수 시스템', '반품률 1% 미만 유지, 고객 만족도(별점) 극대화']);
    sheet.addRow(['향후 계획', '하네스 외 리드줄, 배변봉투 등 라인업 확장', '로켓배송 내 브랜드 스토어 구축 및 락인 효과']);

    // Styling
    const centerAlign = { vertical: 'middle', horizontal: 'center' };
    const leftAlign = { vertical: 'middle', horizontal: 'left' };
    
    // Header
    const headerRow = sheet.getRow(1);
    headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0073E6' } }; // Coupang Blue
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

    await workbook.xlsx.writeFile('쿠팡_로켓배송_입점제안서.xlsx');
    console.log('쿠팡_로켓배송_입점제안서.xlsx 파일이 생성되었습니다.');
}

createProposal().catch(console.error);
