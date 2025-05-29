from rest_framework import serializers
from .models import User,Class,Student ,Attendance

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','is_teacher']