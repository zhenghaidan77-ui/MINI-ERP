const ExcelJS = require('exceljs');
const path = require('path');
const os = require('os');

async function createExcel() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('마라도삭면_원가분석');

    sheet.columns = [
        { header: '항목', key: 'A', width: 40 },
        { header: '금액 / 수치', key: 'B', width: 20 },
        { header: '단위', key: 'C', width: 15 },
        { header: '산출근거 및 설명', key: 'D', width: 60 }
    ];

    // default values for initial results
    const exRate = 1400;
    const boxCost = 3.4;
    const boxQty = 6;
    const unitCost = boxCost / boxQty;
    const dutyRate = 0.08;
    const vatRate = 0.10;

    const b10 = unitCost * exRate;
    const b11 = 150;
    const b12 = b10 + b11;
    const b13 = b12 * dutyRate;
    const b14 = (b12 + b13) * vatRate;
    const b15 = 30;
    const b16 = 333;
    const b17 = 100;
    const b20 = b10 + b11 + b13 + b15 + b16 + b17;
    const b21 = b20 + b14;

    sheet.addRow(['[ 기본 설정 (변경 가능) ]', '', '', '']); // 1
    sheet.addRow(['환율', exRate, '원/달러', '현재 예상 환율 적용']); // 2
    sheet.addRow(['박스당 수입 단가', boxCost, 'USD', '공급가']); // 3
    sheet.addRow(['박스당 수량', boxQty, '개', '1박스당 들어있는 개수']); // 4
    sheet.addRow(['개당 수입 단가', { formula: 'B3/B4', result: unitCost }, 'USD', '수입단가 / 수량']); // 5
    sheet.addRow(['관세율', dutyRate, '비율', '가공식품 기본 관세 8% (FTA 적용시 변경)']); // 6
    sheet.addRow(['부가세율', vatRate, '비율', '기본 부가세 10%']); // 7
    sheet.addRow(['', '', '', '']); // 8

    sheet.addRow(['[ 개당 수입 원가 상세 (KRW) ]', '', '', '']); // 9
    sheet.addRow(['1. 제품 원가 (물대)', { formula: 'B5*B2', result: b10 }, '원', '개당 수입 단가(B5) x 환율(B2)']); // 10
    sheet.addRow(['2. 해운 운임 및 부대비용', b11, '원', '해상운임, THC 등 (박스당 약 900원 가정하여 6으로 나눔)']); // 11
    sheet.addRow(['3. 관세 과세표준 (CIF)', { formula: 'B10+B11', result: b12 }, '원', '1.제품원가 + 2.해운운임']); // 12
    sheet.addRow(['4. 관세', { formula: 'B12*B6', result: b13 }, '원', '3.과세표준 x 관세율']); // 13
    sheet.addRow(['5. 부가세 (환급가능)', { formula: '(B12+B13)*B7', result: b14 }, '원', '(과세표준 + 관세) x 10% (사업자 환급됨)']); // 14
    sheet.addRow(['6. 통관 수수료 (관세사)', b15, '원', '관세사 통관 수수료 (박스당 약 180원 가정)']); // 15
    sheet.addRow(['7. 국내 내륙 운송비', b16, '원', '항구 -> 물류창고 (박스당 약 2,000원 가정)']); // 16
    sheet.addRow(['8. 창고 하역 및 입고비', b17, '원', '창고 하역료 및 첫 입고비 (박스당 약 600원 가정)']); // 17
    sheet.addRow(['', '', '', '']); // 18

    sheet.addRow(['[ 최종 개당 입고 원가 ]', '', '', '']); // 19
    sheet.addRow(['개당 실질 원가 (부가세 제외)', { formula: 'B10+B11+B13+B15+B16+B17', result: b20 }, '원', '순수 입고비용 (물대+해운+관세+통관+운송+하역)']); // 20
    sheet.addRow(['개당 현금흐름 원가 (부가세 포함)', { formula: 'B20+B14', result: b21 }, '원', '초기 투입되어야 할 결제 금액 (실질 원가 + 부가세)']); // 21

    const centerAlign = { vertical: 'middle', horizontal: 'center' };
    const rightAlign = { vertical: 'middle', horizontal: 'right' };
    const leftAlign = { vertical: 'middle', horizontal: 'left' };

    for (let i = 1; i <= 21; i++) {
        const row = sheet.getRow(i);
        
        // Skip empty rows
        if ([8, 18].includes(i)) continue;

        // Header and Section Rows
        if ([1, 9, 19].includes(i)) {
            sheet.mergeCells(`A${i}:D${i}`);
            row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
            row.getCell(1).font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 12 };
            row.getCell(1).alignment = centerAlign;
            continue;
        }

        row.eachCell((cell, colNumber) => {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            
            // Default alignment
            if (colNumber === 2) {
                cell.alignment = rightAlign;
            } else if (colNumber === 4 || colNumber === 1) {
                cell.alignment = leftAlign;
            } else {
                cell.alignment = centerAlign;
            }
        });

        // Set number formats explicitly for Column B
        const bCell = row.getCell(2);
        if ([2, 10, 11, 12, 13, 14, 15, 16, 17, 20, 21].includes(i)) {
            bCell.numFmt = '#,##0'; // Integer with comma
        } else if ([3, 5].includes(i)) {
            bCell.numFmt = '#,##0.0000'; // 4 decimal places for USD
        } else if ([6, 7].includes(i)) {
            bCell.numFmt = '0%'; // Percentage
        }

        // Highlights for final costs
        if (i === 20) {
            row.eachCell(cell => {
                cell.font = { bold: true, color: { argb: 'FFFF0000' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF2CC' } };
            });
        }
        if (i === 21) {
            row.eachCell(cell => {
                cell.font = { bold: true, color: { argb: 'FFFF0000' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFCE4D6' } };
            });
        }
    }

    // Input fields coloring (Green)
    [2,3,4,6,7].forEach(rowIdx => {
        sheet.getCell(`B${rowIdx}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2EFDA' } };
    });

    const desktopPath = path.join('C:', 'Users', 'FAMILY', 'Desktop');
    const filePath = path.join(desktopPath, '마라도삭면_원가분석_v2.xlsx');

    try {
        await workbook.xlsx.writeFile(filePath);
        console.log(`Excel file successfully recreated at: ${filePath}`);
    } catch (err) {
        console.error('Failed to create excel file:', err);
    }
}

createExcel().catch(console.error);
