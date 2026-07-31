import pandas as pd
import traceback

file_path = r"c:\Users\FAMILY\Desktop\아이비 4~6일 매출(42).xlsx"

try:
    df = pd.read_excel(file_path)
    print("Columns:", df.columns.tolist())
    print("\nFirst 3 rows:")
    print(df.head(3))
except Exception as e:
    print("Error reading excel:")
    traceback.print_exc()
