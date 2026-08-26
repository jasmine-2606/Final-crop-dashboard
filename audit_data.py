import pandas as pd
import os


# ============================================================
# FILE PATHS
# ============================================================

DATASET_A = r"backend/data/dataset_A/Area under different Crops.csv"
DATASET_B = r"backend/data/dataset_B/All-India_-Crop-wise-Area,-Production-&-Yield.csv"


# ============================================================
# LOAD DATA
# ============================================================

df_a = pd.read_csv(DATASET_A)
df_b = pd.read_csv(DATASET_B)


# ============================================================
# BASIC INFORMATION
# ============================================================

print("=" * 70)
print("PHASE 1 — DATA AUDIT")
print("=" * 70)


print("\n\nDATASET A — TELANGANA DISTRICT CROP AREA")
print("-" * 70)

print("\nShape:")
print(df_a.shape)

print("\nColumns:")
for col in df_a.columns:
    print(f" - {col}")

print("\nMissing Values:")
print(df_a.isnull().sum())

print("\nDuplicate Rows:")
print(df_a.duplicated().sum())

print("\nFirst 5 Rows:")
print(df_a.head())


print("\n\nDATASET B — ALL-INDIA CROP ANALYTICS")
print("-" * 70)

print("\nShape:")
print(df_b.shape)

print("\nColumns:")
for col in df_b.columns:
    print(f" - {col}")

print("\nMissing Values:")
print(df_b.isnull().sum())

print("\nDuplicate Rows:")
print(df_b.duplicated().sum())

print("\nFirst 5 Rows:")
print(df_b.head())


# ============================================================
# DATASET A — DISTRICTS
# ============================================================

print("\n\nDATASET A — DISTRICTS")
print("-" * 70)

district_column = df_a.columns[0]

districts_a = df_a[district_column].dropna().unique()

print(f"\nDistrict column: {district_column}")
print(f"Number of unique districts: {len(districts_a)}")

print("\nDistricts:")
for district in sorted(districts_a):
    print(f" - {district}")


# ============================================================
# DATASET A — CROPS
# ============================================================

print("\n\nDATASET A — CROPS")
print("-" * 70)

crop_columns_a = list(df_a.columns[1:])

print(f"\nNumber of crop columns: {len(crop_columns_a)}")

print("\nCrops:")
for crop in crop_columns_a:
    print(f" - {crop}")


# ============================================================
# DATASET B — IDENTIFY COLUMNS
# ============================================================

print("\n\nDATASET B — COLUMN STRUCTURE")
print("-" * 70)

print("\nColumns:")
for i, col in enumerate(df_b.columns):
    print(f"{i}: {col}")


# ============================================================
# DATASET B — UNIQUE VALUES
# ============================================================

print("\n\nDATASET B — UNIQUE VALUES")
print("-" * 70)

for col in df_b.columns:

    unique_values = df_b[col].dropna().unique()

    if len(unique_values) <= 50:
        print(f"\n{col}:")
        print(f"Number of unique values: {len(unique_values)}")

        for value in unique_values:
            print(f" - {value}")


# ============================================================
# TRY TO IDENTIFY CROP / SEASON / YEAR COLUMNS
# ============================================================

def find_column(columns, keywords):

    for col in columns:
        col_lower = str(col).lower()

        for keyword in keywords:
            if keyword in col_lower:
                return col

    return None


crop_column_b = find_column(
    df_b.columns,
    ["crop", "crop name", "commodity"]
)

season_column_b = find_column(
    df_b.columns,
    ["season"]
)

year_column_b = find_column(
    df_b.columns,
    ["year"]
)


print("\n\nDATASET B — DETECTED STRUCTURE")
print("-" * 70)

print(f"\nCrop column: {crop_column_b}")
print(f"Season column: {season_column_b}")
print(f"Year column: {year_column_b}")


# ============================================================
# DATASET B — CROPS
# ============================================================

