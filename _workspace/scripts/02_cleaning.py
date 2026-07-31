import pandas as pd

def clean_data(file_path):
    print("--- 데이터 정제(Cleaner) 시작 ---")
    # 엑셀 데이터 로드
    df = pd.read_excel(file_path)
    
    # 1. 환불/마이너스 매출 데이터 제거 (이상치 처리)
    df_cleaned = df[df['매출(원)'] >= 0].copy()
    
    # 2. 유의미한 트래픽 필터링 (조회수 10 이상)
    # 우연에 의한 클릭으로 CVR이 왜곡되는 것을 방지
    df_cleaned = df_cleaned[df_cleaned['조회'] >= 10]
    
    # 3. 불필요한 열 제거 및 다중공선성 방지
    columns_to_drop = ['총 매출(원)', '아이템위너 비율(%)', '총 취소 금액(원)', '총 취소된 상품수', '즉시 취소된 상품수']
    df_cleaned = df_cleaned.drop(columns=[col for col in columns_to_drop if col in df_cleaned.columns])
    
    # 4. 구매전환율 수치형(Float) 변환 ('%' 기호 제거)
    if df_cleaned['구매전환율'].dtype == 'O':
        df_cleaned['구매전환율'] = df_cleaned['구매전환율'].astype(str).str.rstrip('%').astype('float')
    
    # 정제된 데이터 저장
    cleaned_file_path = file_path.replace('.xlsx', '_cleaned.csv')
    df_cleaned.to_csv(cleaned_file_path, index=False, encoding='utf-8-sig')
    
    print(f"정제 완료! 원본 {len(df)}행 -> 정제 후 {len(df_cleaned)}행")
    print(f"저장 위치: {cleaned_file_path}\n")
    return df_cleaned

if __name__ == "__main__":
    # 데스크탑의 푸단테 엑셀 파일 지정
    clean_data(r"c:\Users\FAMILY\Desktop\푸단테 7.3.xlsx")
