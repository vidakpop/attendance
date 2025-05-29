from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    is_teacher = models.BooleanField(default=False)

class Class(models.Model):
    name = models.Charfield(max_length=100)
    teacher = models.Foreinkey(User, on_delete=models.CASCADE,related_name='classes')
    
    def _str__(self):
        return self.name
    
class Student(models.Model):
    name = models.Charfield(max_length=100)
    student_id = models.CharField(max_length=10,unique=True)
    school_class = models.ForeignKey(Class,on_delete=models.CASCADE,related_name='students')

    def __str__(self):
        return f"{self.name} ({self.student_id})"

class Attendance(models.Model):
    student = models.FGoreignKey(Student,on_delete=models.CASCADE)
    date=models.DateField(auto_now_add=True)
    sign_in_time = models.DateTimeField(null=True, blank=True)
    sign_out_time = models.DateTimeField(null=True, blank=True)
    marked_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    class Meta:
        unique_together = ('student', 'date')

