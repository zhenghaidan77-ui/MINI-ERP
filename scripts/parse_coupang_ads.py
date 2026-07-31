import pandas as pd
import sys

file_path = r"c:\Users\FAMILY\Downloads\A01262558_pa_total_campaign_20260601_20260630.xlsx"

try:
    print(f"Reading file: {file_path}")
    xls = pd.ExcelFile(file_path)
    print("Sheets found:", xls.sheet_names)
    
    for sheet in xls.sheet_names:
        print(f"\n--- Sheet: {sheet} ---")
        df = pd.read_excel(xls, sheet_name=sheet)
        print("Columns:")
        print(df.columns.tolist())
        print("\nFirst 3 rows:")
        print(df.head(3).to_string())
        print("\nData info:")
        df.info()
        print("\nMissing values:")
        print(df.isnull().sum())
        
except Exception as e:
    print(f"Error: {e}")
