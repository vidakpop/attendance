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
        # Check for either parameter name (class_id or school_class)
        class_id = self.request.query_params.get('class_id', None)
        if class_id is None:
            class_id = self.request.query_params.get('school_class', None)
            
        print(f"Filtering students with class_id: {class_id}")
        
        if user.is_teacher:
            if class_id:
                # If class_id is provided, ONLY return students from that specific class
                return Student.objects.filter(school_class_id=class_id, school_class__teacher=user).distinct()
            else:
                # If no class_id, return all students taught by this teacher
                return Student.objects.filter(school_class__teacher=user).distinct()
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
