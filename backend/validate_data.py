import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

TELANGANA_FILE = DATA_DIR / "crop_data.csv"

FIVE_YEAR_FILES = list((DATA_DIR / "dataset_B").glob("*.csv"))


EXPECTED_CROPS = [
    "Rice",
    "Jowar",
    "Maize",
    "Red gram",
    "Green gram",
    "Black gram",
    "Bengal gram",
    "Groundnut",
    "Sunflower",
    "Chillies",
    "Onions",
    "Sugarcane",
    "Cotton",
    "Horticulture",
]


def validate_telanganadata():
    print("=" * 70)
    print("PHASE 6 — TELANGANA DATA VALIDATION")
    print("=" * 70)

    df = pd.read_csv(TELANGANA_FILE)

    print(f"\nRows: {len(df)}")
    print(f"Columns: {len(df.columns)}")

    # District validation
    districts = df["Districts"].dropna().astype(str).str.strip()

    print(f"\n✓ District count: {districts.nunique()}")

    if districts.nunique() == 31:
        print("✓ 31 districts confirmed")
    else:
        print("⚠ District count is NOT 31")

    # Duplicate validation
    duplicates = districts.duplicated().sum()

    print(f"✓ Duplicate districts: {duplicates}")

    if duplicates == 0:
        print("✓ No accidental duplicate districts")
    else:
        print("⚠ Duplicate districts found")

    # Crop validation
    missing_crops = [crop for crop in EXPECTED_CROPS if crop not in df.columns]

    if not missing_crops:
        print("✓ All expected crops present")
    else:
        print("⚠ Missing crops:")
        for crop in missing_crops:
            print(f"   - {crop}")

    # Numeric validation
    print("\nNumeric validation:")

    for crop in EXPECTED_CROPS:
        if crop in df.columns:
            numeric_values = pd.to_numeric(df[crop], errors="coerce")

            invalid = numeric_values.isna().sum()

            if invalid == 0:
                print(f"✓ {crop}: numeric")
            else:
                print(f"⚠ {crop}: {invalid} non-numeric/missing values")

    # Missing values
    print("\nMissing values:")

    missing = df.isna().sum()

    if missing.sum() == 0:
        print("✓ No missing values")
    else:
        for column, count in missing.items():
            if count > 0:
                print(f"⚠ {column}: {count}")


def validate_five_year_data():
    print("\n")
    print("=" * 70)
    print("PHASE 6 — FIVE-YEAR DATA VALIDATION")
    print("=" * 70)

    if not FIVE_YEAR_FILES:
        print("⚠ No five-year CSV file found")
        return

    file = FIVE_YEAR_FILES[0]

    print(f"\nFile: {file.name}")

    df = pd.read_csv(file)

    print(f"Rows: {len(df)}")
    print(f"Columns: {len(df.columns)}")

    print("\nColumns found:")

    for column in df.columns:
        print(f" - {column}")

    print("\nUnique values preview:")

    for column in df.columns:
        if df[column].nunique() <= 10:
            print(f"\n{column}:")
            print(df[column].dropna().unique())


if __name__ == "__main__":
    validate_telanganadata()
    validate_five_year_data()

    print("\n")
    print("=" * 70)
    print("VALIDATION COMPLETE")
    print("=" * 70)