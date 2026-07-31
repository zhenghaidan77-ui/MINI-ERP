import pandas as pd
import json

def analyze_fudante_data(file_path):
    # Load the Excel file
    try:
        df = pd.read_excel(file_path, engine='openpyxl')
    except Exception as e:
        print(f"Error loading Excel: {e}")
        return

    # Standardize column names if there are slight variations
    col_map = {}
    for col in df.columns:
        if '옵션명' in str(col): col_map['OptionName'] = col
        elif '매출' in str(col) and '%' not in str(col): col_map['Revenue'] = col
        elif '주문' in str(col): col_map['Orders'] = col
        elif '조회' in str(col): col_map['Views'] = col
        elif '구매전환율' in str(col): col_map['CVR'] = col

    # Proceed if required columns exist
    if 'OptionName' not in col_map or 'Views' not in col_map:
        print("Required columns missing.")
        return

    df['Revenue'] = pd.to_numeric(df[col_map.get('Revenue', '매출')], errors='coerce').fillna(0)
    df['Orders'] = pd.to_numeric(df[col_map.get('Orders', '주문')], errors='coerce').fillna(0)
    df['Views'] = pd.to_numeric(df[col_map.get('Views', '조회')], errors='coerce').fillna(0)
    
    # Clean CVR (remove % and convert to float)
    if df[col_map['CVR']].dtype == 'O':
        df['CVR'] = df[col_map['CVR']].astype(str).str.replace('%', '', regex=False)
    df['CVR'] = pd.to_numeric(df['CVR'], errors='coerce').fillna(0)

    # 1. Bulk vs Single analysis
    df['is_bulk'] = df[col_map['OptionName']].astype(str).str.contains('3개|4개|5개|6개|7개|8개|9개|10개|12개|50개', regex=True, na=False)
    
    # Exclude items with zero views from bulk/single calculation to avoid skew
    df_active = df[df['Views'] > 0]
    
    bulk_cvr = df_active[df_active['is_bulk']]['CVR'].mean()
    single_cvr = df_active[~df_active['is_bulk']]['CVR'].mean()
    
    bulk_rev = df_active[df_active['is_bulk']]['Revenue'].sum()
    single_rev = df_active[~df_active['is_bulk']]['Revenue'].sum()

    # 2. Cash Cows (Top Revenue & High CVR)
    cash_cows = df[df['Revenue'] > 0].sort_values(by='Revenue', ascending=False).head(3)
    cash_cow_list = []
    for _, row in cash_cows.iterrows():
        cash_cow_list.append({
            "name": row[col_map['OptionName']],
            "revenue": row['Revenue'],
            "views": row['Views'],
            "cvr": row['CVR']
        })

    # 3. Black Holes (High Views, 0 Orders/Revenue)
    black_holes = df[(df['Views'] > 20) & (df['Orders'] == 0)].sort_values(by='Views', ascending=False).head(3)
    black_hole_list = []
    for _, row in black_holes.iterrows():
        black_hole_list.append({
            "name": row[col_map['OptionName']],
            "views": row['Views'],
            "cvr": row['CVR']
        })

    # 4. Hidden Gems (Low Views, High CVR)
    hidden_gems = df[(df['Views'] > 5) & (df['Views'] < 50) & (df['CVR'] > 5)].sort_values(by='CVR', ascending=False).head(3)
    hidden_gem_list = []
    for _, row in hidden_gems.iterrows():
        hidden_gem_list.append({
            "name": row[col_map['OptionName']],
            "views": row['Views'],
            "cvr": row['CVR'],
            "revenue": row['Revenue']
        })

    result = {
        "bulk_vs_single": {
            "bulk_cvr": bulk_cvr if pd.notna(bulk_cvr) else 0,
            "single_cvr": single_cvr if pd.notna(single_cvr) else 0,
            "bulk_revenue": bulk_rev,
            "single_revenue": single_rev
        },
        "cash_cows": cash_cow_list,
        "black_holes": black_hole_list,
        "hidden_gems": hidden_gem_list
    }

    print(json.dumps(result, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    analyze_fudante_data(r"C:\Users\FAMILY\Desktop\푸단테 7.4~6일.xlsx")
