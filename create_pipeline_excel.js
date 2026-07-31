const ExcelJS = require('exceljs');

async function createExcel() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('공장 협상 및 데이터 파이프라인');

  sheet.columns = [
    { header: '모듈 단계 (Phase)', key: 'phase', width: 25 },
    { header: '체크 포인트 및 협상 기준', key: 'point', width: 35 },
    { header: '세부 데이터 및 Action Item', key: 'action', width: 70 }
  ];

  // Header style
  sheet.getRow(1).font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
  sheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };

  sheet.addRow(['1단계: 데이터 역산 (Targeting)', '타겟 단가 역산 (Harness 로직)', '마진 계산기 기준, 목표 마진 30% 확보를 위해 매입 상한선(예: 12.5 RMB) 사전 도출']);
  sheet.addRow(['', '협상 스크립트 템플릿', '"한국 물류/ROAS 고정비로 인해 12.5 RMB 초과 시 진행 불가. 이 단가에 맞춘 스펙 제안 요망"']);

  sheet.addRow(['2단계: 스펙 통제 (보온팩)', '원단 두께 (Thickness)', '최소 3T(3mm) 이상 발포 PE + 은박 증착 필수 (영하 5도 배달 20분 버티기 위함)']);
  sheet.addRow(['', '접착부 폭 (Hot Melt Tape)', '최소 1.5cm ~ 2.0cm 이상 (오토바이 진동으로 인한 벌어짐 방지)']);
  sheet.addRow(['', 'MOQ 방어 전략 (Monet-registry)', '초기 인쇄 비용(동판비) 및 5만장 대량 발주 방지. "무지 은박" 공용 컴포넌트 사용으로 MOQ 1만장 컷']);

  sheet.addRow(['2단계: 스펙 통제 (식품)', '수분 함량 및 중량 로스', '푸주 등 건조식품 수분 증발 대비, 출고 시 Net Weight 505g~510g 세팅 계약서 명시']);
  sheet.addRow(['', '핀홀(진공 풀림) 불량률', '불량률 1% 미만 보증 및 초과분은 다음 발주 결제에서 차감(Credit) 조건 협의']);

  sheet.addRow(['3단계: 검수 및 물류 최적화', '생산 검수 게이트 (AQL 2.5)', '잔금 송금 전, 현지 제3자 검수업체 파견하여 AQL 2.5/4.0 기준 랜덤 샘플링 테스트 필수']);
  sheet.addRow(['', '물류/CBM 최적화 스펙 시트', '아웃박스(카톤) 당 가로/세로/높이 및 입수량 요구. 컨테이너/LCL 잉여 공간 발생 시 수량 미세조정(예: 4,032개)']);

  // Styling rows
  for(let i=2; i<=10; i++) {
    const row = sheet.getRow(i);
    row.height = 35; // Make rows taller for wrap text
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
      cell.alignment = { vertical: 'middle', wrapText: true };
    });
  }

  // Merging phase cells for better UI
  sheet.mergeCells('A2:A3');
  sheet.mergeCells('A4:A6');
  sheet.mergeCells('A7:A8');
  sheet.mergeCells('A9:A10');

  // Background for phase cells
  ['A2', 'A4', 'A7', 'A9'].forEach(cellRef => {
    const cell = sheet.getCell(cellRef);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCE6F1' } };
    cell.font = { bold: true };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  await workbook.xlsx.writeFile('C:\\Users\\FAMILY\\Desktop\\별촘 제품\\공장_직거래_소싱_파이프라인.xlsx');
  console.log('Done');
}

createExcel().catch(console.error);
