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

    def get_queryset(self):
        user =  self.request.user
        # Teacher can see attendance for students in their classes
        if user.is_teacher:
            return Attendance.objects.filter(school_class__teacher=user)
        else:
            return Attendance.objects.none()
    

    @action(detail=True,methods=['post'])
    def sign_in(self,request,pk=None):
        attendance=self.get_object()
        # Check if this attendance record already has a sign-in time
        if attendance.sign_in_time is not None:
            return Response({'status':'already signed in'}, status=status.HTTP_400_BAD_REQUEST)
        
        #update the sign in tiem for a student not signed in
        attendance.sign_in_time = timezone.now()
        attendance.marked_by = request.user
        attendance.save()
        return Response({'status':'signed in'})
    
    @action(detail=False,methods=['post'])
    def bulk_sign_in(self,request):
        #sign in multiple students at once
        student_ids = request.data.get('student_ids',[])
        class_id = request.data.get('class_id')

        if not student_ids:
            today= timezone.now().date()
            records_created = 0
            errors= []

        for student_id in student_ids:
            try:
                student=Student.objects.get(id=student_id)
                # Create or get attendance record for today
                attendance,created =Attendance.objects.get_or_create(
                    student=student,
                    date=today,
                    defaults=(
                    'sign_in_time' = timezone.now(),
                    'marked_by' = request.user,
                    )
                )
                if not created and attendance.sign_in_time is None:
                    #record exists but no sign in time
                    attendance.sign_in_time = timezone.now()
                    attendance.marked_by= request.user
                    attendance.save()
                    records_created += 1
                elif created:
                    records_created += 1 
            except Student.DoesNotExist:
                errors.append(f'Student ID {student_id}')
            except Exception as e:
                errors.append(f'Error processing student ID {student_id}: {str(e)}')
        return Response({
            'status': f'Signed in {records_created} students',
            'errors':errors if errors else None
        })        

    
    @action(detail=True,methods=['post'])
    def sign_out(self,request,pk=None):
        attendance = self.get_object()
        attendance.sign_out_time = timezone.now()
        attendance.save()
        return Response({'status':'signed out'})
