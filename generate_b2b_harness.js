const ExcelJS = require('exceljs');
const path = require('path');

async function createHarnessB2B() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('B2B 도매 공급 단가표 (하네스 기준)');

    // Set Column Widths based on Harness standard
    sheet.getColumn(1).width = 25; // 제품명
    sheet.getColumn(2).width = 25; // 항목명
    sheet.getColumn(3).width = 35; // 산출 근거 및 요율(%)
    sheet.getColumn(4).width = 20; // 금액(KRW)
    sheet.getColumn(5).width = 50; // 비고(실무 참고사항)

    // Title
    sheet.mergeCells('A1:E1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = 'B2B 도매 공급 단가 및 마진 분석표 (하네스 원가 기준)';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getRow(1).height = 40;

    sheet.addRow([]);

    // Headers
    const headers = ['제품명', '항목명', '산출 근거 및 요율(%)', '금액(KRW)', '비고(실무 참고사항)'];
    const headerRow = sheet.addRow(headers);
    
    const centerAlign = { vertical: 'middle', horizontal: 'center' };
    const rightAlign = { vertical: 'middle', horizontal: 'right' };
    const leftAlign = { vertical: 'middle', horizontal: 'left' };

    headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
        cell.alignment = centerAlign;
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
    headerRow.height = 25;

    const products = [
        { name: '비타민 캔디 1kg', cost: 7800 },
        { name: '비타민 캔디 500g', cost: 5950 },
        { name: '비타민 캔디 200g', cost: 1950 }
    ];

    let currentRow = 4;
    const MARGIN_RATE = 0.15; // 15% Markup

    products.forEach((prod, index) => {
        const startRow = currentRow;

        // 1. 원가
        sheet.addRow([
            prod.name,
            '1. 개당 매입 원가 (Landed Cost)',
            '사전 산출된 개당 수입/매입 원가',
            prod.cost,
            '수입 부대비용 및 내륙운송비가 모두 포함된 실질 원가'
        ]);
        
        // 2. 최소 마진
        const marginAmt = Math.round(prod.cost * MARGIN_RATE);
        sheet.addRow([
            prod.name,
            '2. 당사 최소 마진 (Margin)',
            '매입 원가 대비 15% 최소 마진 적용',
            marginAmt,
            '물류 리스크(파손/반품) 및 최소 운영비 방어 목적 (Markup 15%)'
        ]);

        // 3. 도매 공급가 (VAT 별도)
        const supplyPrice = prod.cost + marginAmt;
        sheet.addRow([
            prod.name,
            '3. 도매 공급가 (VAT 별도)',
            '원가 + 당사 최소 마진',
            supplyPrice,
            '거래처 제안용 순수 공급 단가 (협상 마지노선)'
        ]);

        // 4. 부가가치세
        const vat = Math.round(supplyPrice * 0.1);
        sheet.addRow([
            prod.name,
            '4. 부가가치세 (VAT)',
            '도매 공급가의 10%',
            vat,
            '세금계산서 발행 시 필수 청구액 (매출세액)'
        ]);

        // 5. 최종 결제액
        const total = supplyPrice + vat;
        sheet.addRow([
            prod.name,
            '최종 결제 금액 (VAT 포함)',
            '도매 공급가 + 부가가치세',
            total,
            '거래처 실제 입금 요청 금액'
        ]);

        // Styling for this product block
        for (let i = startRow; i <= startRow + 4; i++) {
            const row = sheet.getRow(i);
            row.eachCell((cell, colNumber) => {
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                if (colNumber === 4) {
                    cell.alignment = rightAlign;
                    cell.numFmt = '#,##0"원"';
                } else if (colNumber === 3 || colNumber === 5) {
                    cell.alignment = leftAlign;
                } else {
                    cell.alignment = centerAlign;
                }
            });

            // Highlight Supply Price
            if (i === startRow + 2) {
                row.eachCell(cell => {
                    cell.font = { bold: true };
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2EFDA' } }; // Light Green
                });
                row.getCell(4).font = { bold: true, color: { argb: 'FFC00000' } };
            }
            
            // Highlight Final Price
            if (i === startRow + 4) {
                row.eachCell(cell => {
                    cell.font = { bold: true, color: { argb: 'FFFF0000' } };
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF2CC' } }; // Light Yellow
                });
            }
        }

        sheet.mergeCells(`A${startRow}:A${startRow + 4}`);
        currentRow += 5;
    });

    // Save to Desktop
    const desktopPath = path.join('C:', 'Users', 'FAMILY', 'Desktop');
    const outPath = path.join(desktopPath, '비타민캔디_하네스기준_도매단가표.xlsx');

    try {
        await workbook.xlsx.writeFile(outPath);
        console.log('Successfully created:', outPath);
    } catch (err) {
        console.error('Error creating excel:', err);
    }
}

createHarnessB2B();
