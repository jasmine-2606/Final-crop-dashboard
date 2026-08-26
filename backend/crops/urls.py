from django.urls import path

from . import views


urlpatterns = [

    path(
        "crops/",
        views.district_list,
        name="crops",
    ),

    path(
        "districts/",
        views.district_list,
        name="districts",
    ),

    path(
        "state-summary/",
        views.state_summary,
        name="state-summary",
    ),

    path(
        "leaderboards/",
        views.leaderboards,
        name="leaderboards",
    ),

    path(
        "diversity/",
        views.diversity,
        name="diversity",
    ),

    path(
        "alerts/",
        views.alerts,
        name="alerts",
    ),
path(
    "crop-trends/",
    views.crop_trends,
    name="crop-trends",
),

path(
    "production/",
    views.production,
    name="production",
),

path(
    "production-summary/",
    views.production_summary,
    name="production-summary",
),
]