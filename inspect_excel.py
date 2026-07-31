import pandas as pd
import json

file_path = r"c:\Users\FAMILY\Downloads\SELLER_INSIGHTS_VENDOR_ITEM_METRICS_(0) (53).xlsx"
xl = pd.ExcelFile(file_path)
print("Sheets:", xl.sheet_names)
for sheet in xl.sheet_names:
    df = xl.parse(sheet, nrows=5)
    print(f"\n--- Sheet: {sheet} ---")
    print("Columns:", df.columns.tolist())
    print(df.head(2).to_string())
