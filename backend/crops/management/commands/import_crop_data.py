import pandas as pd

from decimal import Decimal
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand

from crops.models import Crop


class Command(BaseCommand):
    help = "Import Telangana Crop Data"

    def handle(self, *args, **kwargs):

        file_path = Path(settings.CROP_CSV_FILE)

        if not file_path.exists():
            self.stdout.write(
                self.style.ERROR(f"CSV file not found: {file_path}")
            )
            return

        try:
            df = pd.read_csv(file_path)
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Unable to read CSV: {e}")
            )
            return

        df = df.fillna(0)

        required_columns = [
            "Districts",
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

        missing = [col for col in required_columns if col not in df.columns]

        if missing:
            self.stdout.write(
                self.style.ERROR(
                    f"Missing columns: {', '.join(missing)}"
                )
            )
            return

        Crop.objects.all().delete()

        def clean(value):
            if pd.isna(value):
                return Decimal("0")

            value = str(value).strip()

            if value in ("", "-"):
                return Decimal("0")

            try:
                return Decimal(value)
            except Exception:
                return Decimal("0")

        for _, row in df.iterrows():

            district = str(row["Districts"]).strip().upper()

            total = (
                clean(row["Rice"])
                + clean(row["Jowar"])
                + clean(row["Maize"])
                + clean(row["Red gram"])
                + clean(row["Green gram"])
                + clean(row["Black gram"])
                + clean(row["Bengal gram"])
                + clean(row["Groundnut"])
                + clean(row["Sunflower"])
                + clean(row["Chillies"])
                + clean(row["Onions"])
                + clean(row["Sugarcane"])
                + clean(row["Cotton"])
                + clean(row["Horticulture"])
            )

            Crop.objects.create(
                district=district,

                rice=clean(row["Rice"]),
                jowar=clean(row["Jowar"]),
                maize=clean(row["Maize"]),

                red_gram=clean(row["Red gram"]),
                green_gram=clean(row["Green gram"]),
                black_gram=clean(row["Black gram"]),
                bengal_gram=clean(row["Bengal gram"]),

                groundnut=clean(row["Groundnut"]),
                sunflower=clean(row["Sunflower"]),

                chillies=clean(row["Chillies"]),
                onions=clean(row["Onions"]),

                sugarcane=clean(row["Sugarcane"]),
                cotton=clean(row["Cotton"]),
                horticulture=clean(row["Horticulture"]),

                total_acreage=total,

                is_hyderabad_urban=(district == "HYDERABAD"),
            )

        self.stdout.write(
            self.style.SUCCESS("Crop data imported successfully.")
        )