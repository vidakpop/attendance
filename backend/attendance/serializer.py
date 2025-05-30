from rest_framework import serializers
from .models import User,Class,Student ,Attendance

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','is_teacher']

class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        models = Class
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Student
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    Student = StudentSerializer(read_only=True)

    class Meta:
        model=Attendance
        fields = '__all__'
        