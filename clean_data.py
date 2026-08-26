import pandas as pd
from pathlib import Path

# ============================================================
# PHASE 3 — DATA CLEANING
# STEP 2 — TELANGANA DATA
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

INPUT_FILE = BASE_DIR / "backend" / "data" / "dataset_A" / "Area under different Crops.csv"
OUTPUT_FILE = BASE_DIR / "processed_data" / "telangana_cleaned.csv"


# ------------------------------------------------------------
# Load original CSV
# ------------------------------------------------------------

df = pd.read_csv(INPUT_FILE)


# ------------------------------------------------------------
# Clean column names
# ------------------------------------------------------------

df.columns = df.columns.str.strip()


# ------------------------------------------------------------
# Clean district names
# ------------------------------------------------------------

df["Districts"] = df["Districts"].astype(str).str.strip()


# ------------------------------------------------------------
# Convert "-" and blank values to missing values
# ------------------------------------------------------------

df = df.replace(["-", "", " "], pd.NA)


# ------------------------------------------------------------
# Convert crop columns to numeric
# ------------------------------------------------------------

crop_columns = df.columns.drop("Districts")

for column in crop_columns:
    df[column] = pd.to_numeric(df[column], errors="coerce")


# ------------------------------------------------------------
# Save cleaned dataset
# ------------------------------------------------------------

OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

df.to_csv(OUTPUT_FILE, index=False)


# ------------------------------------------------------------
# Verification
# ------------------------------------------------------------

print("=" * 70)
print("PHASE 3 — TELANGANA DATA CLEANING")
print("=" * 70)

print("\nOriginal rows:", len(df))

print("\nColumns:")
for column in df.columns:
    print(" -", column)

print("\nMissing values:")
print(df.isna().sum())

print("\nDistrict names:")
print(df["Districts"].tolist())

print("\nSaved cleaned file:")
print(OUTPUT_FILE)

print("\nTELANGANA CLEANING COMPLETED")
# ============================================================
# PHASE 3 — NATIONAL DATA
# STEP 5 — CLEAN AND TRANSFORM NATIONAL DATA
# ============================================================

NATIONAL_INPUT = (
    BASE_DIR
    / "backend"
    / "data"
    / "dataset_B"
    / "All-India_-Crop-wise-Area,-Production-&-Yield.csv"
)

NATIONAL_OUTPUT = (
    BASE_DIR
    / "processed_data"
    / "national_cleaned.csv"
)


# ------------------------------------------------------------
# Load national CSV
# ------------------------------------------------------------

national_df = pd.read_csv(NATIONAL_INPUT)

national_df.columns = national_df.columns.str.strip()


# ------------------------------------------------------------
# Display columns for verification
# ------------------------------------------------------------

print("\n" + "=" * 70)
print("NATIONAL DATA — ORIGINAL COLUMNS")
print("=" * 70)

for column in national_df.columns:
    print(" -", column)


# ------------------------------------------------------------
# Clean text columns
# ------------------------------------------------------------

for column in national_df.select_dtypes(include="object").columns:
    national_df[column] = national_df[column].astype(str).str.strip()


# ------------------------------------------------------------
# Convert missing representations
# ------------------------------------------------------------

national_df = national_df.replace(
    ["-", "", " ", "NA", "N/A"],
    pd.NA
)


# ------------------------------------------------------------
# Identify year columns
# ------------------------------------------------------------

area_columns = [
    column for column in national_df.columns
    if column.startswith("Area-")
]

production_columns = [
    column for column in national_df.columns
    if column.startswith("Production-")
]

yield_columns = [
    column for column in national_df.columns
    if column.startswith("Yield-")
]


# ------------------------------------------------------------
# Convert wide structure to long structure
# ------------------------------------------------------------

records = []

for _, row in national_df.iterrows():

    crop = row["Crop"]
    season = row["Season"]

    for area_column in area_columns:

        year = area_column.replace("Area-", "")

        production_column = f"Production-{year}"
        yield_column = f"Yield-{year}"

        records.append({
            "Crop": crop,
            "Season": season,
            "Year": year,
            "Area": row[area_column],
            "Production": row[production_column],
            "Yield": row[yield_column]
        })


national_cleaned = pd.DataFrame(records)

# ------------------------------------------------------------
# Convert numeric columns
# ------------------------------------------------------------

for column in ["Area", "Production", "Yield"]:
    national_cleaned[column] = pd.to_numeric(
        national_cleaned[column],
        errors="coerce"
    )


# ------------------------------------------------------------
# Save processed national dataset
# ------------------------------------------------------------

NATIONAL_OUTPUT.parent.mkdir(parents=True, exist_ok=True)

national_cleaned.to_csv(
    NATIONAL_OUTPUT,
    index=False
)


# ------------------------------------------------------------
# Verification
# ------------------------------------------------------------

print("\n" + "=" * 70)
print("NATIONAL DATA — CLEANING COMPLETED")
print("=" * 70)

print("\nRows:", len(national_cleaned))

print("\nColumns:")
for column in national_cleaned.columns:
    print(" -", column)

print("\nMissing values:")
print(national_cleaned.isna().sum())

print("\nFirst 10 rows:")
print(national_cleaned.head(10).to_string(index=False))

print("\nSaved cleaned file:")
print(NATIONAL_OUTPUT)