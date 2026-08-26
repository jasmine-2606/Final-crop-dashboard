from django.db.models import Sum, Avg

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Crop, CropTrend
from .serializers import CropSerializer, CropTrendSerializer


@api_view(["GET"])
def district_list(request):
    crops = Crop.objects.all().order_by("district")
    serializer = CropSerializer(crops, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def crop_list(request):
    crops = Crop.objects.all().order_by("district")
    serializer = CropSerializer(crops, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def state_summary(request):
    summary = Crop.objects.aggregate(
        rice=Sum("rice"),
        jowar=Sum("jowar"),
        maize=Sum("maize"),
        red_gram=Sum("red_gram"),
        green_gram=Sum("green_gram"),
        black_gram=Sum("black_gram"),
        bengal_gram=Sum("bengal_gram"),
        groundnut=Sum("groundnut"),
        sunflower=Sum("sunflower"),
        chillies=Sum("chillies"),
        onions=Sum("onions"),
        sugarcane=Sum("sugarcane"),
        cotton=Sum("cotton"),
        horticulture=Sum("horticulture"),
        total_acreage=Sum("total_acreage"),
    )

    return Response(summary)


@api_view(["GET"])
def leaderboards(request):
    top_rice = Crop.objects.order_by("-rice")[:5]
    top_cotton = Crop.objects.order_by("-cotton")[:5]
    top_maize = Crop.objects.order_by("-maize")[:5]

    return Response({
        "rice": CropSerializer(top_rice, many=True).data,
        "cotton": CropSerializer(top_cotton, many=True).data,
        "maize": CropSerializer(top_maize, many=True).data,
    })


@api_view(["GET"])
def diversity(request):
    result = []

    crop_fields = [
        "rice",
        "jowar",
        "maize",
        "red_gram",
        "green_gram",
        "black_gram",
        "bengal_gram",
        "groundnut",
        "sunflower",
        "chillies",
        "onions",
        "sugarcane",
        "cotton",
        "horticulture",
    ]

    for district in Crop.objects.all():
        count = 0

        for field in crop_fields:
            if getattr(district, field) > 0:
                count += 1

        result.append({
            "district": district.district,
            "crop_count": count,
        })

    result.sort(
        key=lambda x: x["crop_count"],
        reverse=True
    )

    return Response(result)


@api_view(["GET"])
def alerts(request):
    alerts = []

    for district in Crop.objects.all():
        if district.total_acreage == 0:
            alerts.append({
                "district": district.district,
                "message": "No crop acreage available",
            })

    return Response(alerts)


@api_view(["GET"])
def crop_trends(request):
    trends = CropTrend.objects.all().order_by(
        "year",
        "crop"
    )

    year = request.GET.get("year")
    season = request.GET.get("season")
    crop = request.GET.get("crop")

    if year:
        trends = trends.filter(year=year)

    if season:
        trends = trends.filter(
            season__iexact=season
        )

    if crop:
        trends = trends.filter(
            crop__iexact=crop
        )

    serializer = CropTrendSerializer(
        trends,
        many=True
    )

    return Response(serializer.data)

@api_view(["GET"])
def production(request):
    trends = CropTrend.objects.all().order_by(
        "year",
        "crop"
    )

    serializer = CropTrendSerializer(
        trends,
        many=True
    )

    return Response(serializer.data)


@api_view(["GET"])
def production_summary(request):
    summary = CropTrend.objects.aggregate(
        total_area=Sum("area"),
        total_production=Sum("production"),
        average_yield=Avg("yield_value"),
    )

    return Response(summary)
