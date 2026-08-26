from django.db import models


class Crop(models.Model):

    district = models.CharField(max_length=100, unique=True)

    rice = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    jowar = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    maize = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    red_gram = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    green_gram = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    black_gram = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    bengal_gram = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    groundnut = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    sunflower = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    chillies = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    onions = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    sugarcane = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    cotton = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    horticulture = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    total_acreage = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=0
    )

    is_hyderabad_urban = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.district


class TelanganaCropArea(models.Model):

    district = models.CharField(max_length=100)

    crop = models.CharField(max_length=100)

    area = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=0
    )

    def __str__(self):
        return f"{self.district} - {self.crop}"


class CropTrend(models.Model):

    crop = models.CharField(max_length=100)

    season = models.CharField(max_length=50)

    year = models.IntegerField()

    area = models.DecimalField(
    max_digits=14,
    decimal_places=2,
    null=True,
    blank=True
    )

    production = models.DecimalField(
    max_digits=14,
    decimal_places=2,
    null=True,
    blank=True
    )

    yield_value = models.DecimalField(
    max_digits=14,
    decimal_places=2,
    null=True,
    blank=True
    )

    def __str__(self):
        return f"{self.crop} - {self.season} - {self.year}"