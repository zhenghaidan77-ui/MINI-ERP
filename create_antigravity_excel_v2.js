const ExcelJS = require('exceljs');
const path = require('path');

async function createExcel() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('수입 원가 분석표');

    // Do NOT use sheet.columns with headers, as it creates a hidden Row 1 and shifts everything down!
    sheet.getColumn(1).width = 35;
    sheet.getColumn(2).width = 40;
    sheet.getColumn(3).width = 15;
    sheet.getColumn(4).width = 15;
    sheet.getColumn(5).width = 70;

    // Input Settings
    sheet.addRow(['[ 수입 기본 설정 ] (노란색 칸 입력)', '', '', '', '']); // Row 1
    sheet.addRow(['환율 (KRW/USD)', 1500, '', '', '현재 환율 기입']); // Row 2
    sheet.addRow(['박스당 수량 (개입)', 6, '', '', '1박스당 들어있는 제품 개수']); // Row 3
    sheet.addRow(['기본 관세율', 0.08, '', '', '식품 기본 8%, FTA 적용시 0% 기입']); // Row 4
    sheet.addRow(['부가가치세율', 0.10, '', '', '기본 부가세 10%']); // Row 5
    sheet.addRow(['', '', '', '', '']); // Row 6 (Empty)

    // Table Header (Row 7)
    sheet.addRow(['항목명', '산출 근거 및 요율(%)', '금액(USD)', '금액(KRW)', '비고(실무 참고사항)']); // Row 7

    // Data Rows (Row 8 ~ 19)
    sheet.addRow([
        '1. 제품 구매 원가 (FOB)', 
        '수입 단가 ($3.4/박스)', 
        3.40, 
        { formula: 'C8*B2', result: 5100 }, 
        '중국 해상 선적 시점까지의 비용 완료 상태'
    ]); // Row 8
    
    sheet.addRow([
        '2. 해상 운임 (Ocean Freight)', 
        'LCL 기준 박스당 물동량 안분 (추정)', 
        1.00, 
        { formula: 'C9*B2', result: 1500 }, 
        '중국(위해/청도 등) ➔ 인천항 기준 (부피/무게에 따라 변동)'
    ]); // Row 9
    
    sheet.addRow([
        '3. 적하 보험료 (Insurance)', 
        'FOB 금액의 110% × 약 0.1%', 
        0.02, 
        { formula: 'C10*B2', result: 30 }, 
        '항해 중 파손/침수/분실 대비 (소액이라도 필수 가입 권장)'
    ]); // Row 10
    
    sheet.addRow([
        '과세 표준 가격 (CIF)', 
        'FOB + 운임 + 보험료 합계', 
        { formula: 'C8+C9+C10', result: 4.42 }, 
        { formula: 'D8+D9+D10', result: 6630 }, 
        '세관 관세 부과 기준 금액 (수입 신고 필증 기준)'
    ]); // Row 11
    
    sheet.addRow([
        '4. 수입 관세 (Duty)', 
        'CIF 가격 × 관세율', 
        { formula: 'C11*B4', result: 0.35 }, 
        { formula: 'D11*B4', result: 530 }, 
        '[핵심] 한-중 FTA 원산지 증명(C/O) 발급 시 0%~4%로 절감 가능'
    ]); // Row 12
    
    sheet.addRow([
        '5. 부가가치세 (VAT)', 
        '(CIF + 관세) × 부가세율', 
        { formula: '(C11+C12)*B5', result: 0.48 }, 
        { formula: '(D11+D12)*B5', result: 716 }, 
        '세관 납부 후 매입세액 공제 전액 환급 (현금흐름 고려용, 실질 원가 제외)'
    ]); // Row 13
    
    sheet.addRow([
        '6. 항만 부대비용 (THC 등)', 
        'THC, CFS 조작비, 부두사용료 안분', 
        { formula: 'D14/B2', result: 0.67 }, 
        1000, 
        'LCL 화물의 경우 CFS(보세창고) 작업비용 추가 발생 반영'
    ]); // Row 14
    
    sheet.addRow([
        '7. 통관 수수료 (관세사)', 
        '건당 기본료 (약 3.3만) 박스 안분', 
        { formula: 'D15/B2', result: 0.20 }, 
        300, 
        '관세법인 통관 대행 수수료 (수입 규모 커질수록 박스당 단가 하락)'
    ]); // Row 15
    
    sheet.addRow([
        '8. 식품 검역비 (식검)', 
        '서류 검사 (실적 건) 안분', 
        { formula: 'D16/B2', result: 0.13 }, 
        200, 
        '최초 수입 정밀검사(약 30~50만) 완료 가정, 이후 서류 검사비용 기준'
    ]); // Row 16
    
    sheet.addRow([
        '9. 내륙 운송비 및 하역비', 
        '인천항 ➔ 파주 트럭 운송 + 창고 하차', 
        { formula: 'D17/B2', result: 0.53 }, 
        800, 
        '1톤 윙바디/카고 용차 및 창고 첫 입고비/지게차 비용 안분'
    ]); // Row 17
    
    sheet.addRow([
        '박스당 최종 실질 원가', 
        'CIF + 관세 + 6,7,8,9항 (VAT 제외)', 
        { formula: 'C11+C12+C14+C15+C16+C17', result: 6.30 }, 
        { formula: 'D11+D12+D14+D15+D16+D17', result: 9460 }, 
        '1박스 당 온전히 부담하는 실제 원가 (Landed Cost)'
    ]); // Row 18
    
    sheet.addRow([
        '개당(1개) 최종 실질 원가', 
        '박스당 최종 원가 ÷ 수량', 
        { formula: 'C18/B3', result: 1.05 }, 
        { formula: 'D18/B3', result: 1577 }, 
        '마진 계산 및 최저 판매가(Pricing) 설정의 기준점'
    ]); // Row 19

    const centerAlign = { vertical: 'middle', horizontal: 'center' };
    const rightAlign = { vertical: 'middle', horizontal: 'right' };
    const leftAlign = { vertical: 'middle', horizontal: 'left' };

    // Format Input Settings
    sheet.mergeCells('A1:B1');
    sheet.getRow(1).getCell(1).font = { bold: true };
    [2, 3, 4, 5].forEach(rowNum => {
        const cell = sheet.getRow(rowNum).getCell(2);
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF2CC' } }; // Yellow input background
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        if (rowNum === 2) cell.numFmt = '#,##0';
        if (rowNum === 3) cell.numFmt = '0';
        if (rowNum === 4 || rowNum === 5) cell.numFmt = '0%';
    });

    // Format Header
    sheet.getRow(7).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
        cell.alignment = centerAlign;
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    // Format Data Rows
    for (let i = 8; i <= 19; i++) {
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
        if (i === 11) { // CIF
            row.eachCell(cell => {
                cell.font = { bold: true };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2EFDA' } };
            });
        }
        if (i === 18 || i === 19) { // Final Cost
            row.eachCell(cell => {
                cell.font = { bold: true, color: { argb: 'FFFF0000' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF2CC' } };
            });
        }
    }

    const desktopPath = path.join('C:', 'Users', 'FAMILY', 'Desktop');
    const filePath = path.join(desktopPath, '마라도삭면_최종실질원가분석_앤티그라비티_완성본.xlsx');

    try {
        await workbook.xlsx.writeFile(filePath);
        console.log(`Excel file successfully created at: ${filePath}`);
    } catch (err) {
        console.error('Failed to create excel file:', err);
    }
}

createExcel().catch(console.error);
