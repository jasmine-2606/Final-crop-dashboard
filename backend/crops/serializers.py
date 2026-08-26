from rest_framework import serializers
from .models import Crop, CropTrend


class CropSerializer(serializers.ModelSerializer):

    class Meta:
        model = Crop
        fields = "__all__"


class CropTrendSerializer(serializers.ModelSerializer):

    class Meta:
        model = CropTrend
        fields = "__all__"