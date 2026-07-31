import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

# 한글 폰트 깨짐 방지 설정 (Windows 기본 맑은 고딕 적용)
plt.rcParams['font.family'] = 'Malgun Gothic'
plt.rcParams['axes.unicode_minus'] = False

def create_visualizations(cleaned_file_path):
    print("--- 데이터 시각화(Visualizer) 렌더링 시작 ---")
    df = pd.read_csv(cleaned_file_path)
    
    # 대용량 플래그 추가 (분석가 기준 차용)
    df['is_bulk'] = df['옵션명'].str.contains('3개|5개|6개|12개|50개', regex=True)
    df['분류'] = df['is_bulk'].map({True: '대용량(묶음)', False: '단품(소량)'})
    
    # 차트 1: 트래픽(조회수) 대비 전환율 산점도 (버블 크기는 매출액)
    plt.figure(figsize=(14, 9))
    scatter = sns.scatterplot(
        data=df, 
        x='조회', 
        y='구매전환율', 
        size='매출(원)', 
        hue='분류',
        sizes=(100, 2000), 
        alpha=0.75, 
        palette={'대용량(묶음)': '#2ecc71', '단품(소량)': '#e74c3c'},
        edgecolor='black'
    )
    
    plt.title('푸단테 트래픽 대비 구매전환율 (버블 크기: 매출액)', fontsize=18, fontweight='bold', pad=20)
    plt.xlabel('광고 조회수 (Traffic)', fontsize=14)
    plt.ylabel('구매전환율 (%)', fontsize=14)
    
    # 핵심 데이터 라벨링 (조회수 50 이상이거나 CVR 15% 이상인 타깃만 텍스트 표시)
    for i in range(len(df)):
        if df.iloc[i]['조회'] > 50 or df.iloc[i]['구매전환율'] > 15:
            label = df.iloc[i]['옵션명'][:15] + "..." # 텍스트가 겹치지 않게 자름
            plt.annotate(label, (df.iloc[i]['조회'], df.iloc[i]['구매전환율']), 
                         xytext=(10, 10), textcoords='offset points', fontsize=10, fontweight='bold')
            
    plt.grid(True, linestyle='--', alpha=0.5)
    plt.legend(title='상품 구성', bbox_to_anchor=(1.05, 1), loc='upper left')
    
    # 저장 디렉토리 생성 및 차트 저장
    output_dir = r"d:\NATAS Harnes-menu\_workspace\charts"
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "01_scatter_traffic_cvr.png")
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=300)
    print(f"📊 차트 렌더링 완료! 저장 위치: {output_path}")

if __name__ == "__main__":
    create_visualizations(r"c:\Users\FAMILY\Desktop\푸단테 7.3_cleaned.csv")
