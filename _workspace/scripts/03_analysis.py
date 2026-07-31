import pandas as pd

def analyze_data(cleaned_file_path):
    print("--- 데이터 분석(Analyst) 시작 ---")
    df = pd.read_csv(cleaned_file_path)
    
    # 1. 대용량(업소용) vs 소단위(단품) 그룹핑 
    # 상품명에 3개 이상 묶음 키워드가 포함된 경우 대용량으로 판별
    df['is_bulk'] = df['옵션명'].str.contains('3개|5개|6개|12개|50개', regex=True)
    
    # 2. 그룹별 평균 구매전환율(CVR) 비교
    bulk_cvr = df[df['is_bulk']]['구매전환율'].mean()
    single_cvr = df[~df['is_bulk']]['구매전환율'].mean()
    
    print("💡 [핵심 가설 검증] 대용량 vs 소량 상품 CVR 비교")
    print(f" - 대용량(3개 이상 묶음) 평균 전환율: {bulk_cvr:.2f}%")
    print(f" - 소량(1~2개 낱개) 평균 전환율: {single_cvr:.2f}%")
    
    if bulk_cvr > single_cvr:
        print(" -> 결론: 푸단테 고객은 대용량 구매를 선호합니다. 대용량에 예산을 집중하세요.\n")
    
    # 3. 객단가(AOV) 산출 (0으로 나누기 방지)
    df['객단가'] = df.apply(lambda row: row['매출(원)'] / row['주문'] if row['주문'] > 0 else 0, axis=1)
    
    # 4. 캐시카우 리포트 (트래픽 상위 3개 상품)
    print("💰 [탑 트래픽 캐시카우 효율 검증]")
    top_traffic = df.sort_values(by='조회', ascending=False).head(3)
    for idx, row in top_traffic.iterrows():
        print(f"상품명: {row['옵션명']}")
        print(f" -> 조회수: {row['조회']} | CVR: {row['구매전환율']}% | 매출: {row['매출(원):,']}원 | 1건당 객단가: {row['객단가']:,.0f}원\n")
        
if __name__ == "__main__":
    analyze_data(r"c:\Users\FAMILY\Desktop\푸단테 7.3_cleaned.csv")
