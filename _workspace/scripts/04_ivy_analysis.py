import pandas as pd

def analyze_ivy_data(file_path):
    print("--- 아이비 데이터 분석(Analyst) 시작 ---")
    
    # xlsx 파일 읽기 (엑셀 형식)
    try:
        df = pd.read_excel(file_path)
    except Exception as e:
        print(f"파일을 읽는 중 오류가 발생했습니다: {e}")
        return
        
    # '옵션명' 컬럼이 없을 경우 '상품명' 컬럼 사용
    col_name = '옵션명' if '옵션명' in df.columns else '상품명'
    
    if col_name not in df.columns:
        print(f"데이터에 '{col_name}' 컬럼이 없습니다. 컬럼명을 확인해주세요.")
        print(f"현재 컬럼들: {df.columns.tolist()}")
        return
    
    # 1. 대용량(업소용) vs 소단위(단품) 그룹핑 
    # 상품명/옵션명에 3개 이상 묶음 키워드가 포함된 경우 대용량으로 판별
    df['is_bulk'] = df[col_name].astype(str).str.contains('3개|5개|6개|12개|50개', regex=True, na=False)
    
    # 2. 그룹별 평균 구매전환율(CVR) 비교
    bulk_cvr = df[df['is_bulk']]['구매전환율'].mean()
    single_cvr = df[~df['is_bulk']]['구매전환율'].mean()
    
    print("\n💡 [핵심 가설 검증] 대용량 vs 소량 상품 CVR 비교")
    print(f" - 대용량(3개 이상 묶음) 평균 전환율: {bulk_cvr:.2f}%")
    print(f" - 소량(1~2개 낱개) 평균 전환율: {single_cvr:.2f}%")
    
    if pd.notna(bulk_cvr) and pd.notna(single_cvr):
        if bulk_cvr > single_cvr:
            print(" -> 결론: 아이비 고객 역시 대용량 구매를 선호합니다. 대용량 묶음 상품에 마케팅 예산을 집중하세요.\n")
        else:
            print(" -> 결론: 소량 단품의 전환율이 더 높습니다. 소량 상품 마케팅을 우선적으로 강화하세요.\n")
    else:
        print(" -> 결론: 데이터를 비교하기에 충분하지 않습니다.\n")
    
    # 3. 객단가(AOV) 산출 (0으로 나누기 방지)
    if '주문' in df.columns and '매출(원)' in df.columns:
        df['객단가'] = df.apply(lambda row: row['매출(원)'] / row['주문'] if row['주문'] > 0 else 0, axis=1)
        
        # 4. 캐시카우 리포트 (트래픽 상위 3개 상품)
        print("💰 [탑 트래픽 캐시카우 효율 검증]")
        if '조회' in df.columns:
            top_traffic = df.sort_values(by='조회', ascending=False).head(3)
            for idx, row in top_traffic.iterrows():
                print(f"상품명: {row[col_name]}")
                print(f" -> 조회수: {row['조회']} | CVR: {row['구매전환율']}% | 매출: {row['매출(원)']:,}원 | 1건당 객단가: {row['객단가']:,.0f}원\n")
        else:
            print("'조회' 컬럼이 없어 트래픽 상위 분석을 건너뜁니다.")

if __name__ == "__main__":
    # 아이비 엑셀 파일 경로
    target_file = r"c:\Users\FAMILY\Desktop\아이비 4~6일 매출(42).xlsx"
    analyze_ivy_data(target_file)
