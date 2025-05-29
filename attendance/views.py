from django.shortcuts import render
from rest_framework import viewsets,permissions ,status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Class,Student,Attendance
from .serializer import ClassSerializer,StudentSerializer,AttendanceSerializer
from django.utils import timezone

class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    serializer_class =ClassSerializer
    permission_classes = [permissions.IsAuthenticated]

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class=AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

