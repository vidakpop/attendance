from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClassViewSet, StudentViewSet, AttendanceViewSet

router = DefaultRouter()
router.register(r'classes', ClassViewSet)
router.register(r'students',StudentViewSet)
router.register(r'attendance', AttendanceViewSet)

urlpatterns = [
    path('',include(router.urls))
]