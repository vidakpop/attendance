from django.contrib import admin
from .models import Attendance, Student, Class, User
admin.site.register(User)
admin.site.register(Class)
admin.site.register(Student)
admin.site.register(Attendance)