if crop_column_b:

    crops_b = df_b[crop_column_b].dropna().astype(str).str.strip().unique()

    print("\n\nDATASET B — CROPS")
    print("-" * 70)

    print(f"\nNumber of unique crops: {len(crops_b)}")

    for crop in sorted(crops_b):
        print(f" - {crop}")


# ============================================================
# DATASET B — SEASONS
# ============================================================

if season_column_b:

    seasons_b = df_b[season_column_b].dropna().astype(str).str.strip().unique()

    print("\n\nDATASET B — SEASONS")
    print("-" * 70)

    print(f"\nNumber of unique seasons: {len(seasons_b)}")

    for season in sorted(seasons_b):
        print(f" - {season}")


# ============================================================
# DATASET B — YEARS
# ============================================================

if year_column_b:

    years_b = df_b[year_column_b].dropna().unique()

    print("\n\nDATASET B — YEARS")
    print("-" * 70)

    print(f"\nNumber of unique years: {len(years_b)}")

    for year in sorted(years_b):
        print(f" - {year}")


# ============================================================
# OVERLAPPING CROPS
# ============================================================

print("\n\nCROP OVERLAP ANALYSIS")
print("=" * 70)

crops_a_normalized = {
    str(crop).strip().lower(): crop
    for crop in crop_columns_a
}

crops_b_normalized = {
    str(crop).strip().lower(): crop
    for crop in crops_b
} if crop_column_b else {}


exact_overlap = sorted(
    set(crops_a_normalized.keys()) &
    set(crops_b_normalized.keys())
)

only_a = sorted(
    set(crops_a_normalized.keys()) -
    set(crops_b_normalized.keys())
)

only_b = sorted(
    set(crops_b_normalized.keys()) -
    set(crops_a_normalized.keys())
)


print("\nExact overlapping crop names:")

for crop in exact_overlap:
    print(
        f" - {crops_a_normalized[crop]}"
        f" <-> {crops_b_normalized[crop]}"
    )

print(f"\nNumber of exact overlaps: {len(exact_overlap)}")


print("\n\nCrops only in Dataset A:")

for crop in only_a:
    print(f" - {crops_a_normalized[crop]}")

print(f"\nCount: {len(only_a)}")


print("\n\nCrops only in Dataset B:")

for crop in only_b:
    print(f" - {crops_b_normalized[crop]}")

print(f"\nCount: {len(only_b)}")


# ============================================================
# FINAL STRUCTURAL SUMMARY
# ============================================================

print("\n\nFINAL PHASE 1 SUMMARY")
print("=" * 70)

print("\nDataset A:")
print(f" - Rows: {df_a.shape[0]}")
print(f" - Columns: {df_a.shape[1]}")
print(f" - Districts: {len(districts_a)}")
print(f" - Crop columns: {len(crop_columns_a)}")
print(f" - Duplicate rows: {df_a.duplicated().sum()}")
print(f" - Missing cells: {df_a.isnull().sum().sum()}")


print("\nDataset B:")
print(f" - Rows: {df_b.shape[0]}")
print(f" - Columns: {df_b.shape[1]}")

if crop_column_b:
    print(f" - Unique crops: {len(crops_b)}")

if season_column_b:
    print(f" - Unique seasons: {len(seasons_b)}")

if year_column_b:
    print(f" - Unique years: {len(years_b)}")

print(f" - Duplicate rows: {df_b.duplicated().sum()}")
print(f" - Missing cells: {df_b.isnull().sum().sum()}")


print("\n\nIMPORTANT DECISION")
print("-" * 70)
print("Dataset A and Dataset B will remain separate.")
print("Shared crops will be mapped later only where required.")
print("Original crop names will NOT be overwritten.")
print("Original datasets will NOT be merged during Phase 1.")


print("\n\nPHASE 1 DATA AUDIT COMPLETE")
print("=" * 70)