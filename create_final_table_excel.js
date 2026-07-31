const ExcelJS = require('exceljs');
const path = require('path');

async function createExcel() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('수입 원가 분석표');

    sheet.getColumn(1).width = 35;
    sheet.getColumn(2).width = 40;
    sheet.getColumn(3).width = 15;
    sheet.getColumn(4).width = 15;
    sheet.getColumn(5).width = 70;

    // Row 1: Header
    sheet.addRow(['항목명', '산출 근거 및 요율(%)', '금액(USD)', '금액(KRW)', '비고(실무 참고사항)']);

    // Row 2: 1. 제품 구매 원가 (FOB)
    sheet.addRow([
        '1. 제품 구매 원가 (FOB)', 
        '수입 단가 ($3.4/박스)', 
        3.40, 
        { formula: 'C2*1500', result: 5100 }, 
        '중국 해상 선적 시점까지의 비용 완료 상태'
    ]);
    
    // Row 3: 2. 해상 운임 (Ocean Freight)
    sheet.addRow([
        '2. 해상 운임 (Ocean Freight)', 
        'LCL 기준 박스당 물동량 안분 (추정)', 
        1.00, 
        { formula: 'C3*1500', result: 1500 }, 
        '중국(위해/청도 등) ➔ 인천항 기준 (부피/무게에 따라 변동)'
    ]);
    
    // Row 4: 3. 적하 보험료 (Insurance)
    sheet.addRow([
        '3. 적하 보험료 (Insurance)', 
        'FOB 금액의 110% × 약 0.1%', 
        0.02, 
        { formula: 'C4*1500', result: 30 }, 
        '항해 중 파손/침수/분실 대비 (소액이라도 필수 가입 권장)'
    ]);
    
    // Row 5: 과세 표준 가격 (CIF)
    sheet.addRow([
        '과세 표준 가격 (CIF)', 
        'FOB + 운임 + 보험료 합계', 
        { formula: 'C2+C3+C4', result: 4.42 }, 
        { formula: 'D2+D3+D4', result: 6630 }, 
        '세관 관세 부과 기준 금액 (수입 신고 필증 기준)'
    ]);
    
    // Row 6: 4. 수입 관세 (Duty)
    sheet.addRow([
        '4. 수입 관세 (Duty)', 
        '8% (기본세율)', 
        { formula: 'C5*0.08', result: 0.35 }, 
        { formula: 'D5*0.08', result: 530 }, 
        '[핵심] 한-중 FTA 원산지 증명(C/O) 발급 시 0%~4%로 절감 가능'
    ]);
    
    // Row 7: 5. 부가가치세 (VAT)
    sheet.addRow([
        '5. 부가가치세 (VAT)', 
        '(CIF + 관세) × 10%', 
        { formula: '(C5+C6)*0.1', result: 0.48 }, 
        { formula: '(D5+D6)*0.1', result: 716 }, 
        '세관 납부 후 매입세액 공제 전액 환급 (현금흐름 고려용, 실질 원가 제외)'
    ]);
    
    // Row 8: 6. 항만 부대비용 (THC 등)
    sheet.addRow([
        '6. 항만 부대비용 (THC 등)', 
        'THC, CFS 조작비, 부두사용료 안분', 
        { formula: 'D8/1500', result: 0.67 }, 
        1000, 
        'LCL 화물의 경우 CFS(보세창고) 작업비용 추가 발생 반영'
    ]);
    
    // Row 9: 7. 통관 수수료 (관세사)
    sheet.addRow([
        '7. 통관 수수료 (관세사)', 
        '건당 기본료 (약 3.3만) 박스 안분', 
        { formula: 'D9/1500', result: 0.20 }, 
        300, 
        '관세법인 통관 대행 수수료'
    ]);
    
    // Row 10: 8. 내륙 운송비 및 하역비
    sheet.addRow([
        '8. 내륙 운송비 및 하역비', 
        '인천항 ➔ 파주 트럭 운송 + 창고 하차', 
        { formula: 'D10/1500', result: 0.53 }, 
        800, 
        '1톤 윙바디/카고 용차 및 창고 첫 입고비/지게차 비용 안분'
    ]);
    
    // Row 11: 박스당 최종 실질 원가
    sheet.addRow([
        '박스당 최종 실질 원가', 
        'CIF + 관세 + 6,7,8항 (VAT 제외)', 
        { formula: 'C5+C6+C8+C9+C10', result: 6.17 }, 
        { formula: 'D5+D6+D8+D9+D10', result: 9260 }, 
        '1박스 당 온전히 부담하는 실제 원가 (Landed Cost)'
    ]);
    
    // Row 12: 개당(1개) 최종 실질 원가
    sheet.addRow([
        '개당(1개) 최종 실질 원가', 
        '박스당 최종 원가 ÷ 6개', 
        { formula: 'C11/6', result: 1.03 }, 
        { formula: 'D11/6', result: 1543 }, 
        '마진 계산 및 최저 판매가(Pricing) 설정의 기준점'
    ]);

    const centerAlign = { vertical: 'middle', horizontal: 'center' };
    const rightAlign = { vertical: 'middle', horizontal: 'right' };
    const leftAlign = { vertical: 'middle', horizontal: 'left' };

    // Format Header (Row 1)
    sheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
        cell.alignment = centerAlign;
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    // Format Data Rows (Row 2 ~ 12)
    for (let i = 2; i <= 12; i++) {
        const row = sheet.getRow(i);
        
        row.eachCell((cell, colNumber) => {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            
            if (colNumber === 3 || colNumber === 4) {
                cell.alignment = rightAlign;
            } else if (colNumber === 1 || colNumber === 5) {
                cell.alignment = leftAlign;
            } else {
                cell.alignment = centerAlign;
            }
        });

        // Set number formats explicitly
        row.getCell(3).numFmt = '#,##0.00'; // USD
        row.getCell(4).numFmt = '#,##0'; // KRW

        // Highlighting for Subtotal & Total Rows
        if (i === 5) { // CIF
            row.eachCell(cell => {
                cell.font = { bold: true };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2EFDA' } };
            });
        }
        if (i === 11 || i === 12) { // Final Cost
            row.eachCell(cell => {
                cell.font = { bold: true, color: { argb: 'FFFF0000' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF2CC' } };
            });
        }
    }

    const desktopPath = path.join('C:', 'Users', 'FAMILY', 'Desktop');
    const filePath = path.join(desktopPath, '마라도삭면_최종표_수식적용.xlsx');

    try {
        await workbook.xlsx.writeFile(filePath);
        console.log(`Excel file successfully created at: ${filePath}`);
    } catch (err) {
        console.error('Failed to create excel file:', err);
    }
}

createExcel().catch(console.error);
