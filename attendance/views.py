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

    def get_queryset(self):
        user=self.request.user

        if user.is_teacher:
            return Class.objects.filter(teacher=user)
        else:
            return Class.objects.none()
        


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class=StudentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.is_teacher:
            teacher_classes = Class.objects.filter(teacher=user)
            return Student.objects.filter(school_class__in=teacher_classes).distinct()
        else:
            return Student.objects.none()
 
        

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True,methods=['post'])
    def sign_in(self,request,pk=None):
        attendance=self.get_object()
        attendance.sign_in_time = timezone.now()
        attendance.save()
        return Response({'status':'signed in'})
    
    @action(detail=True,methods=['post'])
    def sign_out(self,request,pk=None):
        attendance = self.get_object()
        attendance.sign_out_time = timezone.now()
        attendance.save()
        return Response({'status':'signed out'})
