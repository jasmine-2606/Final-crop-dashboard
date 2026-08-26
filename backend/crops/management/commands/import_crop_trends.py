import pandas as pd

from decimal import Decimal
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand

from crops.models import CropTrend


class Command(BaseCommand):
    help = "Import 5-Year Crop Trend Data"

    def handle(self, *args, **kwargs):

        file_path = (
            Path(settings.BASE_DIR)
            / "data"
            / "dataset_B"
            / "All-India_-Crop-wise-Area,-Production-&-Yield.csv"
        )

        if not file_path.exists():
            self.stdout.write(
                self.style.ERROR(
                    f"CSV file not found: {file_path}"
                )
            )
            return

        try:
            df = pd.read_csv(file_path)
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(
                    f"Unable to read CSV: {e}"
                )
            )
            return

        required_columns = [
            "Crop",
            "Season",
            "Area-2021-22",
            "Area-2022-23",
            "Area-2023-24",
            "Area-2024-25",
            "Area-2025-26",
            "Production-2021-22",
            "Production-2022-23",
            "Production-2023-24",
            "Production-2024-25",
            "Production-2025-26",
            "Yield-2021-22",
            "Yield-2022-23",
            "Yield-2023-24",
            "Yield-2024-25",
            "Yield-2025-26",
        ]

        missing = [
            column
            for column in required_columns
            if column not in df.columns
        ]

        if missing:
            self.stdout.write(
                self.style.ERROR(
                    f"Missing columns: {', '.join(missing)}"
                )
            )
            return

        # ==========================================
        # CLEAN VALUES
        # IMPORTANT:
        # Missing source values remain NULL.
        # They are NOT converted to zero.
        # ==========================================

        def clean(value):

            if pd.isna(value):
                return None

            value = str(value).strip()

            if value in ("", "-"):
                return None

            try:
                return Decimal(value)
            except Exception:
                return None

        # ==========================================
        # CLEAR OLD DATA
        # ==========================================

        CropTrend.objects.all().delete()

        years = [
            "2021-22",
            "2022-23",
            "2023-24",
            "2024-25",
            "2025-26",
        ]

        records_created = 0

        # ==========================================
        # IMPORT DATA
        # ==========================================

        for _, row in df.iterrows():

            crop = str(row["Crop"]).strip()
            season = str(row["Season"]).strip()

            for year in years:

                CropTrend.objects.create(
                    crop=crop,
                    season=season,
                    year=int(year[:4]),
                    area=clean(
                        row[f"Area-{year}"]
                    ),
                    production=clean(
                        row[f"Production-{year}"]
                    ),
                    yield_value=clean(
                        row[f"Yield-{year}"]
                    ),
                )

                records_created += 1

        # ==========================================
        # RESULT
        # ==========================================

        self.stdout.write(
            self.style.SUCCESS(
                "5-year crop trend data imported successfully."
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Original CSV records: {len(df)}"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Years processed: {len(years)}"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Database records created: {records_created}"
            )
        )