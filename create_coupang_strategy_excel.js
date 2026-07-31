const ExcelJS = require('exceljs');

async function createExcel() {
  const workbook = new ExcelJS.Workbook();

  // -------------------------------------------------------------
  // Sheet 1: 원가 분석 (그로스 vs 판매자배송)
  // -------------------------------------------------------------
  const sheet1 = workbook.addWorksheet('1. 쿠팡 원가 및 마진 분석');
  
  sheet1.columns = [
    { header: '항목 (100장 1세트 기준)', key: 'item', width: 30 },
    { header: '로켓그로스 (Coupang Fulfillment)', key: 'growth', width: 30 },
    { header: '판매자 배송 (Seller Delivery)', key: 'seller', width: 30 },
    { header: '비고 및 설명', key: 'desc', width: 45 }
  ];

  sheet1.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet1.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
  sheet1.getRow(1).alignment = { horizontal: 'center' };

  sheet1.addRow(['[A. 매출 및 기본 원가]', '', '', '']);
  sheet1.addRow(['쿠팡 판매가 (VAT 포함)', 28000, 26000, '그로스는 로켓 프리미엄으로 판매가 10~15% 높게 설정 가능']);
  sheet1.addRow(['수입 원가 (RMB/장)', 0.9, 0.9, '중국 공장 매입 단가 (1장당 약 0.9위안 가정)']);
  sheet1.addRow(['환율 (KRW)', 195, 195, '송금/카드 환율']);
  sheet1.addRow(['100장 매입 원가 (KRW)', { formula: 'B3*B4*100' }, { formula: 'C3*C4*100' }, '100장 1세트 원가']);
  sheet1.addRow(['해외 물류비 (100장 기준)', 1500, 1500, '해상 LCL CBM 단위 계산 후 100장 단위로 분할']);
  sheet1.addRow(['관부가세 등 기타 수입비용', 1800, 1800, '관세 8% 및 내륙 운송비 배분']);
  sheet1.addRow(['실질 도착 원가 (COGS)', { formula: 'B5+B6+B7' }, { formula: 'C5+C6+C7' }, '한국 창고 도착까지의 순수 제품 원가']);

  sheet1.addRow(['', '', '', '']);
  sheet1.addRow(['[B. 유통 및 플랫폼 비용]', '', '', '']);
  sheet1.addRow(['쿠팡 수수료율', 0.28, 0.108, '그로스: 수수료+입출고비용 통합(약 28% 가정) / 일반: 약 10.8%']);
  sheet1.addRow(['플랫폼/배송 관련 총 비용', { formula: 'B2*B11' }, { formula: '(C2*C11)+3000+500' }, '일반 배송은 수수료+택배비(3000)+포장인건비(500) 추가']);
  
  sheet1.addRow(['', '', '', '']);
  sheet1.addRow(['[C. 최종 마진 및 리스크]', '', '', '']);
  
  const pRow1 = sheet1.addRow(['★ 1세트(100장) 당 순수익', { formula: 'B2-B8-B12' }, { formula: 'C2-C8-C12' }, '판매가 - 도착원가 - 유통비용']);
  pRow1.font = { bold: true, color: { argb: 'FFC00000' } };
  
  const mRow1 = sheet1.addRow(['★ 영업 이익률 (%)', { formula: 'B16/B2' }, { formula: 'C16/C2' }, '최종 마진율']);
  mRow1.font = { bold: true, color: { argb: 'FFC00000' } };
  sheet1.getCell('B17').numFmt = '0.00%';
  sheet1.getCell('C17').numFmt = '0.00%';

  sheet1.addRow(['리스크 (Risk)', '장기 악성 재고 시 보관료 폭탄. 반품 시 페널티 비용 판매자 부담. 부피가 크면 그로스 입고비 급증.', '초기 트래픽 확보 어려움(로켓 뱃지 없음). 매일 직접 포장/송장 작업해야 하는 노동력(시간) 소요.', '']);

  // Format inputs
  const inputRows = [2,3,4,6,7,11];
  inputRows.forEach(row => {
    sheet1.getCell(`B${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
    sheet1.getCell(`C${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
  });

  for(let i=1; i<=18; i++) {
    const row = sheet1.getRow(i);
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
    });
    if(![8,17].includes(i)) {
      sheet1.getCell(`B${i}`).numFmt = '#,##0';
      sheet1.getCell(`C${i}`).numFmt = '#,##0';
    }
  }
  sheet1.getCell('B11').numFmt = '0.0%';
  sheet1.getCell('C11').numFmt = '0.0%';

  // -------------------------------------------------------------
  // Sheet 2: 마케팅 전략
  // -------------------------------------------------------------
  const sheet2 = workbook.addWorksheet('2. 쿠팡 마케팅 및 리스크 관리');
  sheet2.columns = [
    { header: '구분', key: 'type', width: 25 },
    { header: '전략 및 핵심 Action', key: 'action', width: 85 }
  ];
  sheet2.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet2.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };

  sheet2.addRow(['[시장 한계]', '대량 구매자(식자재마트, 프랜차이즈)는 이미 방산시장이나 도매몰과 장기 계약이 되어있음. 쿠팡에서 1만 장씩 사는 사람은 없음.']);
  sheet2.addRow(['[타겟 설정]', '쿠팡의 무기는 "내일 도착". 따라서 우리의 타겟은 "주말 장사 해야 하는데 보온팩이 떨어져서 당장 내일 급하게 필요한 사장님" 입니다.']);
  sheet2.addRow(['[마케팅 키워드]', '"당일발송", "로켓배송 보온팩", "소량 100장 급할때". B2B 도매몰이 채우지 못하는 "속도"와 "소량(100장 단위)"의 틈새시장을 노려야 합니다.']);
  sheet2.addRow(['[B2B 전환 전략 (매우 중요)]', '그로스로 배송되는 100장 세트 안에 "도매가 대량 발주 문의 시 20% 할인" 전단지와 자사몰 링크/연락처를 동봉합니다. 쿠팡을 이익 창출구보다 "잠재 B2B 고객의 DB를 수집하는 미끼(Lead Generation)"로 활용합니다.']);
  sheet2.addRow(['[리스크 관리]', '보온팩은 부피(CBM)가 매우 큰 상품입니다. 그로스에 수만 장 입고 시 부피 보관료로 마진이 다 날아갑니다. 외곽 컨테이너 창고에 원물을 보관하고, 그로스에는 "급하게 팔릴 2주치(예: 100세트)"씩만 소량 자주 입고시켜야 합니다.']);

  for(let i=2; i<=6; i++) {
    sheet2.getRow(i).height = 45;
    sheet2.getRow(i).alignment = { vertical: 'middle', wrapText: true };
    sheet2.getRow(i).eachCell({ includeEmpty: true }, cell => {
       cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
    });
  }

  // -------------------------------------------------------------
  // Sheet 3: B2B 파트너 협상 스크립트 (Pitch Deck)
  // -------------------------------------------------------------
  const sheet3 = workbook.addWorksheet('3. 타 대표(B2B) 협상 피칭 데이터');
  sheet3.columns = [
    { header: '협상 포인트', key: 'point', width: 30 },
    { header: '설득 스크립트 (상대 대표에게 할 말)', key: 'script', width: 70 },
    { header: '설득의 근거 (데이터)', key: 'data', width: 30 }
  ];
  sheet3.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet3.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };

  sheet3.addRow(['1. 단가 (원가 절감 제안)', '"대표님, 지금 방산시장에서 장당 250원에 쓰시죠? 제가 5만 장 직수입해서 장당 190원에 공급해 드릴 수 있습니다."', '국내 도매가(250원) vs 나의 도착원가(150원) 마진 차이 데이터']);
  sheet3.addRow(['2. 재고 리스크 해소 (내가지기)', '"수입하려면 MOQ 5만 장 한 번에 창고에 쌓아두셔야 하는데, 보관할 곳 없으시잖아요. 물건은 제가 제 창고로 받고, 대표님은 매월 5천 장씩만 필요할 때 빼서 쓰시고 결제하세요."', '상대방의 가장 큰 Pain Point인 "창고 보관료와 재고 부담"을 해결']);
  sheet3.addRow(['3. 남는 물량 소진 플랜', '"대표님이 5만 장 다 못 쓰셔도 상관없습니다. 남는 물량은 제가 이미 뚫어놓은 쿠팡 로켓그로스 채널을 통해 소상공인들에게 소량 판매하여 전부 소진시킬 능력이 있습니다."', 'Sheet 1,2의 쿠팡 판매 전략이 뒷받침됨']);
  sheet3.addRow(['4. 최종 클로징 (Win-Win)', '"결론적으로 대표님은 [원가 절감 + 창고비 제로 + 수입 엑스트라 업무 제로]입니다. 제가 수입과 쿠팡 소매 짬처리를 다 맡을 테니, 대표님 프랜차이즈 전 지점 납품 독점권만 주시면 됩니다."', '상대방은 오로지 혜택만 있고 리스크가 없음']);

  for(let i=2; i<=5; i++) {
    sheet3.getRow(i).height = 60;
    sheet3.getRow(i).alignment = { vertical: 'middle', wrapText: true };
    sheet3.getRow(i).eachCell({ includeEmpty: true }, cell => {
       cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
    });
  }

  await workbook.xlsx.writeFile('C:\\Users\\FAMILY\\Desktop\\별촘 제품\\쿠팡_판매전략_및_B2B원가협상.xlsx');
  console.log('Done');
}

createExcel().catch(console.error);
