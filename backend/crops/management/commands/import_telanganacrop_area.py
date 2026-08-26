import pandas as pd

from decimal import Decimal
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand

from crops.models import TelanganaCropArea


class Command(BaseCommand):
    help = "Import Telangana Crop Area Data"

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

        TelanganaCropArea.objects.all().delete()

        records_created = 0

        crop_columns = [
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

        for _, row in df.iterrows():

            district = str(row["Districts"]).strip().upper()

            for crop_name in crop_columns:

                TelanganaCropArea.objects.create(
                    district=district,
                    crop=crop_name,
                    area=clean(row[crop_name]),
                )

                records_created += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Telangana crop area imported successfully."
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Districts processed: {df['Districts'].nunique()}"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Crop categories: {len(crop_columns)}"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Database records created: {records_created}"
            )
        )