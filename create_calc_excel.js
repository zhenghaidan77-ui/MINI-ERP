const ExcelJS = require('exceljs');

async function createExcel() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('마진 및 발주 자동계산기');

  // Columns setup
  sheet.columns = [
    { header: '분류', key: 'category', width: 30 },
    { header: '입력/수식', key: 'value', width: 25 },
    { header: '설명 (★ 노란색 칸만 직접 입력)', key: 'desc', width: 60 }
  ];

  // Title styling
  sheet.getRow(1).font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } };
  sheet.getRow(1).alignment = { horizontal: 'center' };

  // Helper for adding section
  function addSection(title) {
    const row = sheet.addRow([title, '', '']);
    row.font = { bold: true, size: 11, color: { argb: 'FF000000' } };
    row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCE6F1' } };
  }

  addSection('[1. 마진 및 도착 원가 계산]');
  
  sheet.addRow(['목표 소비자가 (VAT 포함)', 15000, '고객이 실제 결제하는 판매가']); // Row 3
  sheet.addRow(['제품 소싱 원가 (RMB)', 15, '중국 공장/도매 매입 단가']); // Row 4
  sheet.addRow(['환율 (KRW/RMB)', 195, '송금 시점 환율 + 카드/송금 수수료 여유분']); // Row 5
  
  sheet.addRow(['소싱 원가 (KRW)', { formula: 'B4*B5' }, '원화 환산 제품 대금']); // Row 6
  sheet.addRow(['해외 물류비 (단품 기준)', 500, 'CBM 또는 KG당 물류비를 단품으로 나눈 값']); // Row 7
  sheet.addRow(['관세율 (%)', 0.08, '제품 HS Code 기준 관세율']); // Row 8
  sheet.addRow(['관세액', { formula: '(B6+B7)*B8' }, '(제품가+물류비) x 관세율']); // Row 9
  sheet.addRow(['부가세 대납액 (참고용)', { formula: '(B6+B7+B9)*0.1' }, '현금 흐름상 납부하지만 나중에 환급됨']); // Row 10
  sheet.addRow(['통관/내륙운송 수수료', 150, '관세사 비용, 국내 트럭 운송비를 단품으로 나눈 값']); // Row 11
  sheet.addRow(['실질 도착 원가 (COGS)', { formula: 'B6+B7+B9+B11' }, '재무적 매입 원가 (부가세 제외)']); // Row 12
  sheet.addRow(['3PL 풀필먼트 비용 총합', 3000, '하역/입고비 + 보관비 + 출고비 + 택배비']); // Row 13
  sheet.addRow(['포장 부자재 비용', 200, '박스, 뽁뽁이, 테이프 등']); // Row 14
  sheet.addRow(['플랫폼 수수료율 (%)', 0.055, '스마트스토어/쿠팡 등 평균 수수료']); // Row 15
  sheet.addRow(['플랫폼 수수료액', { formula: 'B3*B15' }, '소비자가 x 수수료율']); // Row 16
  sheet.addRow(['타겟 ROAS (%)', 3.0, '마케팅 목표 효율 (예: 300% -> 3)']); // Row 17
  sheet.addRow(['마케팅 예산 (단품당)', { formula: 'B3/B17' }, '소비자가 / ROAS']); // Row 18
  sheet.addRow(['최종 부가세 납부액', { formula: '(B3*10/11)*0.1 - B10' }, '매출세액 - 매입세액']); // Row 19
  
  const profitRow = sheet.addRow(['★ 실질 순수익 (Net Profit)', { formula: 'B3-B12-B13-B14-B16-B18-B19' }, '통장에 꽂히는 진짜 내 돈']);
  profitRow.font = { bold: true, color: { argb: 'FFC00000' } };
  
  const marginRow = sheet.addRow(['★ 최종 영업이익률 (%)', { formula: 'B20/B3' }, '핵심 지표']);
  marginRow.font = { bold: true, color: { argb: 'FFC00000' } };
  sheet.getCell('B21').numFmt = '0.00%';

  sheet.addRow(['', '', '']); // Row 22

  addSection('[2. 소싱 적합성 자동 판독기]'); // Row 23
  sheet.addRow(['최소 마진율 기준', 0.25, '25% 이상 기준']); // Row 24
  sheet.getCell('B24').numFmt = '0%';
  sheet.addRow(['최소 절대수익 기준', 3000, '3000원 이상 기준']); // Row 25
  
  const judgeRow = sheet.addRow(['★ 최종 소싱 판단', { formula: 'IF(AND(B21>=B24, B20>=B25), "🟢 소싱 적합 (Go)", IF(AND(B21>=0.15, B20>=1500), "🟡 조건부 승인 (Hold)", "🔴 수입 보류 (No-Go)"))' }, '마진율과 순수익 모두 만족해야 Go']);
  judgeRow.font = { bold: true, size: 12 };
  
  sheet.addRow(['', '', '']); // Row 27
  
  addSection('[3. 발주 수량 자동 계산기]'); // Row 28
  sheet.addRow(['월 예상 판매량 (수량)', 800, '데이터 툴이나 초기 타겟치 기반']); // Row 29
  sheet.addRow(['일평균 판매량 (Run-rate)', { formula: 'B29/30' }, '매일 팔리는 수량']); // Row 30
  sheet.addRow(['공장 리드타임 (Days)', 25, '발주~생산~해운~통관~3PL입고 소요일']); // Row 31
  sheet.addRow(['안전 재고 일수 (Days)', 15, '기상 악화, 통관 지연 대비 여유 일수']); // Row 32
  sheet.addRow(['목표 확보 개월 수', 5, '첫 런칭 시 목표 확보 개월']); // Row 33
  
  const orderRow1 = sheet.addRow(['★ 첫 발주 최적 수량 (개)', { formula: 'B29*B33' }, '월 판매량 x 5개월']);
  orderRow1.font = { bold: true };
  
  const orderRow2 = sheet.addRow(['★ 재발주 시점 (ROP)', { formula: '(B30*B31)+(B30*B32)' }, '재고가 이 숫자에 도달하면 즉시 재발주 요망']);
  orderRow2.font = { bold: true, color: { argb: 'FF0070C0' } };
  
  const orderRow3 = sheet.addRow(['적정 2차 발주 수량', { formula: 'B29*3' }, '데이터 확인 후 3개월치씩 정기 사이클 발주']);

  // Add borders to all
  for (let i = 1; i <= 36; i++) {
    const row = sheet.getRow(i);
    row.eachCell((cell) => {
      cell.border = {
        top: {style:'thin'},
        left: {style:'thin'},
        bottom: {style:'thin'},
        right: {style:'thin'}
      };
      if (cell.col === 2 && typeof cell.value === 'number') {
        cell.alignment = { horizontal: 'right' };
      }
    });
  }

  // Add yellow background to input cells
  const inputRows = [3,4,5,7,8,11,13,14,15,17,24,25,29,31,32,33];
  inputRows.forEach(rowNum => {
    const cell = sheet.getCell(`B${rowNum}`);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } }; // Yellow
    cell.font = { bold: true };
  });

  // Apply number formatting
  for(let i=3; i<=36; i++) {
     if(i===8 || i===15 || i===21 || i===24 || i===17) continue; 
     if(i===22 || i===23 || i===27 || i===28) continue; 
     if(i===26) continue; 
     sheet.getCell(`B${i}`).numFmt = '#,##0';
  }
  sheet.getCell('B8').numFmt = '0%';
  sheet.getCell('B15').numFmt = '0.0%';

  await workbook.xlsx.writeFile('C:\\Users\\FAMILY\\Desktop\\별촘 제품\\마진_및_발주_자동계산기_완성본.xlsx');
  console.log('Done');
}

createExcel().catch(console.error);
