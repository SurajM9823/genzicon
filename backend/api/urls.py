from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    admin_login, dashboard_overview,
    SiteContentViewSet, ImpactStatViewSet, ProjectViewSet, ClothesDonorViewSet,
    ClothesDonationViewSet, VolunteerViewSet, DonationRecordViewSet, ContactInquiryViewSet,
    ClothesHubConfigViewSet
)

router = DefaultRouter()
router.register(r'site-content', SiteContentViewSet, basename='site-content')
router.register(r'impact-stats', ImpactStatViewSet, basename='impact-stats')
router.register(r'projects', ProjectViewSet, basename='projects')
router.register(r'clothes-donors', ClothesDonorViewSet, basename='clothes-donors')
router.register(r'clothes', ClothesDonationViewSet, basename='clothes')
router.register(r'clothes-hub-config', ClothesHubConfigViewSet, basename='clothes-hub-config')
router.register(r'volunteers', VolunteerViewSet, basename='volunteers')
router.register(r'donations', DonationRecordViewSet, basename='donations')
router.register(r'contacts', ContactInquiryViewSet, basename='contacts')

urlpatterns = [
    path('auth/login/', admin_login, name='api_admin_login'),
    path('dashboard/overview/', dashboard_overview, name='api_dashboard_overview'),
    path('', include(router.urls)),
]
