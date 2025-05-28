from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    is_teacher = models.BooleanField(default=False)

class Class(models.Model):
    name = models.Charfield(max_length=100)
    teacher = models.Foreinkey(User, on_delete=models.CASCADE,related_name='classes')
    
    def _str__(self):
        return self.name
    